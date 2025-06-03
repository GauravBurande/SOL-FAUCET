import { createContext } from "react";

export const ClusterContext = createContext({
  cluster: "devnet",
  setCluster: (cluster: string) => {},
});
