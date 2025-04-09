import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "./.././../../../lib/db";
import { mnemonicToSeed } from "bip39";
import { HDNodeWallet } from "ethers";
import { WalletType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY || "mysecretkey");
    } catch (err) {
      console.error("Invalid token:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // Fetch user's mnemonic and wallets
    const userMnemonic = await prisma.userMnemonic.findFirst({
      where: { userId },
      include: { wallets: true },
    });

    if (!userMnemonic) {
      return NextResponse.json({ error: "Mnemonic not found" }, { status: 404 });
    }

    const mnemonic = userMnemonic.mnemonic;
    const existingWallets = userMnemonic.wallets;

    // Account index = how many sets of 4 wallets the user already has
    const accountIndex = Math.floor(existingWallets.length / 4);

    // Generate seed and root node
    const seed = await mnemonicToSeed(mnemonic);
    const rootNode = HDNodeWallet.fromSeed(seed);

    const walletTypes = Object.values(WalletType);
    const newWallets = [];

    for (let i = 0; i < walletTypes.length; i++) {
      const walletType = walletTypes[i];

      // Use unique derivation path: accountIndex determines account group
      const path = `m/44'/${getCoinType(walletType)}'/${accountIndex}'/0/${i}`;
      const child = rootNode.derivePath(path);

      // Check for existing address (should not happen if paths are unique, but still safe)
      const existing = await prisma.wallet.findUnique({
        where: { address: child.address },
      });

      if (existing) {
        console.warn(`Wallet address already exists: ${child.address}, skipping...`);
        continue;
      }

      // Create new wallet in DB
      const wallet = await prisma.wallet.create({
        data: {
          type: walletType,
          privateKey: child.privateKey,
          publicKey: child.publicKey,
          address: child.address,
          userMnemonicId: userMnemonic.id,
          balances: {
            create: {
              token: walletType,
              amount: 1000,
            },
          },
        },
      });

      newWallets.push(wallet);
    }

    return NextResponse.json({ success: true, wallets: newWallets });

  } catch (err) {
    console.error("Create Account Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function getCoinType(walletType: WalletType): number {
  switch (walletType) {
    case WalletType.ETH:
      return 60;
    case WalletType.BTC:
      return 0;
    case WalletType.SOL:
      return 501;
    case WalletType.POLYGON:
      return 60;
    default:
      return 60;
  }
}
