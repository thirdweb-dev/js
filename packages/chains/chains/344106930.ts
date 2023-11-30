import type { Chain } from "../src/types";
export default {
  "chain": "staging-utter-unripe-menkar",
  "chainId": 344106930,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "icon": {
    "url": "ipfs://bafybeigyayzxvt7vosat4rtrbmhhnldgx57w2pfbutuniax7h6kswzi42m",
    "width": 1637,
    "height": 1636,
    "format": "png"
  },
  "infoURL": "https://calypsohub.network/",
  "name": "SKALE Calypso Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 344106930,
  "rpc": [
    "https://skale-calypso-hub-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://344106930.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar"
  ],
  "shortName": "calypso-testnet",
  "slug": "skale-calypso-hub-testnet",
  "testnet": true,
  "title": "Calypso NFT Hub Testnet"
} as const satisfies Chain;