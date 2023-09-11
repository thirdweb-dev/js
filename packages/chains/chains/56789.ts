import type { Chain } from "../src/types";
export default {
  "name": "VELO Labs Mainnet",
  "chain": "NOVA chain",
  "rpc": [
    "https://velo-labs.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.velo.org"
  ],
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
  "chainId": 56789,
  "networkId": 56789,
  "icon": {
    "url": "ipfs://QmYqvnW2jwPEKUv8BdaV4sbL8Audcwosat6SPn4GqYtKxc",
    "width": 225,
    "height": 225,
    "format": "png"
  },
  "explorers": [
    {
      "name": "novascan",
      "url": "https://novascan.velo.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "velo-labs"
} as const satisfies Chain;