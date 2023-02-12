export default {
  "name": "TCG Verse Mainnet",
  "chain": "TCG Verse",
  "icon": {
    "url": "ipfs://bafkreidg4wpewve5mdxrofneqblydkrjl3oevtgpdf3fk3z3vjqam6ocoe",
    "width": 350,
    "height": 350,
    "format": "png"
  },
  "rpc": [
    "https://tcg-verse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tcgverse.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://tcgverse.xyz/",
  "shortName": "TCGV",
  "chainId": 2400,
  "networkId": 2400,
  "explorers": [
    {
      "name": "TCG Verse Explorer",
      "url": "https://explorer.tcgverse.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "testnet": false,
  "slug": "tcg-verse"
} as const;