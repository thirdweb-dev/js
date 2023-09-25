import type { Chain } from "../src/types";
export default {
  "chainId": 10508,
  "chain": "NUM",
  "name": "Numbers Testnet",
  "rpc": [
    "https://numbers-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.num.network"
  ],
  "slug": "numbers-testnet",
  "icon": {
    "url": "ipfs://bafkreie3ba6ofosjqqiya6empkyw6u5xdrtcfzi2evvyt4u6utzeiezyhi",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "faucets": [
    "https://faucet.avax.network/?subnet=num",
    "https://faucet.num.network"
  ],
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "infoURL": "https://numbersprotocol.io",
  "shortName": "Snow",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://testnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;