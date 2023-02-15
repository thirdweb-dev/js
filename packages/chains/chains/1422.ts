export default {
  "name": "Polygon zkEVM Testnet",
  "title": "Polygon zkEVM Testnet",
  "chain": "Polygon",
  "rpc": [
    "https://polygon-zkevm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.public.zkevm-test.net"
  ],
  "faucets": [
    "https://public.zkevm-test.net/login"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "icon": {
    "url": "ipfs://QmdGvoLRJXV3vRdT5mqmeGSVav3Nz9KmgqpBn1VNUZr2Zi",
    "height": 512,
    "width": 512,
    "format": "png",
    "sizes": [
      16,
      32,
      64,
      128,
      256,
      512
    ]
  },
  "chainId": 1422,
  "networkId": 1422,
  "testnet": true,
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "shortName": "zkevmtest",
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ],
  "slug": "polygon-zkevm-testnet"
} as const;