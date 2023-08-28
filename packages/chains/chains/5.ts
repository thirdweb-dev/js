import type { Chain } from "../src/types";
export default {
  "name": "Goerli",
  "title": "Ethereum Testnet Goerli",
  "chain": "ETH",
  "rpc": [
    "https://goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://rpc.goerli.mudit.blog/",
    "https://ethereum-goerli.publicnode.com",
    "https://goerli.gateway.tenderly.co",
    "wss://goerli.gateway.tenderly.co"
  ],
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
  "chainId": 5,
  "networkId": 5,
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
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "testnet": true,
  "slug": "goerli"
} as const satisfies Chain;