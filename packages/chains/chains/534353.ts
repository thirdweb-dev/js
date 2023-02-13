export default {
  "name": "Scroll Alpha Testnet",
  "chain": "ETH",
  "status": "incubating",
  "rpc": [
    "https://scroll-alpha-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-rpc.scroll.io/l2"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr-alpha",
  "chainId": 534353,
  "networkId": 534353,
  "explorers": [
    {
      "name": "Scroll Alpha Testnet Block Explorer",
      "url": "https://blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": []
  },
  "testnet": true,
  "slug": "scroll-alpha-testnet"
} as const;