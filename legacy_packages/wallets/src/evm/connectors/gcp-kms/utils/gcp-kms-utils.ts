import { ethers } from "ethers";
import { KeyManagementServiceClient } from "@google-cloud/kms";
import * as asn1 from "asn1.js";
import BN from "bn.js";
import KeyEncoder from "key-encoder";
import type { GcpKmsSignerCredentials } from "../signer";

const keyEncoder = new KeyEncoder("secp256k1");

/* this asn1.js library has some funky things going on */
/* eslint-disable func-names */
const EcdsaSigAsnParse: {
  decode: (asnStringBuffer: Buffer, format: "der") => { r: BN; s: BN };
  // eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
} = asn1.define("EcdsaSig", function (this: any) {
  // parsing this according to https://tools.ietf.org/html/rfc3279#section-2.2.3
  this.seq().obj(this.key("r").int(), this.key("s").int());
});
// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
const EcdsaPubKey = asn1.define("EcdsaPubKey", function (this: any) {
  // parsing this according to https://tools.ietf.org/html/rfc5480#section-2
  this.seq().obj(
    this.key("algo").seq().obj(this.key("a").objid(), this.key("b").objid()),
    this.key("pubKey").bitstr(),
  );
});
/* eslint-enable func-names */

function getClientCredentials(kmsCredentials: GcpKmsSignerCredentials) {
  if (
    kmsCredentials.applicationCredentialEmail &&
    kmsCredentials.applicationCredentialPrivateKey
  ) {
    return {
      credentials: {
        client_email: kmsCredentials.applicationCredentialEmail,
        private_key: kmsCredentials.applicationCredentialPrivateKey.replace(
          /\\n/gm,
          "\n",
        ),
      },
    };
  }

  const applicationCredentialEmail =
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.GOOGLE_APPLICATION_CREDENTIAL_EMAIL;
  const applicationCredentialPrivateKey =
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.GOOGLE_APPLICATION_CREDENTIAL_PRIVATE_KEY;
  return applicationCredentialEmail && applicationCredentialPrivateKey
    ? {
        credentials: {
          client_email: applicationCredentialEmail,
          private_key: applicationCredentialPrivateKey.replace(/\\n/gm, "\n"),
        },
      }
    : {};
}

export async function sign(
  digest: Buffer,
  kmsCredentials: GcpKmsSignerCredentials,
) {
  const kms = new KeyManagementServiceClient(
    getClientCredentials(kmsCredentials),
  );
  const versionName = kms.cryptoKeyVersionPath(
    kmsCredentials.projectId,
    kmsCredentials.locationId,
    kmsCredentials.keyRingId,
    kmsCredentials.keyId,
    kmsCredentials.keyVersion,
  );
  const [asymmetricSignResponse] = await kms.asymmetricSign({
    name: versionName,
    digest: {
      sha256: digest,
    },
  });
  return asymmetricSignResponse;
}

export const getPublicKey = async (kmsCredentials: GcpKmsSignerCredentials) => {
  const kms = new KeyManagementServiceClient(
    getClientCredentials(kmsCredentials),
  );
  const versionName = kms.cryptoKeyVersionPath(
    kmsCredentials.projectId,
    kmsCredentials.locationId,
    kmsCredentials.keyRingId,
    kmsCredentials.keyId,
    kmsCredentials.keyVersion,
  );
  const [publicKey] = await kms.getPublicKey({
    name: versionName,
  });
  if (!publicKey || !publicKey.pem) {
    throw new Error(`Can not find key: ${kmsCredentials.keyId}`);
  }

  // GCP KMS returns the public key in pem format,
  // so we need to encode it to der format, and return the hex buffer.
  const der = keyEncoder.encodePublic(publicKey.pem, "pem", "der");
  return Buffer.from(der, "hex");
};

export function getEthereumAddress(publicKey: Buffer): string {
  // The public key here is a hex der ASN1 encoded in a format according to
  // https://tools.ietf.org/html/rfc5480#section-2
  // I used https://lapo.it/asn1js to figure out how to parse this
  // and defined the schema in the EcdsaPubKey object.
  const res = EcdsaPubKey.decode(publicKey, "der");
  const pubKeyBuffer: Buffer = res.pubKey.data;

  // The raw format public key starts with a `04` prefix that needs to be removed
  // more info: https://www.oreilly.com/library/view/mastering-ethereum/9781491971932/ch04.html
  // const pubStr = publicKey.toString();
  const pubFormatted = pubKeyBuffer.slice(1, pubKeyBuffer.length);

  // keccak256 hash of publicKey
  const address = ethers.utils.keccak256(pubFormatted);
  // take last 20 bytes as ethereum address
  const EthAddr = `0x${address.slice(-40)}`;
  return EthAddr;
}

export function findEthereumSig(signature: Buffer) {
  const decoded = EcdsaSigAsnParse.decode(signature, "der");
  const { r, s } = decoded;

  const secp256k1N = new BN(
    "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
    16,
  ); // max value on the curve
  const secp256k1halfN = secp256k1N.div(new BN(2)); // half of the curve
  // Because of EIP-2 not all elliptic curve signatures are accepted
  // the value of s needs to be SMALLER than half of the curve
  // i.e. we need to flip s if it's greater than half of the curve
  // if s is less than half of the curve, we're on the "good" side of the curve, we can just return
  return { r, s: s.gt(secp256k1halfN) ? secp256k1N.sub(s) : s };
}

export async function requestKmsSignature(
  plaintext: Buffer,
  kmsCredentials: GcpKmsSignerCredentials,
) {
  const response = await sign(plaintext, kmsCredentials);
  if (!response || !response.signature) {
    throw new Error(`GCP KMS call failed`);
  }
  return findEthereumSig(response.signature as Buffer);
}

function recoverPubKeyFromSig(msg: Buffer, r: BN, s: BN, v: number) {
  return ethers.utils.recoverAddress(`0x${msg.toString("hex")}`, {
    r: `0x${r.toString("hex")}`,
    s: `0x${s.toString("hex")}`,
    v,
  });
}

export function determineCorrectV(
  msg: Buffer,
  r: BN,
  s: BN,
  expectedEthAddr: string,
) {
  // This is the wrapper function to find the right v value
  // There are two matching signatures on the elliptic curve
  // we need to find the one that matches to our public key
  // it can be v = 27 or v = 28
  let v = 27;
  let pubKey = recoverPubKeyFromSig(msg, r, s, v);
  if (pubKey.toLowerCase() !== expectedEthAddr.toLowerCase()) {
    // if the pub key for v = 27 does not match
    // it has to be v = 28
    v = 28;
    pubKey = recoverPubKeyFromSig(msg, r, s, v);
  }
  return { pubKey, v };
}
