import type { Chain } from "../src/types";
export default {
  "chain": "CRO",
  "chainId": 25,
  "explorers": [
    {
      "name": "Cronos Explorer",
      "url": "https://explorer.cronos.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://cronos.org/",
  "name": "Cronos Mainnet",
  "nativeCurrency": {
    "name": "Cronos",
    "symbol": "CRO",
    "decimals": 18
  },
  "networkId": 25,
  "redFlags": [],
  "rpc": [
    "https://25.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cronos.drpc.org",
    "wss://cronos.drpc.org",
    "https://cronos-evm-rpc.publicnode.com",
    "wss://cronos-evm-rpc.publicnode.com",
    "https://cronos.blockpi.network/v1/rpc/public",
    "https://evm.cronos.org"
  ],
  "shortName": "cro",
  "slug": "cronos",
  "testnet": false
} as const satisfies Chain;