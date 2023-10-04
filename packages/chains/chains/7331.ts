import type { Chain } from "../src/types";
export default {
  "chain": "KLY",
  "chainId": 7331,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmaDr9R6dKnZLsogRxojjq4dwXuXcudR8UeTZ8Nq553K4u",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://klyntar.org",
  "name": "KLYNTAR",
  "nativeCurrency": {
    "name": "KLYNTAR",
    "symbol": "KLY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://klyntar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.klyntar.org/kly_evm_rpc",
    "https://evm.klyntarscan.org/kly_evm_rpc"
  ],
  "shortName": "kly",
  "slug": "klyntar",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;