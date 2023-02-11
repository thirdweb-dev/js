export default {
  "name": "Condor Test Network",
  "chain": "CONDOR",
  "icon": {
    "url": "ipfs://QmPRDuEJSTqp2cDUvWCp71Wns6XV8nvdeAVKWH6srpk4xM",
    "width": 752,
    "height": 752,
    "format": "png"
  },
  "rpc": [
    "https://condor-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.condor.systems/rpc"
  ],
  "faucets": [
    "https://faucet.condor.systems"
  ],
  "nativeCurrency": {
    "name": "Condor Native Token",
    "symbol": "CONDOR",
    "decimals": 18
  },
  "infoURL": "https://condor.systems",
  "shortName": "condor",
  "chainId": 188881,
  "networkId": 188881,
  "explorers": [
    {
      "name": "CondorScan",
      "url": "https://explorer.condor.systems",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "condor-test-network"
} as const;