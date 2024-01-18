/* eslint-disable turbo/no-undeclared-env-vars */
import { createClient } from "./src";
import { privateKeyWallet } from "./src/wallets/private-key";

// Step 1: create a client
const client = createClient({
  // create a secret key at https://thirdweb.com/dashboard
  secretKey: process.env.SECRET_KEY as string,
});

// Step 2: define a contract to interact with
const contract = client.contract({
  // the contract address
  address: "0xBCfaB342b73E08858Ce927b1a3e3903Ddd203980",
  // the chainId of the chain the contract is deployed on
  chainId: 5,
});

// Step 3: read contract state
const balance = await contract.read({
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("beginning balance", balance);

// Step 4: initialize a wallet
const wallet = await privateKeyWallet(client).connect({
  pkey: process.env.PKEY as string,
});

// Step 5: create a transaction
const tx = contract.transaction({
  method: "function mintTo(address to, uint256 amount)",
  params: [
    "0x0890C23024089675D072E984f28A93bb391a35Ab",
    BigInt(100) * BigInt(10) ** BigInt(18),
  ],
});

// Step 6: execute the transaction with the wallet
const receipt = await wallet.sendTransaction(tx);

console.log("tx hash", receipt.transactionHash);

// Step 7: wait for the receipt to be mined
const txReceipt = await receipt.wait();

console.log(txReceipt);

// Step 8: read contract state
const newBalance = await contract.read({
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("ending balance", newBalance);
