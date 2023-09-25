import type { Chain } from "../src/types";
export default {
  "chainId": 10507,
  "chain": "NUM",
  "name": "Numbers Mainnet",
  "rpc": [
    "https://numbers.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnetrpc.num.network"
  ],
  "slug": "numbers",
  "icon": {
    "url": "ipfs://bafkreie3ba6ofosjqqiya6empkyw6u5xdrtcfzi2evvyt4u6utzeiezyhi",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "infoURL": "https://numbersprotocol.io",
  "shortName": "Jade",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://mainnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;