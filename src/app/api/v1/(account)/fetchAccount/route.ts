import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "./../../../../lib/db"; 
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "mysecretkey");
    const userId = decoded.id;

    const userMnemonic = await prisma.userMnemonic.findFirst({
      where: { userId },
      include: {
        wallets: {
          include: {
            balances: true,
          },
        },
      },
    });

    if (!userMnemonic) {
      return NextResponse.json({ error: "Mnemonic not found" }, { status: 404 });
    }

    const groupedAccounts: Record<string, any[]> = {};

    userMnemonic.wallets.forEach((wallet, index) => {
      const accountIndex = Math.floor(index / 4);
      if (!groupedAccounts[accountIndex]) {
        groupedAccounts[accountIndex] = [];
      }
      groupedAccounts[accountIndex].push(wallet);
    });

    return NextResponse.json({ success: true, accounts: groupedAccounts });
  } catch (err) {
    console.error("Fetch Accounts Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
