import { ThirdwebAuth } from "../../src/evm/core";
import { MinimalWallet } from "@thirdweb-dev/wallets";
import { expect } from "chai";
import { Wallet } from "ethers";

interface MinimalWalletWithAddress extends MinimalWallet {
  address: string;
}

describe("Wallet Authentication", async () => {
  let adminWallet: MinimalWalletWithAddress,
    signerWallet: MinimalWalletWithAddress,
    attackerWallet: MinimalWalletWithAddress;
  let auth: ThirdwebAuth;
  const domain = "thirdweb.com";

  before(async () => {
    const [adminSigner, signerSigner, attackerSigner] = [
      Wallet.createRandom(),
      Wallet.createRandom(),
      Wallet.createRandom(),
    ];

    adminWallet = {
      getSigner: async () => adminSigner,
      address: adminSigner.address,
    };
    signerWallet = {
      getSigner: async () => signerSigner,
      address: signerSigner.address,
    };
    attackerWallet = {
      getSigner: async () => attackerSigner,
      address: attackerSigner.address,
    };

    auth = new ThirdwebAuth(signerWallet, "example.com");
  });

  beforeEach(async () => {
    auth.updateWallet(signerWallet);
  });

  it("Should verify logged in wallet", async () => {
    const payload = await auth.login(domain);

    auth.updateWallet(adminWallet);
    const address = auth.verify(domain, payload);

    expect(address).to.equal(signerWallet.address);
  });

  it("Should verify logged in wallet with chain ID and expiration", async () => {
    const payload = await auth.login(domain, {
      expirationTime: new Date(Date.now() + 1000 * 60 * 5),
      chainId: 137,
    });

    auth.updateWallet(adminWallet);
    const address = auth.verify(domain, payload, {
      chainId: 137,
    });

    expect(address).to.equal(signerWallet.address);
  });

  it("Should reject payload with incorrect domain", async () => {
    const payload = await auth.login(domain);

    auth.updateWallet(adminWallet);
    try {
      auth.verify("test.thirdweb.com", payload);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal(
        "Expected domain 'test.thirdweb.com' does not match domain on payload 'thirdweb.com'",
      );
    }
  });

  it("Should reject expired login payload", async () => {
    const payload = await auth.login(domain, {
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    auth.updateWallet(adminWallet);
    try {
      auth.verify(domain, payload);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal("Login request has expired");
    }
  });

  it("Should reject payload with incorrect chain ID", async () => {
    const payload = await auth.login(domain, {
      chainId: 1,
    });

    auth.updateWallet(adminWallet);
    try {
      auth.verify(domain, payload, {
        chainId: 137,
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal(
        "Chain ID '137' does not match payload chain ID '1'",
      );
    }
  });

  it("Should reject payload with incorrect signer", async () => {
    const payload = await auth.login(domain);
    payload.payload.address = attackerWallet.address;

    auth.updateWallet(adminWallet);
    try {
      auth.verify(domain, payload);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("does not match payload address");
    }
  });

  it("Should generate valid authentication token", async () => {
    const payload = await auth.login(domain);

    auth.updateWallet(adminWallet);
    const token = await auth.generateAuthToken(domain, payload);
    const address = await auth.authenticate(domain, token);

    expect(address).to.equal(signerWallet.address);
  });

  it("Should reject token with incorrect domain", async () => {
    const payload = await auth.login(domain);

    auth.updateWallet(adminWallet);
    const token = await auth.generateAuthToken(domain, payload);

    try {
      await auth.authenticate("test.thirdweb.com", token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain(
        "Expected token to be for the domain 'test.thirdweb.com', but found token with domain 'thirdweb.com'",
      );
    }
  });

  it("Should reject token before invalid before", async () => {
    const payload = await auth.login(domain);

    auth.updateWallet(adminWallet);
    const token = await auth.generateAuthToken(domain, payload, {
      invalidBefore: new Date(Date.now() + 1000 * 60 * 5),
    });

    try {
      await auth.authenticate(domain, token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("This token is invalid before");
    }
  });

  it("Should reject expired authentication token", async () => {
    const payload = await auth.login(domain);

    auth.updateWallet(adminWallet);
    const token = await auth.generateAuthToken(domain, payload, {
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    try {
      await auth.authenticate(domain, token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("This token expired");
    }
  });

  it("Should reject if admin address is not connected wallet address", async () => {
    const payload = await auth.login(domain);

    auth.updateWallet(adminWallet);
    const token = await auth.generateAuthToken(domain, payload);

    auth.updateWallet(signerWallet);
    try {
      await auth.authenticate(domain, token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain(
        `Expected the connected wallet address '${signerWallet.address}' to match the token issuer address '${adminWallet.address}'`,
      );
    }
  });
});
