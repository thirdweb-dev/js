import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 16180,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets.avax.network/plyr",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmVhG7xeTc78ibQunQ5sBJ4533r9FDM2xUCQKV72DPd1ux",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://plyr.network/",
  "name": "PLYR PHI",
  "nativeCurrency": {
    "name": "PLYR PHI Token",
    "symbol": "PLYR",
    "decimals": 18
  },
  "networkId": 16180,
  "redFlags": [],
  "rpc": [
    "https://16180.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-plyr-ub739.avax.network/ext/bc/HUwWdyoExrb1HgVp5X5sh3AWqhYFnKkfXBfGmGL3qjDsnMoR4/rpc?token=aa3b2d729082b89b1065b7d98c00982fd0ab59e641ee2ebd420d1fcdc87814c3",
    "https://subnets.avax.network/plyr/mainnet/rpc"
  ],
  "shortName": "PLYR PHI",
  "slug": "plyr-phi",
  "testnet": false
} as const satisfies Chain;