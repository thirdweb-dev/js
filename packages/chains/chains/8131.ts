import type { Chain } from "../src/types";
export default {
  "name": "Qitmeer Network Testnet",
  "chain": "MEER",
  "rpc": [
    "https://qitmeer-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qng.rpc.qitmeer.io",
    "https://testnet.meerlabs.com",
    "https://meer.testnet.meerfans.club"
  ],
  "faucets": [
    "https://faucet.qitmeer.io"
  ],
  "nativeCurrency": {
    "name": "Qitmeer Testnet",
    "symbol": "MEER-T",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "meertest",
  "chainId": 8131,
  "networkId": 8131,
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "meerscan testnet",
      "icon": {
        "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "url": "https://qng-testnet.meerscan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "qitmeer-network-testnet"
} as const satisfies Chain;