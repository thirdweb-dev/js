import type { Chain } from "../src/types";
export default {
  "chainId": 813,
  "chain": "MEER",
  "name": "Qitmeer",
  "rpc": [
    "https://qitmeer.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-dataseed1.meerscan.io",
    "https://evm-dataseed2.meerscan.io",
    "https://evm-dataseed3.meerscan.io",
    "https://evm-dataseed.meerscan.com",
    "https://evm-dataseed1.meerscan.com",
    "https://evm-dataseed2.meerscan.com",
    "https://qng.rpc.qitmeer.io",
    "https://mainnet.meerlabs.com",
    "https://rpc.dimai.ai",
    "https://rpc.woowow.io"
  ],
  "slug": "qitmeer",
  "icon": {
    "url": "ipfs://QmWSbMuCwQzhBB6GRLYqZ87n5cnpzpYCehCAMMQmUXj4mm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Qitmeer",
    "symbol": "MEER",
    "decimals": 18
  },
  "infoURL": "https://github.com/Qitmeer",
  "shortName": "meer",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "meerscan",
      "url": "https://qng.meerscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;