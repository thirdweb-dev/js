import type { Chain } from "../src/types";
export default {
  "chain": "VinuChain",
  "chainId": 207,
  "explorers": [
    {
      "name": "VinuScan",
      "url": "https://vinuscan.com",
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
  "name": "VinuChain Network",
  "nativeCurrency": {
    "name": "VinuChain",
    "symbol": "VС",
    "decimals": 18
  },
  "networkId": 207,
  "rpc": [
    "https://vinuchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://207.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vinuchain-rpc.com"
  ],
  "shortName": "VC",
  "slug": "vinuchain-network",
  "testnet": false
} as const satisfies Chain;