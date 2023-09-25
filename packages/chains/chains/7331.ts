import type { Chain } from "../src/types";
export default {
  "chainId": 7331,
  "chain": "KLY",
  "name": "KLYNTAR",
  "rpc": [
    "https://klyntar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.klyntar.org/kly_evm_rpc",
    "https://evm.klyntarscan.org/kly_evm_rpc"
  ],
  "slug": "klyntar",
  "icon": {
    "url": "ipfs://QmaDr9R6dKnZLsogRxojjq4dwXuXcudR8UeTZ8Nq553K4u",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "KLYNTAR",
    "symbol": "KLY",
    "decimals": 18
  },
  "infoURL": "https://klyntar.org",
  "shortName": "kly",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;