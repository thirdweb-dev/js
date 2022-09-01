const { ThirdwebSDK } = require("../..");

(async function () {
  const sdk = new ThirdwebSDK("rinkeby");
  const c = await sdk.getContract("0x10fDF181eDceAEF044328BeF07979FfaE209023f");
  console.log(await c.metadata.get());
})();
