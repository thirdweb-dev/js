export default {
  "name": "EtherInc",
  "chain": "ETI",
  "rpc": [
    "https://etherinc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.einc.io/jsonrpc/mainnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EtherInc Ether",
    "symbol": "ETI",
    "decimals": 18
  },
  "infoURL": "https://einc.io",
  "shortName": "eti",
  "chainId": 101,
  "networkId": 1,
  "slip44": 464,
  "testnet": false,
  "slug": "etherinc"
} as const;