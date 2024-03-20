import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 88153591557,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gelato-orbit-anytrust-testnet.blockscout.com/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmQXw4QEDR4AbUwX9scH7aGhiSDhQRxu6LCQoUkgsYgGyK/Gelato%20brand%20mark.png",
        "width": 300,
        "height": 300,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQXw4QEDR4AbUwX9scH7aGhiSDhQRxu6LCQoUkgsYgGyK/Gelato%20brand%20mark.png",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/gelato-orbit-anytrust-testnet",
  "name": "Gelato Orbit Anytrust",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 88153591557,
  "redFlags": [],
  "rpc": [
    "https://88153591557.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gelato-orbit-anytrust-testnet.gelato.digital"
  ],
  "shortName": "orbitanytrust",
  "slug": "gelato-orbit-anytrust",
  "testnet": true,
  "title": "Gelato Orbit Anytrust Testnet"
} as const satisfies Chain;