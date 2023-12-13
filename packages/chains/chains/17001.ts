import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 17001,
  "explorers": [
    {
      "name": "Redstone Holesky Explorer",
      "url": "https://explorer.holesky.redstone.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreieyaqgkgntvxuo5tnhgseladga5q6gutc37dab7kqqfdguhq7vkxq",
    "width": 5836,
    "height": 5836,
    "format": "png"
  },
  "infoURL": "https://redstone.xyz/docs/network-info",
  "name": "Redstone Holesky Testnet",
  "nativeCurrency": {
    "name": "Redstone Testnet Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 17001,
  "rpc": [
    "https://redstone-holesky-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://17001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.holesky.redstone.xyz"
  ],
  "shortName": "redstone",
  "slug": "redstone-holesky-testnet",
  "testnet": true
} as const satisfies Chain;