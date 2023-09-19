import type { Chain } from "../src/types";
export default {
  "name": "Rethereum Mainnet",
  "chain": "RTH",
  "rpc": [
    "https://rethereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rethereum.org",
    "https://rethereum.rpc.restratagem.com",
    "https://rpc.rthcentral.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rethereum",
    "symbol": "RTH",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.rethereum.org",
  "shortName": "rth",
  "chainId": 622277,
  "networkId": 622277,
  "icon": {
    "url": "ipfs://bafkreiawlhc2trzyxgnz24vowdymxme2m446uk4vmrplgxsdd74ecpfloq",
    "width": 830,
    "height": 830,
    "format": "png"
  },
  "explorers": [
    {
      "name": "rethereum",
      "url": "https://explorer.rethereum.org",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "rethereum"
} as const satisfies Chain;