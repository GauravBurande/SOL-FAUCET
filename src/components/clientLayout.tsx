"use client";

import { ClusterContext } from "@/context/cluster-context";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo, useState } from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [cluster, setCluster] = useState("devnet");

  const devnetEndpoint = `https://api.devnet.solana.com`;
  const testnetEndpoint = `https://api.testnet.solana.com`;
  const endpoint = cluster === "devnet" ? devnetEndpoint : testnetEndpoint;
  const wallets = useMemo(() => [], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <ClusterContext.Provider value={{ cluster, setCluster }}>
            {children}
          </ClusterContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default ClientLayout;
