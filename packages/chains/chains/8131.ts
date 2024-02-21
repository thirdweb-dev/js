import type { Chain } from "../src/types";
export default {
  "chain": "MEER",
  "chainId": 8131,
  "explorers": [
    {
      "name": "meerscan testnet",
      "url": "https://qng-testnet.meerscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.qitmeer.io"
  ],
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://github.com/Qitmeer",
  "name": "Qitmeer Network Testnet",
  "nativeCurrency": {
    "name": "Qitmeer Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "networkId": 8131,
  "rpc": [
    "https://8131.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qng.rpc.qitmeer.io",
    "https://testnet.meerlabs.com",
    "https://meer.testnet.meerfans.club"
  ],
  "shortName": "meertest",
  "slip44": 1,
  "slug": "qitmeer-network-testnet",
  "testnet": true
} as const satisfies Chain;