import type { Chain } from "../src/types";
export default {
  "chainId": 8131,
  "chain": "MEER",
  "name": "Qitmeer Network Testnet",
  "rpc": [
    "https://qitmeer-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-qng.rpc.qitmeer.io",
    "https://testnet.meerlabs.com",
    "https://meer.testnet.meerfans.club"
  ],
  "slug": "qitmeer-network-testnet",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "meerscan testnet",
      "url": "https://qng-testnet.meerscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;