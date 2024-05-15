import type { Chain } from "../src/types";
export default {
  "chain": "MOON",
  "chainId": 1287,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbase.moonscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://docs.moonbeam.network/learn/platform/networks/moonbase/",
  "name": "Moonbase Alpha",
  "nativeCurrency": {
    "name": "Dev",
    "symbol": "DEV",
    "decimals": 18
  },
  "networkId": 1287,
  "redFlags": [],
  "rpc": [
    "https://1287.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbase.moonbeam.network",
    "wss://wss.api.moonbase.moonbeam.network",
    "https://moonbase-alpha.public.blastapi.io",
    "wss://moonbase-alpha.public.blastapi.io",
    "https://moonbase-rpc.dwellir.com",
    "wss://moonbase-rpc.dwellir.com",
    "https://moonbeam-alpha.api.onfinality.io/public",
    "wss://moonbeam-alpha.api.onfinality.io/public-ws",
    "https://moonbase.unitedbloc.com",
    "wss://moonbase.unitedbloc.com",
    "https://moonbase-alpha.drpc.org",
    "wss://moonbase-alpha.drpc.org"
  ],
  "shortName": "mbase",
  "slip44": 1,
  "slug": "moonbase-alpha",
  "testnet": true
} as const satisfies Chain;