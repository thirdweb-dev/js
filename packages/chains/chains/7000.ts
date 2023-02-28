export default {
  "name": "ZetaChain Mainnet",
  "chain": "ZetaChain",
  "icon": {
    "url": "ipfs://QmeABfwZ2nAxDzYyqZ1LEypPgQFMjEyrx8FfnoPLkF8R3f",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "rpc": [
    "https://zetachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.zetachain.com/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "ZETA",
    "decimals": 18
  },
  "infoURL": "https://docs.zetachain.com/",
  "shortName": "zetachain-mainnet",
  "chainId": 7000,
  "networkId": 7000,
  "status": "incubating",
  "explorers": [
    {
      "name": "ZetaChain Mainnet Explorer",
      "url": "https://explorer.mainnet.zetachain.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zetachain"
} as const;