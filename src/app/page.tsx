"use client";
import { BalanceDisplay } from "@/components/balance-display";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendSol = async (event: any) => {
    event.preventDefault();

    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      // const recipientPubKey = new PublicKey(event.currentTarget.recipient.value);
      const recipientPubKey = new PublicKey(
        prompt("enter the wallet address: ")!
      );

      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      transaction.add(sendSolInstruction);

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-semibold">SOLANA dapp</h1>
        <BalanceDisplay />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <WalletMultiButton />
          <button
            onClick={sendSol}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          >
            Send someone SOL
          </button>
        </div>
      </main>
    </div>
  );
}
