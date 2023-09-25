import type { Chain } from "../src/types";
export default {
  "chainId": 1,
  "chain": "ETH",
  "name": "Ethereum Mainnet",
  "rpc": [
    "https://ethereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://api.mycryptoapi.com/eth",
    "https://cloudflare-eth.com",
    "https://ethereum.publicnode.com",
    "wss://ethereum.publicnode.com",
    "https://mainnet.gateway.tenderly.co",
    "wss://mainnet.gateway.tenderly.co"
  ],
  "slug": "ethereum",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethereum.org",
  "shortName": "eth",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://eth.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    },
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;