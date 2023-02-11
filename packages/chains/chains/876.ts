export default {
  "name": "Bandai Namco Research Verse Mainnet",
  "chain": "Bandai Namco Research Verse",
  "icon": {
    "url": "ipfs://bafkreifhetalm3vpvjrg5u5d2momkcgvkz6rhltur5co3rslltbxzpr6yq",
    "width": 2048,
    "height": 2048,
    "format": "png"
  },
  "rpc": [
    "https://bandai-namco-research-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.oasvrs.bnken.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.bandainamco-mirai.com/en/",
  "shortName": "BNKEN",
  "chainId": 876,
  "networkId": 876,
  "explorers": [
    {
      "name": "Bandai Namco Research Verse Explorer",
      "url": "https://explorer.main.oasvrs.bnken.net",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "testnet": false,
  "slug": "bandai-namco-research-verse"
} as const;