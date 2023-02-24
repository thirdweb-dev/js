export default {
  "name": "Base Goerli Testnet",
  "chain": "ETH",
  "rpc": [
    "https://base-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.base.org"
  ],
  "faucets": [
    "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
  ],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://base.org",
  "shortName": "basegor",
  "chainId": 84531,
  "networkId": 84531,
  "explorers": [
    {
      "name": "basescout",
      "url": "https://base-goerli.blockscout.com",
      "standard": "none"
    },
    {
      "name": "basescan",
      "url": "https://goerli.basescan.org",
      "standard": "none"
    }
  ],
  "testnet": true,
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "slug": "base-goerli"
} as const;