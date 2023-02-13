export default {
  "name": "Nebula Testnet",
  "chain": "NTN",
  "icon": {
    "url": "ipfs://QmeFaJtQqTKKuXQR7ysS53bLFPasFBcZw445cvYJ2HGeTo",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://nebula-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.novanetwork.io:9070"
  ],
  "faucets": [
    "https://faucet.novanetwork.io"
  ],
  "nativeCurrency": {
    "name": "Nebula X",
    "symbol": "NBX",
    "decimals": 18
  },
  "infoURL": "https://novanetwork.io",
  "shortName": "ntn",
  "chainId": 107,
  "networkId": 107,
  "explorers": [
    {
      "name": "nebulatestnet",
      "url": "https://explorer.novanetwork.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "nebula-testnet"
} as const;