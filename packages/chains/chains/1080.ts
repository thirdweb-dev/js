import type { Chain } from "../src/types";
export default {
  "chainId": 1080,
  "chain": "Mintara",
  "name": "Mintara Mainnet",
  "rpc": [
    "https://mintara.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mintara/mainnet/rpc"
  ],
  "slug": "mintara",
  "icon": {
    "url": "ipfs://bafybeie7jzlzlpz7c3a3oh4x5joej23dj2qf3cexmchjyc72hv3fblcaja",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MINTARA",
    "symbol": "MNTR",
    "decimals": 18
  },
  "infoURL": "https://playthink.co.jp",
  "shortName": "mintara",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/mintara",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;