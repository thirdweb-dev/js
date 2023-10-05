import type { Chain } from "../src/types";
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
  "features": [],
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
  "redFlags": [],
  "rpc": [
    "https://velo-labs.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.velo.org"
  ],
  "shortName": "VELO",
  "slug": "velo-labs",
  "testnet": false
} as const satisfies Chain;