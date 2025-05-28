import { useContext, useState } from "react";
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

const CLUSTERS = ["devnet", "testnet"];

const AMOUNTS = ["0.1", "0.5", "1", "1.5"];

export default function Faucet() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { cluster, setCluster } = useContext(ClusterContext);

  const isDisabled = !address || !amount;

  const handleDropSol = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Drop SOL", { cluster, address, amount });
  };

  console.log("amount", amount);
  return (
    <div className="max-w-lg mx-auto mt-16 bg-muted/30 rounded-3xl p-12 border border-muted-foreground/10 shadow-lg text-lg">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-semibold mr-6 select-none">
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
            placeholder="Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
                value={amount}
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
          Drop SOL
        </Button>
      </form>
    </div>
  );
}
