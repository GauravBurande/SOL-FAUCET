"use client";
import { BalanceDisplay } from "@/components/balance-display";
import Header from "@/components/header";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-semibold">SOLANA dapp</h1>
        <BalanceDisplay />

        <WalletMultiButton />
      </main>
    </div>
  );
}
