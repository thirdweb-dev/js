import type { Chain } from "../src/types";
export default {
  "chainId": 61800,
  "chain": "AXEL",
  "name": "AxelChain Dev-Net",
  "rpc": [
    "https://axelchain-dev-net.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aium-rpc-dev.viacube.com"
  ],
  "slug": "axelchain-dev-net",
  "icon": {
    "url": "ipfs://QmNx8FRacfNeawhkjk5p57EKzDHkLGMaBBmK2VRL5CB2P2",
    "width": 40,
    "height": 40,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Axelium",
    "symbol": "AIUM",
    "decimals": 18
  },
  "infoURL": "https://www.axel.org",
  "shortName": "aium-dev",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "AxelChain Dev-Net Explorer",
      "url": "https://devexplorer2.viacube.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;