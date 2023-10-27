import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://eth.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "dexguru",
      "url": "https://ethereum.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://ethereum.org",
  "name": "Ethereum Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1,
  "redFlags": [],
  "rpc": [
    "https://ethereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://api.mycryptoapi.com/eth",
    "https://cloudflare-eth.com",
    "https://ethereum.publicnode.com",
    "wss://ethereum.publicnode.com",
    "https://mainnet.gateway.tenderly.co",
    "wss://mainnet.gateway.tenderly.co",
    "https://rpc.blocknative.com/boost",
    "https://rpc.flashbots.net/fast",
    "https://rpc.mevblocker.io/fullprivacy"
  ],
  "shortName": "eth",
  "slip44": 60,
  "slug": "ethereum",
  "testnet": false
} as const satisfies Chain;