import React, { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ClusterContext } from "@/context/cluster-context";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

const CLUSTERS = ["devnet", "testnet"];

const AMOUNTS = ["0.1", "0.5", "1", "1.5"];

export default function Faucet() {
  const [amount, setAmount] = useState("0.5");
  const [tx, setTx] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  const { cluster, setCluster } = useContext(ClusterContext);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (pubKey) {
          const balance = await connection.getBalance(pubKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        alert(error);
        console.error("Error: ", error);
      }
    };
    getBalance();
  }, [publicKey]);

  let pubKey: PublicKey;
  if (publicKey) {
    pubKey = new PublicKey(publicKey);
  }
  const isDisabled = !amount || !publicKey;
  const handleDropSol = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const tx = await connection.requestAirdrop(
        pubKey,
        Number(amount) * LAMPORTS_PER_SOL
      );

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          signature: tx,
          ...latestBlockHash,
        },
        "confirmed"
      );
      console.log(tx);
      setTx(tx);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function sendTokens(e: React.FormEvent) {
    console.log("sending toen");
    e.preventDefault();
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: pubKey,
        toPubkey: new PublicKey("<YOUR_PUBLIC_KEY_HERE>"),
        lamports: 0.1 * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendTransaction(transaction, connection);
    console.log(signature);
    alert("Sent " + amount + " SOL to " + "<YOUR_PUBLIC_KEY_HERE>");
  }
  return (
    <div className="w-[19rem] md:min-w-xl mx-auto mt-16 bg-muted/30 rounded-3xl p-12 border border-muted-foreground/10 shadow-lg text-lg">
      <div className="flex items-center justify-between mb-10">
        <h2 className="md:text-2xl font-semibold mr-6 select-none">
          Request Airdrop
        </h2>
        <div className="ml-6">
          <Select value={cluster} onValueChange={setCluster}>
            <SelectTrigger className="w-[130px] text-lg cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLUSTERS.map((cluster) => (
                <SelectItem
                  key={cluster}
                  value={cluster}
                  className="cursor-pointer text-lg"
                >
                  {cluster}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <form onSubmit={handleDropSol}>
        <div className="flex gap-6 mb-8 items-center">
          <Input
            readOnly
            placeholder="Wallet Address"
            value={publicKey?.toString() || "Please connect your wallet"}
            className="text-lg py-3 px-4 cursor-pointer"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[130px] text-lg py-3 px-4 cursor-pointer"
              >
                {amount ? `${amount} SOL` : "Amount"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-3">
              <ToggleGroup
                type="single"
                value={amount.toString()}
                onValueChange={setAmount}
                className="flex gap-3"
              >
                {AMOUNTS.map((amt) => (
                  <ToggleGroupItem
                    key={amt}
                    value={amt}
                    aria-label={amt + " sol"}
                    className="px-6 py-2 text-lg cursor-pointer"
                  >
                    {amt}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          type="submit"
          className="w-full mt-4 text-lg py-3 px-4 cursor-pointer"
          disabled={isDisabled}
        >
          {isLoading ? "Dropping SOL..." : "Drop SOL"}
        </Button>
      </form>
      {balance !== 0 && (
        <p className="text-center mt-5">Your current balance is: {balance}</p>
      )}
      {tx !== "" && (
        <div className="mt-4">
          <Link
            href={`https://explorer.solana.com/tx/${"32VNaVtCWWz4HYZ3wHLYRJhmKZoS22M9Fj7gagy1ExRhW7EVteVRVyL1Y86Y4rAK6hbNReEFup6kgqyQEB2vdan"}?cluster=${cluster}`}
            target="_blank"
            className="text-blue-500 justify-center hover:text-blue-600 flex items-center gap-2"
          >
            View transaction on Solana Explorer
            <ExternalLinkIcon className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
