import type { Chain } from "../src/types";
export default {
  "chain": "Mintara",
  "chainId": 1080,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/mintara",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeie7jzlzlpz7c3a3oh4x5joej23dj2qf3cexmchjyc72hv3fblcaja",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://playthink.co.jp",
  "name": "Mintara Mainnet",
  "nativeCurrency": {
    "name": "MINTARA",
    "symbol": "MNTR",
    "decimals": 18
  },
  "networkId": 1080,
  "rpc": [
    "https://mintara.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1080.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mintara/mainnet/rpc"
  ],
  "shortName": "mintara",
  "slug": "mintara",
  "testnet": false,
  "title": "Mintara Mainnet"
} as const satisfies Chain;