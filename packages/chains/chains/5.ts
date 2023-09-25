import type { Chain } from "../src/types";
export default {
  "chainId": 5,
  "chain": "ETH",
  "name": "Goerli",
  "rpc": [
    "https://goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://rpc.goerli.mudit.blog/",
    "https://ethereum-goerli.publicnode.com",
    "wss://ethereum-goerli.publicnode.com",
    "https://goerli.gateway.tenderly.co",
    "wss://goerli.gateway.tenderly.co"
  ],
  "slug": "goerli",
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://faucet.paradigm.xyz/",
    "http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
    "https://goerli-faucet.slock.it?address=${ADDRESS}",
    "https://faucet.goerli.mudit.blog"
  ],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://goerli.net/#about",
  "shortName": "gor",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "etherscan-goerli",
      "url": "https://goerli.etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout-goerli",
      "url": "https://eth-goerli.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;