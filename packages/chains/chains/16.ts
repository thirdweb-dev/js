export default {
  "name": "Flare Testnet Coston",
  "chain": "FLR",
  "icon": {
    "url": "ipfs://QmW7Ljv2eLQ1poRrhJBaVWJBF1TyfZ8QYxDeELRo6sssrj",
    "width": 382,
    "height": 382,
    "format": "png"
  },
  "rpc": [
    "https://flare-testnet-coston.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://coston-api.flare.network/ext/bc/C/rpc"
  ],
  "faucets": [
    "https://faucet.towolabs.com",
    "https://fauceth.komputing.org?chain=16&address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Coston Flare",
    "symbol": "CFLR",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "shortName": "cflr",
  "chainId": 16,
  "networkId": 16,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston-explorer.flare.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "flare-testnet-coston"
} as const;