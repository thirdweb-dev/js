import type { Chain } from "../src/types";
export default {
  "chainId": 56789,
  "chain": "NOVA chain",
  "name": "VELO Labs Mainnet",
  "rpc": [
    "https://velo-labs.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.velo.org"
  ],
  "slug": "velo-labs",
  "icon": {
    "url": "ipfs://QmYqvnW2jwPEKUv8BdaV4sbL8Audcwosat6SPn4GqYtKxc",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "faucets": [
    "https://nova-faucet.velo.org"
  ],
  "nativeCurrency": {
    "name": "Nova",
    "symbol": "NOVA",
    "decimals": 18
  },
  "infoURL": "https://velo.org",
  "shortName": "VELO",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "novascan",
      "url": "https://novascan.velo.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;