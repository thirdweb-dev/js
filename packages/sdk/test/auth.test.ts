import { signers } from "./before-setup";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ThirdwebSDK } from "../src";

describe("Wallet Authentication", async () => {
  let adminWallet: SignerWithAddress,
    signerWallet: SignerWithAddress,
    attackerWallet: SignerWithAddress;
  let sdk: ThirdwebSDK;
  const domain = "thirdweb.com";

  before(async () => {
    [adminWallet, signerWallet, attackerWallet] = signers;
    sdk = new ThirdwebSDK(adminWallet);
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(signerWallet);
  });

  it("Should verify logged in wallet", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.updateSignerOrProvider(adminWallet);
    const address = sdk.auth.verify(domain, payload);

    expect(address).to.equal(signerWallet.address);
  });

  it("Should verify logged in wallet with chain ID and expiration", async () => {
    const payload = await sdk.auth.login(domain, {
      expirationTime: new Date(Date.now() + 1000 * 60 * 5),
      chainId: 137,
    });

    sdk.updateSignerOrProvider(adminWallet);
    const address = sdk.auth.verify(domain, payload, {
      chainId: 137,
    });

    expect(address).to.equal(signerWallet.address);
  });

  it("Should reject payload with incorrect domain", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.updateSignerOrProvider(adminWallet);
    try {
      sdk.auth.verify("test.thirdweb.com", payload);
      expect.fail();
    } catch (err) {
      expect(err.message).to.equal(
        "Expected domain 'test.thirdweb.com' does not match domain on payload 'thirdweb.com'",
      );
    }
  });

  it("Should reject expired login payload", async () => {
    const payload = await sdk.auth.login(domain, {
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    sdk.updateSignerOrProvider(adminWallet);
    try {
      sdk.auth.verify(domain, payload);
      expect.fail();
    } catch (err) {
      expect(err.message).to.equal("Login request has expired");
    }
  });

  it("Should reject payload with incorrect chain ID", async () => {
    const payload = await sdk.auth.login(domain, {
      chainId: 1,
    });

    sdk.updateSignerOrProvider(adminWallet);
    try {
      sdk.auth.verify(domain, payload, {
        chainId: 137,
      });
      expect.fail();
    } catch (err) {
      expect(err.message).to.equal(
        "Chain ID '137' does not match payload chain ID '1'",
      );
    }
  });

  it("Should reject payload with incorrect signer", async () => {
    const payload = await sdk.auth.login(domain);
    payload.payload.address = attackerWallet.address;

    sdk.updateSignerOrProvider(adminWallet);
    try {
      sdk.auth.verify(domain, payload);
      expect.fail();
    } catch (err) {
      expect(err.message).to.contain("does not match payload address");
    }
  });

  it("Should generate valid authentication token", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.updateSignerOrProvider(adminWallet);
    const token = await sdk.auth.generateAuthToken(domain, payload);
    const address = await sdk.auth.authenticate(domain, token);

    expect(address).to.equal(signerWallet.address);
  });

  it("Should reject token with incorrect domain", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.updateSignerOrProvider(adminWallet);
    const token = await sdk.auth.generateAuthToken(domain, payload);

    try {
      await sdk.auth.authenticate("test.thirdweb.com", token);
      expect.fail();
    } catch (err) {
      expect(err.message).to.contain(
        "Expected token to be for the domain 'test.thirdweb.com', but found token with domain 'thirdweb.com'",
      );
    }
  });

  it("Should reject token before invalid before", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.updateSignerOrProvider(adminWallet);
    const token = await sdk.auth.generateAuthToken(domain, payload, {
      invalidBefore: new Date(Date.now() + 1000 * 60 * 5),
    });

    try {
      await sdk.auth.authenticate(domain, token);
      expect.fail();
    } catch (err) {
      expect(err.message).to.contain("This token is invalid before");
    }
  });

  it("Should reject expired authentication token", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.updateSignerOrProvider(adminWallet);
    const token = await sdk.auth.generateAuthToken(domain, payload, {
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    try {
      await sdk.auth.authenticate(domain, token);
      expect.fail();
    } catch (err) {
      expect(err.message).to.contain("This token expired");
    }
  });

  it("Should reject if admin address is not connected wallet address", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.updateSignerOrProvider(adminWallet);
    const token = await sdk.auth.generateAuthToken(domain, payload);

    sdk.updateSignerOrProvider(signerWallet);
    try {
      await sdk.auth.authenticate(domain, token);
      expect.fail();
    } catch (err) {
      expect(err.message).to.contain(
        `Expected the connected wallet address '${signerWallet.address}' to match the token issuer address '${adminWallet.address}'`,
      );
    }
  });
});
