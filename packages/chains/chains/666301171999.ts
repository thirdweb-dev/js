export default {
  "name": "PDC Mainnet",
  "chain": "IPDC",
  "rpc": [
    "https://pdc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.ipdc.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PDC",
    "symbol": "PDC",
    "decimals": 18
  },
  "infoURL": "https://ipdc.io",
  "shortName": "ipdc",
  "chainId": 666301171999,
  "networkId": 666301171999,
  "explorers": [
    {
      "name": "ipdcscan",
      "url": "https://scan.ipdc.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "pdc"
} as const;