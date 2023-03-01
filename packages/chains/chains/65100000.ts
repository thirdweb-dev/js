export default {
  "name": "Autonity Piccadilly (Thames) Testnet",
  "chain": "AUT",
  "rpc": [
    "https://autonity-piccadilly-thames-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.piccadilly.autonity.org/",
    "wss://rpc1.piccadilly.autonity.org/ws/"
  ],
  "faucets": [
    "https://faucet.autonity.org/"
  ],
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "shortName": "piccadilly-0",
  "chainId": 65100000,
  "networkId": 65100000,
  "icon": {
    "url": "ipfs://Qmae5oAFpcCG1MEMBwGbNodHAR3wqPBxQkon28AF2SfKTX",
    "width": 81,
    "height": 81,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://piccadilly.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "autonity-piccadilly-thames-testnet"
} as const;