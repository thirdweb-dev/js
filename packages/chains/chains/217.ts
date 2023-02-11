export default {
  "name": "SiriusNet V2",
  "chain": "SIN2",
  "faucets": [],
  "rpc": [
    "https://siriusnet-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.siriusnet.io"
  ],
  "icon": {
    "url": "ipfs://bafybeicxuxdzrzpwsil4owqmn7wpwka2rqsohpfqmukg57pifzyxr5om2q",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "MCD",
    "symbol": "MCD",
    "decimals": 18
  },
  "infoURL": "https://siriusnet.io",
  "shortName": "SIN2",
  "chainId": 217,
  "networkId": 217,
  "explorers": [
    {
      "name": "siriusnet explorer",
      "url": "https://scan.siriusnet.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "siriusnet-v2"
} as const;