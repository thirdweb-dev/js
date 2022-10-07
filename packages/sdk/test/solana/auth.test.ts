import { sdk } from "./before-setup";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("Wallet Authentication", async () => {
  let adminWallet = Keypair.generate();
  let signerWallet = Keypair.generate();
  let attackerWallet = Keypair.generate();
  const domain = "thirdweb.com";

  beforeEach(async () => {
    sdk.wallet.connect(signerWallet);
  });

  it("Should verify logged in wallet", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.wallet.connect(adminWallet);
    const address = sdk.auth.verify(domain, payload);

    expect(address).to.equal(signerWallet.publicKey.toBase58());
  });

  it("Should reject payload with incorrect domain", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.wallet.connect(adminWallet);
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

    sdk.wallet.connect(adminWallet);
    try {
      sdk.auth.verify(domain, payload);
      expect.fail();
    } catch (err) {
      expect(err.message).to.equal("Login request has expired");
    }
  });

  it("Should reject payload with incorrect signer", async () => {
    const payload = await sdk.auth.login(domain);
    payload.payload.address = attackerWallet.publicKey.toBase58();

    sdk.wallet.connect(adminWallet);
    try {
      sdk.auth.verify(domain, payload);
      expect.fail();
    } catch (err) {
      expect(err.message).to.contain("did not sign the provided message");
    }
  });

  it("Should generate valid authentication token", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.wallet.connect(adminWallet);
    const token = await sdk.auth.generateAuthToken(domain, payload);
    const address = await sdk.auth.authenticate(domain, token);

    expect(address).to.equal(signerWallet.publicKey.toBase58());
  });

  it("Should reject token with incorrect domain", async () => {
    const payload = await sdk.auth.login(domain);

    sdk.wallet.connect(adminWallet);
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

    sdk.wallet.connect(adminWallet);
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

    sdk.wallet.connect(adminWallet);
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

    sdk.wallet.connect(adminWallet);
    const token = await sdk.auth.generateAuthToken(domain, payload);

    sdk.wallet.connect(signerWallet);
    try {
      await sdk.auth.authenticate(domain, token);
      expect.fail();
    } catch (err) {
      expect(err.message).to.contain(
        `Expected the connected wallet address '${signerWallet.publicKey.toBase58()}' to match the token issuer address '${adminWallet.publicKey.toBase58()}'`,
      );
    }
  });
});
