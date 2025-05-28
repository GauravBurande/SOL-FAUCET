// create a context for the cluster like devnet or testnet

import { createContext, useState } from "react";

export const ClusterContext = createContext({
  cluster: "devnet",
  setCluster: (cluster: string) => {},
});
