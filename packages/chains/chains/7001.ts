export default {
  "name": "ZetaChain Athens Testnet",
  "chain": "ZetaChain",
  "icon": {
    "url": "ipfs://QmeABfwZ2nAxDzYyqZ1LEypPgQFMjEyrx8FfnoPLkF8R3f",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "rpc": [
    "https://zetachain-athens-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.athens2.zetachain.com/evm"
  ],
  "faucets": [
    "https://labs.zetachain.com/get-zeta"
  ],
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "aZETA",
    "decimals": 18
  },
  "infoURL": "https://docs.zetachain.com/",
  "shortName": "zetachain-athens",
  "chainId": 7001,
  "networkId": 7001,
  "status": "active",
  "explorers": [
    {
      "name": "ZetaChain Athens Testnet Explorer",
      "url": "https://explorer.athens.zetachain.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "zetachain-athens-testnet"
} as const;