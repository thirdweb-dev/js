import type { Chain } from "../types";
export default {
  "chain": "NOVA chain",
  "chainId": 56789,
  "explorers": [
    {
      "name": "novascan",
      "url": "https://novascan.velo.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://nova-faucet.velo.org"
  ],
  "icon": {
    "url": "ipfs://QmYqvnW2jwPEKUv8BdaV4sbL8Audcwosat6SPn4GqYtKxc",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "infoURL": "https://velo.org",
  "name": "VELO Labs Mainnet",
  "nativeCurrency": {
    "name": "Nova",
    "symbol": "NOVA",
    "decimals": 18
  },
  "networkId": 56789,
  "rpc": [
    "https://velo-labs.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://56789.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.velo.org"
  ],
  "shortName": "VELO",
  "slug": "velo-labs",
  "testnet": false
} as const satisfies Chain;