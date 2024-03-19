import type { Chain } from "../src/types";
export default {
  "chain": "HETH",
  "chainId": 77787778,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://test.0xhashscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://0xhash.io",
  "name": "0xHash Testnet",
  "nativeCurrency": {
    "name": "0xHash",
    "symbol": "HETH",
    "decimals": 18
  },
  "networkId": 77787778,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://app.optimism.io/bridge/deposit"
      }
    ]
  },
  "rpc": [
    "https://77787778.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.0xhash.io"
  ],
  "shortName": "HETH",
  "slip44": 1,
  "slug": "0xhash-testnet",
  "testnet": true
} as const satisfies Chain;