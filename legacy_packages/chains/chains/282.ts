import type { Chain } from "../src/types";
export default {
  "chain": "CronosZkEVMTestnet",
  "chainId": 282,
  "explorers": [
    {
      "name": "Cronos zkEVM Testnet Explorer",
      "url": "https://explorer.zkevm.cronos.org/testnet",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://zkevm.cronos.org/faucet"
  ],
  "infoURL": "https://docs-zkevm.cronos.org",
  "name": "Cronos zkEVM Testnet",
  "nativeCurrency": {
    "name": "Cronos zkEVM Test Coin",
    "symbol": "zkTCRO",
    "decimals": 18
  },
  "networkId": 282,
  "rpc": [
    "https://282.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.zkevm.cronos.org"
  ],
  "shortName": "zkTCRO",
  "slip44": 1,
  "slug": "cronos-zkevm-testnet",
  "testnet": true
} as const satisfies Chain;