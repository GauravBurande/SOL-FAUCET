import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Droplet } from "lucide-react";

const Header: React.FC = () => (
  <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-background">
    <div className="flex items-center gap-2">
      <Droplet className="w-7 h-7 text-primary" />
      <h1 className="text-2xl font-bold tracking-tight">SOLFAUCET</h1>
    </div>
    <div className="flex items-center gap-4">
      <WalletMultiButton className="shadcn-btn" />
    </div>
  </header>
);

export default Header;
