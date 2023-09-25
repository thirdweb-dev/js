import type { Chain } from "../src/types";
export default {
  "chainId": 666,
  "chain": "PixieChain",
  "name": "Pixie Chain Testnet",
  "rpc": [
    "https://pixie-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.chain.pixie.xyz",
    "wss://ws-testnet.chain.pixie.xyz"
  ],
  "slug": "pixie-chain-testnet",
  "faucets": [
    "https://chain.pixie.xyz/faucet"
  ],
  "nativeCurrency": {
    "name": "Pixie Chain Testnet Native Token",
    "symbol": "PCTT",
    "decimals": 18
  },
  "infoURL": "https://scan-testnet.chain.pixie.xyz",
  "shortName": "pixie-chain-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;