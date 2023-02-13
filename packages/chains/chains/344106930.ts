export default {
  "name": "Calypso NFT Hub (SKALE Testnet)",
  "title": "Calypso NFT Hub Testnet",
  "chain": "staging-utter-unripe-menkar",
  "rpc": [
    "https://calypso-nft-hub-skale-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar"
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://calypsohub.network/",
  "shortName": "calypso-testnet",
  "chainId": 344106930,
  "networkId": 344106930,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com",
      "icon": "calypso",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "calypso-nft-hub-skale-testnet"
} as const;