import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1,
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
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    },
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://ethereum.org",
  "name": "Ethereum Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
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
  "shortName": "eth",
  "slug": "ethereum",
  "testnet": false
} as const satisfies Chain;