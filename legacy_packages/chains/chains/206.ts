import type { Chain } from "../src/types";
export default {
  "chain": "VinuChain Testnet",
  "chainId": 206,
  "explorers": [
    {
      "name": "VinuScan Testnet",
      "url": "https://testnet.vinuscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreiayq7a5qncxzlilfnvpgzt4pwfxbof2qrqr2nyd2suztfummpty4i",
        "width": 2000,
        "height": 2000,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreidtie4srt52ry67wd3dpxhklmug2ozrawvf3jdlljveinp3frutra",
    "width": 2000,
    "height": 392,
    "format": "png"
  },
  "infoURL": "https://vitainu.org",
  "name": "VinuChain Testnet",
  "nativeCurrency": {
    "name": "VinuChain",
    "symbol": "VС",
    "decimals": 18
  },
  "networkId": 206,
  "rpc": [
    "https://206.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vinufoundation-rpc.com"
  ],
  "shortName": "VCTEST",
  "slip44": 1,
  "slug": "vinuchain-testnet",
  "testnet": true
} as const satisfies Chain;