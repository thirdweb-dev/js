export default {
  "name": "Calypso NFT Hub (SKALE)",
  "title": "Calypso NFT Hub Mainnet",
  "chain": "honorable-steel-rasalhague",
  "rpc": [
    "https://calypso-nft-hub-skale.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://calypsohub.network/",
  "shortName": "calypso-mainnet",
  "chainId": 1564830818,
  "networkId": 1564830818,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com",
      "icon": "calypso",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "calypso-nft-hub-skale"
} as const;