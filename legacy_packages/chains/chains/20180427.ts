import type { Chain } from "../src/types";
export default {
  "chain": "stabilityTestnet",
  "chainId": 20180427,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://stability-testnet.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreid3wd6ouu53r677q2z24a4eq5un5tlwbc4izfapcvvtrlhkmz43au",
    "width": 133,
    "height": 144,
    "format": "png"
  },
  "infoURL": "https://stabilityprotocol.com",
  "name": "Stability Testnet",
  "nativeCurrency": {
    "name": "FREE",
    "symbol": "FREE",
    "decimals": 18
  },
  "networkId": 20180427,
  "rpc": [
    "https://20180427.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://free.testnet.stabilityprotocol.com"
  ],
  "shortName": "stabilitytestnet",
  "slip44": 1,
  "slug": "stability-testnet",
  "testnet": true
} as const satisfies Chain;