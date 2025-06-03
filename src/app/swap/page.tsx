"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, ExternalLinkIcon, Rocket, Wallet } from "lucide-react";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { debounce, formatAmount } from "@/lib/utils";
import { VersionedTransaction } from "@solana/web3.js";
import Link from "next/link";

const TOKENS = [
  {
    symbol: "SOL",
    balanceKey: "SOL",
    name: "Solana",
    logo: "https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png",
    decimals: 9,
    mint: "So11111111111111111111111111111111111111112",
  },
  {
    symbol: "USDC",
    balanceKey: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USD Coin",
    logo: "https://cdn3d.iconscout.com/3d/premium/thumb/usdc-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--usd-crypto-cryptocurrency-pack-science-technology-icons-6044475.png",
    decimals: 6,
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
];

export default function Swap() {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [solscanLink, setSolscanLink] = useState(
    "https://solscan.io/tx/4YQqdnTZqPyetKcwXL4ZDKHk5QV1GNnWcYyrvNq88NBhxUrGtcSmaemZ7wqYWHxxh8NRdpsmxov2aCsfhZHHdmKc"
  );

  const initialBalances = {
    [TOKENS[0].balanceKey]: 0,
    [TOKENS[1].balanceKey]: 0,
  };

  const [balances, setBalances] = useState(initialBalances);

  const fromTokenSymbol = fromToken.balanceKey;
  const toTokenSymbol = toToken.balanceKey;

  const { publicKey, signTransaction } = useWallet();
  const taker = publicKey?.toBase58();

  useEffect(() => {
    if (publicKey) {
      getBalance();
    }
  }, [publicKey]);

  useEffect(() => {
    if (balances[fromTokenSymbol] !== 0) {
      const debounced = debounce(getOrder, 0.5);
      debounced();
    }
  }, [fromAmount]);

  const getBalance = async () => {
    try {
      const balancesResponse = await (
        await fetch(`https://lite-api.jup.ag/ultra/v1/balances/${taker}`)
      ).json();

      console.log(JSON.stringify(balancesResponse, null, 2));
      const balances: any = {};
      Object.keys(balancesResponse).map((token: string) => {
        const amount = balancesResponse[token].uiAmount;
        balances[token] = amount;
      });
      setBalances(balances);
    } catch (e) {
      console.log(e);
      setBalances(initialBalances);
      alert("Error fetching balances");
    }
  };

  const getOrder = async () => {
    setOrder(null);
    try {
      const amountLamports = Math.floor(
        Number(fromAmount) * 10 ** fromToken.decimals
      );
      if (!amountLamports || amountLamports <= 0) {
        return;
      }
      const url = `https://lite-api.jup.ag/ultra/v1/order?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${amountLamports}&taker=${taker}`;
      const res = await fetch(url);
      const data = await res.json();
      setOrder(data);
      setToAmount(formatAmount(data.outAmount, toToken.decimals, 6));
    } catch (e) {
      setOrder(null);
      setToAmount("");
      alert("Error fetching order");
    }
  };

  const handleSwap = async () => {
    console.log("handleSwap");
    setIsSwapping(true);
    try {
      if (!signTransaction) {
        alert("Please connect your wallet");
        return;
      }
      const swapTxn = order.transaction;
      const requestId = order.requestId;
      console.log("swptxn", swapTxn);
      console.log("reqid", requestId);
      if (swapTxn && requestId) {
        const txBytes = Buffer.from(swapTxn, "base64");
        const transaction = VersionedTransaction.deserialize(txBytes);
        console.log("transaction", transaction);

        const signedTx = await signTransaction(transaction);
        const signedTxBs64 = Buffer.from(signedTx.serialize()).toString(
          "base64"
        );
        // todo: learn about V1 transactions
        const executeResponse = await (
          await fetch("https://lite-api.jup.ag/ultra/v1/execute", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              signedTransaction: signedTxBs64,
              requestId,
            }),
          })
        ).json();

        if (executeResponse.status === "Success") {
          console.log(
            "Swap successful:",
            JSON.stringify(executeResponse, null, 2)
          );
          const explorerLink = `https://solscan.io/tx/${executeResponse.signature}`;
          setSolscanLink(explorerLink);
          console.log(explorerLink);
        } else {
          console.error(
            "Swap failed:",
            JSON.stringify(executeResponse, null, 2)
          );
          alert("The swp failed! Your tokens are safe though.");
          console.log(`https://solscan.io/tx/${executeResponse.signature}`);
        }
      }
    } catch (e) {
      console.log(e);
      alert("Error swapping");
    } finally {
      setIsSwapping(false);
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(Number(value));
    setOrder(null);
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setOrder(null);
    setFromAmount(0);
    setToAmount("");
  };

  const handleMax = () => {
    setFromAmount(balances[fromTokenSymbol]);
    setOrder(null);
    setToAmount("");
  };

  // Calculate rate if order exists
  let rate = "";
  if (order && order.inAmount && order.outAmount) {
    const inAmt = Number(order.inAmount) / 10 ** fromToken.decimals;
    const outAmt = Number(order.outAmount) / 10 ** toToken.decimals;
    if (inAmt > 0) {
      rate = (outAmt / inAmt).toFixed(6).replace(/\.?0+$/, "");
    }
  }

  // Route plan
  const routePlan = order?.routePlan || [];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="absolute top-4 right-4">
        <WalletMultiButton />
      </div>
      <div className="bg-foreground/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-lg max-w-xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Rocket />
          Instant Swap
        </h2>
        {/* From Token */}
        <div className="bg-foreground/10 rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image
                width={28}
                height={28}
                src={fromToken.logo}
                alt={fromToken.symbol}
                className="w-7 h-7 object-cover object-center rounded-full"
              />
              <span className="font-semibold">{fromToken.symbol}</span>
            </div>
            <span className="text-xs flex items-center gap-1 text-foreground/70">
              <Wallet className="w-3 h-3" />{" "}
              {balances[fromTokenSymbol] ? balances[fromTokenSymbol] : 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="bg-transparent border-none text-2xl font-semibold focus:ring-0 focus-visible:ring-0"
              placeholder="0.00"
              value={fromAmount}
              onChange={handleFromAmountChange}
              type="number"
              min={0}
              max={balances[fromTokenSymbol]}
              disabled={isSwapping}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-400 px-2 py-1"
              onClick={handleMax}
              type="button"
              disabled={isSwapping}
            >
              MAX
            </Button>
          </div>
        </div>

        {/* Switch Arrow */}
        <div className="flex justify-center my-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-foreground/10 hover:bg-foreground/20 cursor-pointer"
            onClick={handleSwitchTokens}
            aria-label="Switch tokens"
            type="button"
            disabled={isSwapping}
          >
            <ArrowDown className="w-6 h-6" />
          </Button>
        </div>

        {/* To Token */}
        <div className="bg-foreground/10 rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image
                width={28}
                height={28}
                src={toToken.logo}
                alt={toToken.symbol}
                className="w-7 h-7 object-cover object-center rounded-full"
              />
              <span className="font-semibold">{toToken.symbol}</span>
            </div>
            <span className="text-xs flex items-center gap-1 text-foreground/70">
              <Wallet className="w-3 h-3" />{" "}
              {balances[toTokenSymbol] ? balances[toTokenSymbol] : 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="bg-transparent border-none text-2xl font-semibold focus:ring-0 focus-visible:ring-0"
              placeholder="0.00"
              value={toAmount}
              readOnly
              type="number"
            />
          </div>
        </div>

        {/* Rate and Info */}
        <div className="flex flex-col gap-1 text-xs text-foreground/70 mb-4">
          <span>
            1 {fromToken.symbol} ≈ {rate ? rate : "--"} {toToken.symbol}
          </span>
          <div>
            This uses Jup's Ultra API optimizing for the transaction's success
            rate and slippage.
          </div>
        </div>

        {/* Route Plan */}
        {routePlan.length > 0 && (
          <div className="mb-4 bg-foreground/5 rounded-lg p-3">
            <div className="font-semibold mb-2 text-xs text-foreground/80">
              Route Plan
            </div>
            <ul className="space-y-1">
              {routePlan.map((route: any, idx: number) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <span>
                    {route.swapInfo.label}{" "}
                    <span className="text-foreground/50">
                      ({route.percent}%)
                    </span>
                  </span>
                  <span>
                    {formatAmount(
                      route.swapInfo.inAmount,
                      fromToken.decimals,
                      4
                    )}{" "}
                    {fromToken.symbol} →{" "}
                    {formatAmount(
                      route.swapInfo.outAmount,
                      toToken.decimals,
                      4
                    )}{" "}
                    {toToken.symbol}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Swap Button */}
        <Button
          className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 cursor-pointer"
          disabled={
            !fromAmount ||
            Number(fromAmount) <= 0 ||
            isSwapping ||
            Number(fromAmount) > balances[fromTokenSymbol]
          }
          onClick={handleSwap}
          type="button"
        >
          {isSwapping ? "Swapping..." : `Swap`}
        </Button>
        {solscanLink && (
          <div className="mt-4 w-fit mx-auto text-center">
            <Link
              href={solscanLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline flex gap-2 items-center"
            >
              View Swap Transaction on Solscan
              <ExternalLinkIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
