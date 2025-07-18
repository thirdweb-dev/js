import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { createThirdwebClient } from "../../client/client.js";
import { setThirdwebDomains } from "../../utils/domains.js";
import * as Contracts from "../contracts/index.js";
import * as Wallets from "./index.js";

describe.skip("login tests", () => {
  beforeAll(() => {
    setThirdwebDomains({
      inAppWallet: "embedded-wallet.thirdweb-dev.com",
      api: "api.thirdweb-dev.com",
    });
  });

  it.skip("login with OTP", { retry: 0 }, async () => {
    const client = createThirdwebClient({
      clientId: "...",
    });

    await Wallets.sendLoginCode({
      client,
      type: "phone",
      phoneNumber: "+1111111111",
    });

    const wallet = await Wallets.verifyLoginCode({
      client,
      type: "phone",
      phoneNumber: "+1111111111",
      otp: "000000",
    });

    const address = wallet.address;
    const profiles = wallet.getProfiles();
    const balance = await wallet.getBalance({ chainId: 1 });

    console.log({ address, profiles, balance });

    // rest of the sdk maps to HTTP API as close as possible:

    // Contract.prepareCall()
    // Contract.write({ wallet, contractAddress, chainId, calls })
    // Contract.read({ contractAddress, chainId, calls })

    // Transactions.send({ wallet, chainId, transaction })
    // Transactions.get(id)

    expect(address).toBeDefined();
    expect(profiles).toBeDefined();
    expect(balance).toBeDefined();
  });

  it("login as guest", async () => {
    const client = TEST_CLIENT;

    const wallet = await Wallets.loginAsGuest({
      client,
    });

    // const serverWalletAddress = await Wallets.createServerWallet({
    //   client,
    //   identifier: "test",
    // })
    // const serverWallet = Wallets.serverWallet({
    //   client,
    //   serverWalletAddress,
    // });

    const address = wallet.address;
    const profiles = await wallet.getProfiles();

    console.log({ address, profiles });

    const transactionId = await Contracts.write({
      wallet,
      chainId: 84532,
      calls: [
        {
          contractAddress: "0xe352Cf5f74e3ACfd2d59EcCee6373d2Aa996086e",
          method: "function approve(address,uint256)",
          params: ["0x4fA9230f4E8978462cE7Bf8e6b5a2588da5F4264", "100"],
        },
      ],
    });

    console.log({ transactionId });

    // poll for status
    // Transactions.get(transactionId)
  });

  // const { loginWithCode, sendCode, loginWithOauth, wallet, state } = useWallets();
});
