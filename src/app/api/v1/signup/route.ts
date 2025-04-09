// /app/api/v1/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import zod from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/db";

const signupSchema = zod.object({
  username: zod.string().min(3),
  email: zod.string().email(),
  password: zod.string().min(8).refine(
    (val) =>
      /[a-zA-Z]/.test(val) &&
      /\d/.test(val) &&
      /[^a-zA-Z0-9]/.test(val),
    {
      message:
        "Password must contain at least one letter, one number, and one special character",
    }
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = signupSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { username, email, password } = parsedData.data;
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    
    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
      
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    
    const payload = { 
      id: newUser.id, 
      username: newUser.username,
      email: newUser.email 
    };
    
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY || "mysecretkey",
      { expiresIn: "1d" }
    );
    
    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
    
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });
    
    return response;
  } catch (error) {
    console.error("Signup Error: ", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}