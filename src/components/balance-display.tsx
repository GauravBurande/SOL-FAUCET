import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useEffect, useState } from "react";

export const BalanceDisplay: FC = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return (
    <div>
      <p>
        {publicKey ? `Balance: ${balance} SOL` : "Please connect your wallet"}
      </p>
    </div>
  );
};
