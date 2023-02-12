export default {
  "name": "BerylBit Mainnet",
  "chain": "BRB",
  "rpc": [
    "https://berylbit.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.berylbit.io"
  ],
  "faucets": [
    "https://t.me/BerylBit"
  ],
  "nativeCurrency": {
    "name": "BerylBit Chain Native Token",
    "symbol": "BRB",
    "decimals": 18
  },
  "infoURL": "https://www.beryl-bit.com",
  "shortName": "brb",
  "chainId": 9012,
  "networkId": 9012,
  "icon": {
    "url": "ipfs://QmeDXHkpranzqGN1BmQqZSrFp4vGXf4JfaB5iq8WHHiwDi",
    "width": 162,
    "height": 162,
    "format": "png"
  },
  "explorers": [
    {
      "name": "berylbit-explorer",
      "url": "https://explorer.berylbit.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "berylbit"
} as const;