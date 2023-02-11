export default {
  "name": "F(x)Core Mainnet Network",
  "chain": "Fxcore",
  "rpc": [
    "https://f-x-core-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fx-json-web3.functionx.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Function X",
    "symbol": "FX",
    "decimals": 18
  },
  "infoURL": "https://functionx.io/",
  "shortName": "FxCore",
  "chainId": 530,
  "networkId": 530,
  "icon": {
    "url": "ipfs://bafkreifrf2iq3k3dqfbvp3pacwuxu33up3usmrhojt5ielyfty7xkixu3i",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "FunctionX Explorer",
      "url": "https://fx-evm.functionx.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "f-x-core-network"
} as const;