import Link from "next/link";

const Footer: React.FC = () => (
  <footer className="w-full flex gap-4 flex-col items-center justify-center px-6 py-4 border-t text-sm">
    <Link
      href="/swap"
      className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-purple-600 transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 11l5-5m0 0l5 5m-5-5v12"
        />
      </svg>
      Swap SOL &amp; USDC
    </Link>
    <span className="bg-muted text-muted-foreground px-4 sm:px-8 py-3">
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
