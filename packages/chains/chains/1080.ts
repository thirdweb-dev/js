import type { Chain } from "../src/types";
export default {
  "name": "Mintara Mainnet",
  "title": "Mintara Mainnet",
  "chain": "Mintara",
  "icon": {
    "url": "ipfs://bafybeie7jzlzlpz7c3a3oh4x5joej23dj2qf3cexmchjyc72hv3fblcaja",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://mintara.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mintara/mainnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MINTARA",
    "symbol": "MNTR",
    "decimals": 18
  },
  "infoURL": "https://playthink.co.jp",
  "shortName": "mintara",
  "chainId": 1080,
  "networkId": 1080,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/mintara",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "mintara"
} as const satisfies Chain;