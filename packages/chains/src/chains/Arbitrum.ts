import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 42161,
  "explorers": [
    {
      "name": "Arbiscan",
      "url": "https://arbiscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "Arbitrum Explorer",
      "url": "https://explorer.arbitrum.io",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://arbitrum.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/arbitrum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://arbitrum.io",
  "name": "Arbitrum One",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 42161,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://arbitrum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://42161.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://arb1.arbitrum.io/rpc",
    "https://arbitrum-one.publicnode.com",
    "wss://arbitrum-one.publicnode.com"
  ],
  "shortName": "arb1",
  "slug": "arbitrum",
  "testnet": false
} as const satisfies Chain;