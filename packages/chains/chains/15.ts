export default {
  "name": "Diode Prenet",
  "chain": "DIODE",
  "rpc": [
    "https://diode-prenet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prenet.diode.io:8443/",
    "wss://prenet.diode.io:8443/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Diodes",
    "symbol": "DIODE",
    "decimals": 18
  },
  "infoURL": "https://diode.io/prenet",
  "shortName": "diode",
  "chainId": 15,
  "networkId": 15,
  "testnet": false,
  "slug": "diode-prenet"
} as const;