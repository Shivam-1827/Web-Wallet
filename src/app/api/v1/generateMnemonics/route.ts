import { generateMnemonic } from "bip39";
import prisma from "./../../../lib/db";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "mysecretkey");
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkExisting = await prisma.userMnemonic.findFirst({
      where: { userId },
    });

    if (checkExisting) {
      return NextResponse.json(
        { error: "Mnemonic already generated for this user" },
        { status: 400 }
      );
    }

    const mnemonics = generateMnemonic();

    const response = await prisma.userMnemonic.create({
      data: {
        userId,
        mnemonic: mnemonics,
      },
    });

    return NextResponse.json({ mnemonics, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
