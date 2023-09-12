import type { Chain } from "../src/types";
export default {
  "name": "PulseChain Testnet v4",
  "shortName": "t4pls",
  "chain": "t4PLS",
  "chainId": 943,
  "networkId": 943,
  "icon": {
    "url": "ipfs://Qmckj9B9F3jWDk9bv9HwoPmfjrx2Ju8J2BQSNoPFdYGduj",
    "width": 433,
    "height": 402,
    "format": "png"
  },
  "infoURL": "https://pulsechain.com",
  "rpc": [
    "https://pulsechain-testnet-v4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v4.testnet.pulsechain.com/",
    "wss://rpc.v4.testnet.pulsechain.com/",
    "https://pulsechain-testnet.publicnode.com",
    "wss://pulsechain-testnet.publicnode.com"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [
    "https://faucet.v4.testnet.pulsechain.com/"
  ],
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "status": "active",
  "slip44": 60,
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.v4.testnet.pulsechain.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "pulsechain-testnet-v4"
} as const satisfies Chain;