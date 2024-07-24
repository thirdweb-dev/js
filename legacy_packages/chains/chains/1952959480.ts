import type { Chain } from "../src/types";
export default {
  "chain": "LUMIA",
  "chainId": 1952959480,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer.lumia.org/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://docs.lumia.org/~gitbook/image?url=https%3A%2F%2F2350053608-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F9xpHYszlcNFP3MXUQBaJ%252Ficon%252FBDmLzn8yppQZB9K9xw2O%252FLUMIA-Avatar.png%3Falt%3Dmedia%26token%3D61e41c4c-36ae-4e13-b4bf-938ea2336569&width=32&dpr=2&quality=100&sign=2aa69ec019a55d010d6b0a968779d6372f563b9c5330c682de0b1db602328d1e",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Lumia Testnet",
  "nativeCurrency": {
    "name": "LUMIA",
    "symbol": "LUMIA",
    "decimals": 18
  },
  "networkId": 1952959480,
  "redFlags": [],
  "rpc": [
    "https://1952959480.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.lumia.org"
  ],
  "shortName": "LUMIA",
  "slug": "lumia-testnet",
  "testnet": true
} as const satisfies Chain;