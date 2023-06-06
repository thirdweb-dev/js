import type { Chain } from "../src/types";
export default {
  "name": "AxelChain Dev-Net",
  "chain": "AXEL",
  "rpc": [
    "https://axelchain-dev-net.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://aium-rpc-dev.viacube.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Axelium",
    "symbol": "AIUM",
    "decimals": 18
  },
  "infoURL": "https://www.axel.org",
  "shortName": "aium-dev",
  "chainId": 61800,
  "networkId": 61800,
  "icon": {
    "url": "ipfs://QmNx8FRacfNeawhkjk5p57EKzDHkLGMaBBmK2VRL5CB2P2",
    "width": 40,
    "height": 40,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "AxelChain Dev-Net Explorer",
      "url": "https://devexplorer2.viacube.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "axelchain-dev-net"
} as const satisfies Chain;