import type { Chain } from "../src/types";
export default {
  "chain": "Mintara",
  "chainId": 1079,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/mintara",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeie7jzlzlpz7c3a3oh4x5joej23dj2qf3cexmchjyc72hv3fblcaja",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://playthink.co.jp",
  "name": "Mintara Testnet",
  "nativeCurrency": {
    "name": "MINTARA",
    "symbol": "MNTR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://mintara-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mintara/testnet/rpc"
  ],
  "shortName": "mintara-testnet",
  "slug": "mintara-testnet",
  "testnet": true
} as const satisfies Chain;