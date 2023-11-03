import type { Chain } from "../types";
export default {
  "chain": "honorable-steel-rasalhague",
  "chainId": 1564830818,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafybeigyayzxvt7vosat4rtrbmhhnldgx57w2pfbutuniax7h6kswzi42m",
        "width": 1637,
        "height": 1636,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev"
  ],
  "infoURL": "https://calypsohub.network/",
  "name": "Calypso NFT Hub (SKALE)",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1564830818,
  "rpc": [
    "https://calypso-nft-hub-skale.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1564830818.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
  ],
  "shortName": "calypso-mainnet",
  "slug": "calypso-nft-hub-skale",
  "testnet": false,
  "title": "Calypso NFT Hub Mainnet"
} as const satisfies Chain;