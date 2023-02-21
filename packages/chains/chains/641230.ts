export default {
  "name": "Bear Network Chain Mainnet",
  "chain": "BRNKC",
  "icon": {
    "url": "ipfs://QmQqhH28QpUrreoRw5Gj8YShzdHxxVGMjfVrx3TqJNLSLv",
    "width": 1067,
    "height": 1067,
    "format": "png"
  },
  "rpc": [
    "https://bear-network-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://brnkc-mainnet.bearnetwork.net",
    "https://brnkc-mainnet1.bearnetwork.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bear Network Chain Native Token",
    "symbol": "BRNKC",
    "decimals": 18
  },
  "infoURL": "https://bearnetwork.net",
  "shortName": "BRNKC",
  "chainId": 641230,
  "networkId": 641230,
  "explorers": [
    {
      "name": "brnkscan",
      "url": "https://brnkscan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bear-network-chain"
} as const;