export default {
  "name": "Atelier",
  "title": "Atelier Test Network",
  "chain": "ALTR",
  "rpc": [
    "https://atelier.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1971.network/atlr",
    "wss://1971.network/atlr"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ATLR",
    "symbol": "ATLR",
    "decimals": 18
  },
  "infoURL": "https://1971.network/",
  "shortName": "atlr",
  "chainId": 1971,
  "networkId": 1971,
  "icon": {
    "url": "ipfs://bafkreigcquvoalec3ll2m26v4wsx5enlxwyn6nk2mgfqwncyqrgwivla5u",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "testnet": true,
  "slug": "atelier"
} as const;