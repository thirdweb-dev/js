export default {
  "name": "Haradev Testnet",
  "chain": "Ntity",
  "rpc": [
    "https://haradev-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://blockchain.haradev.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ntity Haradev",
    "symbol": "NTTH",
    "decimals": 18
  },
  "infoURL": "https://ntity.io",
  "shortName": "ntt-haradev",
  "chainId": 197710212031,
  "networkId": 197710212031,
  "icon": {
    "url": "ipfs://QmSW2YhCvMpnwtPGTJAuEK2QgyWfFjmnwcrapUg6kqFsPf",
    "width": 711,
    "height": 715,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Ntity Haradev Blockscout",
      "url": "https://blockscout.haradev.com",
      "icon": "ntity",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "haradev-testnet"
} as const;