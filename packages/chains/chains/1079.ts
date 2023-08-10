import type { Chain } from "../src/types";
export default {
  "name": "Mintara Testnet",
  "title": "Mintara Testnet",
  "chain": "Mintara",
  "icon": {
    "url": "ipfs://bafybeie7jzlzlpz7c3a3oh4x5joej23dj2qf3cexmchjyc72hv3fblcaja",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://mintara-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/mintara/testnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MINTARA",
    "symbol": "MNTR",
    "decimals": 18
  },
  "infoURL": "https://playthink.co.jp",
  "shortName": "mintara-testnet",
  "chainId": 1079,
  "networkId": 1079,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/mintara",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "mintara-testnet"
} as const satisfies Chain;