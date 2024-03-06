import type { Chain } from "../src/types";
export default {
  "chain": "Emoney",
  "chainId": 4544,
  "explorers": [
    {
      "name": "EMoney ethscan",
      "url": "https://ethscan.emoney.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreigo4gtboztftjdnbvy2rb2ku2gxxbhm4iwutzgnzhvden3vcbsqui",
        "width": 472,
        "height": 462,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.emoney.network/faucet"
  ],
  "icon": {
    "url": "ipfs://bafkreigo4gtboztftjdnbvy2rb2ku2gxxbhm4iwutzgnzhvden3vcbsqui",
    "width": 472,
    "height": 462,
    "format": "png"
  },
  "infoURL": "https://emoney.network/",
  "name": "Emoney Network Testnet",
  "nativeCurrency": {
    "name": "Emoney Network",
    "symbol": "EMYC",
    "decimals": 18
  },
  "networkId": 4544,
  "rpc": [
    "https://4544.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.emoney.network/"
  ],
  "shortName": "emoney",
  "slip44": 118,
  "slug": "emoney-network-testnet",
  "testnet": true
} as const satisfies Chain;