import type { Chain } from "../src/types";
export default {
  "chain": "CronosZkEVMTestnet",
  "chainId": 282,
  "explorers": [
    {
      "name": "Cronos zkEVM Testnet Explorer",
      "url": "https://zkevm-t0.cronos.org/explorer",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://zkevm-t0.cronos.org/faucet"
  ],
  "infoURL": "https://docs.cronos.org/cronos-zkevm-chain/introduction-to-cronos-zkevm-chain-testnet",
  "name": "Cronos zkEVM Testnet",
  "nativeCurrency": {
    "name": "Cronos zkEVM Test Coin",
    "symbol": "TCRO",
    "decimals": 18
  },
  "networkId": 282,
  "rpc": [
    "https://282.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-zkevm-t0.cronos.org"
  ],
  "shortName": "zktcro",
  "slip44": 1,
  "slug": "cronos-zkevm-testnet",
  "testnet": true
} as const satisfies Chain;