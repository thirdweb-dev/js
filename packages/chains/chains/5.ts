export default {
  "name": "Goerli",
  "title": "Ethereum Testnet Goerli",
  "chain": "ETH",
  "rpc": [
    "https://goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://goerli.infura.io/v3/${INFURA_API_KEY}",
    "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
    "https://rpc.goerli.mudit.blog/"
  ],
  "faucets": [
    "https://faucet.goerli.mudit.blog",
    "https://goerli-faucet.slock.it?address=${ADDRESS}",
    "http://fauceth.komputing.org?chain=5&address=${ADDRESS}"
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
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "height": 512,
    "width": 512,
    "format": "png",
    "sizes": [
      512,
      256,
      128,
      64,
      32,
      16
    ]
  },
  "testnet": true,
  "slug": "goerli"
} as const;