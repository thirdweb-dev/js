export default {
  "name": "Qitmeer",
  "chain": "MEER",
  "rpc": [
    "https://qitmeer.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-dataseed1.meerscan.io",
    "https://evm-dataseed2.meerscan.io",
    "https://evm-dataseed3.meerscan.io",
    "https://evm-dataseed.meerscan.com",
    "https://evm-dataseed1.meerscan.com",
    "https://evm-dataseed2.meerscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer",
    "symbol": "MEER",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "meer",
  "chainId": 813,
  "networkId": 813,
  "slip44": 813,
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "meerscan",
      "url": "https://evm.meerscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "qitmeer"
} as const;