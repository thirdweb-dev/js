export default {
  "name": "Alyx Chain Testnet",
  "chain": "Alyx Chain Testnet",
  "rpc": [
    "https://alyx-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.alyxchain.com"
  ],
  "faucets": [
    "https://faucet.alyxchain.com"
  ],
  "nativeCurrency": {
    "name": "Alyx Testnet Native Token",
    "symbol": "ALYX",
    "decimals": 18
  },
  "infoURL": "https://www.alyxchain.com",
  "shortName": "AlyxTestnet",
  "chainId": 135,
  "networkId": 135,
  "explorers": [
    {
      "name": "alyx testnet scan",
      "url": "https://testnet.alyxscan.com",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreifd43fcvh77mdcwjrpzpnlhthounc6b4u645kukqpqhduaveatf6i",
    "width": 2481,
    "height": 2481,
    "format": "png"
  },
  "testnet": true,
  "slug": "alyx-chain-testnet"
} as const;