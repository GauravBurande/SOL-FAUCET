"use client";
import Faucet from "@/components/faucet";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 pb-10 gap-16 sm:p-20">
      <Header />
      <Faucet />
      <Footer />
    </div>
  );
}
