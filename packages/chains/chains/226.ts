export default {
  "name": "LACHAIN Testnet",
  "chain": "TLA",
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "rpc": [
    "https://lachain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.lachain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TLA",
    "symbol": "TLA",
    "decimals": 18
  },
  "infoURL": "https://lachain.io",
  "shortName": "TLA",
  "chainId": 226,
  "networkId": 226,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan-test.lachain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "lachain-testnet"
} as const;