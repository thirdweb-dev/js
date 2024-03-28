import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 5,
  "ens": {
    "registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
  },
  "explorers": [
    {
      "name": "etherscan-goerli",
      "url": "https://goerli.etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout-goerli",
      "url": "https://eth-goerli.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
    "https://goerli-faucet.slock.it?address=${ADDRESS}",
    "https://faucet.goerli.mudit.blog"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://goerli.net/#about",
  "name": "Goerli",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5,
  "redFlags": [],
  "rpc": [
    "https://5.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://rpc.goerli.mudit.blog/",
    "https://ethereum-goerli-rpc.publicnode.com",
    "wss://ethereum-goerli-rpc.publicnode.com",
    "https://goerli.gateway.tenderly.co",
    "wss://goerli.gateway.tenderly.co"
  ],
  "shortName": "gor",
  "slip44": 1,
  "slug": "goerli",
  "status": "deprecated",
  "testnet": true,
  "title": "Ethereum Testnet Goerli"
} as const satisfies Chain;