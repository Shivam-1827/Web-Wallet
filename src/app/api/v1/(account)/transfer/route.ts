
import { NextRequest, NextResponse } from "next/server";
import prisma from "./../../../../lib/db"; 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from, to, amount, cryptoType } = body;

    if (!from || !to || !cryptoType || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid transfer input" }, { status: 400 });
    }

    const [senderWallet, receiverWallet] = await Promise.all([
      prisma.wallet.findUnique({
        where: { address: from },
        include: { balances: true },
      }),
      prisma.wallet.findUnique({
        where: { address: to },
        include: { balances: true },
      }),
    ]);

    if (!senderWallet || !receiverWallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (senderWallet.address === receiverWallet.address) {
      return NextResponse.json({ error: "Cannot transfer to self" }, { status: 400 });
    }

    if (senderWallet.type !== cryptoType || receiverWallet.type !== cryptoType) {
      return NextResponse.json({ error: `Both wallets must be of type ${cryptoType}` }, { status: 400 });
    }

    const senderBalance = senderWallet.balances.find(
      (b) => b.token.toLowerCase() === cryptoType.toLowerCase()
    );

    if (!senderBalance || senderBalance.amount < amount) {
      return NextResponse.json({ error: `Insufficient ${cryptoType} balance` }, { status: 400 });
    }

    const receiverBalance = receiverWallet.balances.find(
      (b) => b.token.toLowerCase() === cryptoType.toLowerCase()
    );

    await prisma.$transaction(async (tx) => {
      await tx.balance.update({
        where: { id: senderBalance.id },
        data: { amount: { decrement: amount } },
      });

      if (receiverBalance) {
        await tx.balance.update({
          where: { id: receiverBalance.id },
          data: { amount: { increment: amount } },
        });
      } else {
        await tx.balance.create({
          data: {
            walletId: receiverWallet.id,
            token: cryptoType,
            amount,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Transfer successful",
      details: {
        from,
        to,
        cryptoType,
        amount,
        remainingBalance: senderBalance.amount - amount,
      },
    });
  } catch (error) {
    console.error("Transfer failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
