export default {
  "name": "Ntity Mainnet",
  "chain": "Ntity",
  "rpc": [
    "https://ntity.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ntity.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ntity",
    "symbol": "NTT",
    "decimals": 18
  },
  "infoURL": "https://ntity.io",
  "shortName": "ntt",
  "chainId": 197710212030,
  "networkId": 197710212030,
  "icon": {
    "url": "ipfs://QmSW2YhCvMpnwtPGTJAuEK2QgyWfFjmnwcrapUg6kqFsPf",
    "width": 711,
    "height": 715,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Ntity Blockscout",
      "url": "https://blockscout.ntity.io",
      "icon": "ntity",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ntity"
} as const;