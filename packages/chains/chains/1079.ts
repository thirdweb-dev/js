import type { Chain } from "../src/types";
export default {
  "chainId": 1079,
  "chain": "Mintara",
  "name": "Mintara Testnet",
  "rpc": [
    "https://mintara-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mintara/testnet/rpc"
  ],
  "slug": "mintara-testnet",
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
  "shortName": "mintara-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/mintara",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;