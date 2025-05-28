const Footer: React.FC = () => (
  <footer className="w-full flex items-center justify-center px-6 py-4 border-t bg-muted text-muted-foreground text-sm">
    <span>
      Disclaimer: This faucet only provides{" "}
      <span className="font-semibold text-primary">testnet/devnet</span> SOL.
      These are{" "}
      <span className="font-semibold text-destructive">
        not real or mainnet tokens
      </span>
      .
    </span>
  </footer>
);

export default Footer;
