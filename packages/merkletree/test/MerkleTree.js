/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint camelcase: 0 */
const test = require("tape");
const keccak256 = require("keccak256");
const { keccak256: ethjskeccak256 } = require("ethereumjs-util");
const crypto = require("crypto");
//** REMOVED - removed crypto-js support **//
// const CryptoJS = require("crypto-js");
//** REMOVED - removed crypto-js support **//
// const SHA256 = require("crypto-js/sha256");
//** REMOVED - removed crypto-js support **//
// const SHA3 = require("crypto-js/sha3");
const sha1 = require("sha1");
const {
  keccak256: ethCryptoKeccak256,
} = require("ethereum-cryptography/keccak");
const { buildPoseidon } = require("circomlibjs");

const { MerkleTree } = require("../");

const sha256 = (data) => crypto.createHash("sha256").update(data).digest();

test("sha256 with keccak256 leaves", (t) => {
  t.plan(3);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);

  t.equal(
    tree.getHexRoot(),
    "0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae",
  );
  t.deepEqual(tree.getHexLeaves(), [
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  ]);
  t.deepEqual(tree.getHexLayers(), [
    [
      "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
      "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
      "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    ],
    [
      "0x176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1",
      "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    ],
    ["0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae"],
  ]);
});

test("sha256 with ethjs-keccak256 leaves", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map((v) => ethjskeccak256(Buffer.from(v)));
  const tree = new MerkleTree(leaves, sha256);
  t.equal(
    tree.getHexRoot(),
    "0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae",
  );
});

test("sha256 with keccak256 leaves with duplicate odd option", (t) => {
  t.plan(3);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256, { duplicateOdd: true });

  t.equal(
    tree.getHexRoot(),
    "0xbcdd0f60308db788712205115fe4273bfda49fa0925611fee765a63df9ab96a1",
  );
  t.deepEqual(tree.getHexLeaves(), [
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  ]);
  t.deepEqual(tree.getHexLayers(), [
    [
      "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
      "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
      "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    ],
    [
      "0x176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1",
      "0x43e061172b1177f25d0f156b2d2ed11728006fade8e167ff3d1b9dbc979a3358",
    ],
    ["0xbcdd0f60308db788712205115fe4273bfda49fa0925611fee765a63df9ab96a1"],
  ]);
});

//** REMOVED - removed crypto-js support **//
// test("crypto-js - sha256", (t) => {
//   t.plan(1);

//   const leaves = ["a", "b", "c"].map(keccak256);
//   const tree = new MerkleTree(leaves, SHA256);
//   const root =
//     "311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae";

//   t.equal(tree.getRoot().toString("hex"), root);
// });

test("sha256 with sort pairs option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree = new MerkleTree(leaves, sha256, { sortPairs: true });
  const root =
    "a30ba95a1a5dc397fe45ea20105363b08d682b864a28f4940419a29349a28325";

  t.equal(tree.getRoot().toString("hex"), root);
});

// ** REMOVED - removed functionality ** //
// test("sha256 - static verify", (t) => {
//   t.plan(2);

//   const leaves = ["a", "b", "c"].map(sha256);
//   const tree = new MerkleTree(leaves, sha256);
//   const leaf = sha256(Buffer.from("a"));
//   const badLeaf = sha256(Buffer.from("o"));
//   const proof = tree.getProof(leaf);
//   const badProof = tree.getProof(badLeaf);
//   const root = tree.getRoot();

//   t.true(MerkleTree.verify(proof, leaf, root, sha256));
//   t.false(MerkleTree.verify(badProof, leaf, root, sha256));
// });

test("sha256 verify with positional hex proof and no pairSort", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree = new MerkleTree(leaves, sha256, { sortPairs: false });

  t.true(
    tree.verify(
      tree.getPositionalHexProof(leaves[1], 1),
      leaves[1],
      tree.getHexRoot(),
    ),
  );
});

test("sha256 verify with non-hex proof and no pairSort", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree = new MerkleTree(leaves, sha256, { sortPairs: false });

  t.true(
    tree.verify(tree.getProof(leaves[1], 1), leaves[1], tree.getHexRoot()),
  );
});

test("sha256 verify with hex proof and pairSort", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree = new MerkleTree(leaves, sha256, { sortPairs: true });

  t.true(
    tree.verify(tree.getHexProof(leaves[1], 1), leaves[1], tree.getHexRoot()),
  );
});

test("keccak256 with sort leaves and sort pairs option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((v) =>
    keccak256(Buffer.from(v)),
  );
  const tree = new MerkleTree(leaves, keccak256, {
    sortLeaves: true,
    sortPairs: true,
  });
  const root =
    "60219f87561939610b484575e45c6e81156a53b86d7cd16640d930d14f21758e";

  t.equal(tree.getRoot().toString("hex"), root);
});

test("keccak256 with sort option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((v) =>
    keccak256(Buffer.from(v)),
  );
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root =
    "60219f87561939610b484575e45c6e81156a53b86d7cd16640d930d14f21758e";

  t.equal(tree.getRoot().toString("hex"), root);
});

test("sha256 with sha256 leaves and sort pairs option and duplicate odd option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree = new MerkleTree(leaves, sha256, {
    sortPairs: true,
    duplicateOdd: true,
  });
  const root =
    "a5260b2a7ec31584e5d5689a5628c2b3d949e2397334fd71c107478e5f887eaf";

  t.equal(tree.getRoot().toString("hex"), root);
});

test("sha256 with hash leaves option", (t) => {
  t.plan(2);

  const expectedRoot =
    "0x1f7379539707bcaea00564168d1d4d626b09b73f8a2a365234c62d763f854da2";

  const leaves = ["a", "b", "c", "d", "e", "f"];
  const tree1 = new MerkleTree(leaves, sha256, { hashLeaves: true });
  t.equal(tree1.getHexRoot(), expectedRoot);

  const hashedLeaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree2 = new MerkleTree(hashedLeaves, sha256);
  t.equal(tree2.getHexRoot(), expectedRoot);
});

test("sha256 with hash leaves option and duplicate odd option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f"];
  const tree = new MerkleTree(leaves, sha256, {
    hashLeaves: true,
    duplicateOdd: true,
  });
  const root =
    "44205acec5156114821f1f71d87c72e0de395633cd1589def6d4444cc79f8103";

  t.equal(tree.getRoot().toString("hex"), root);
});

//** REMOVED - removed crypto-js support **//
// test("crypto-js - sha256 with sha256 leaves", (t) => {
//   t.plan(1);

//   const leaves = ["a", "b", "c"].map(SHA256);
//   const tree = new MerkleTree(leaves, SHA256);
//   const root =
//     "7075152d03a5cd92104887b476862778ec0c87be5c2fa1c0a90f87c49fad6eff";

//   t.equal(tree.getRoot().toString("hex"), root);
// });

//** REMOVED - removed crypto-js support **//
// test("crypto-js - sha256 with keccak256 leaves and duplicate odd option", (t) => {
//   t.plan(1);

//   const leaves = ["a", "b", "c"].map(keccak256);
//   const tree = new MerkleTree(leaves, SHA256, { duplicateOdd: true });
//   const root =
//     "bcdd0f60308db788712205115fe4273bfda49fa0925611fee765a63df9ab96a1";

//   t.equal(tree.getRoot().toString("hex"), root);
// });

//** REMOVED - removed crypto-js support **//
// test("crypto-js - SHA256 with SHA256 leaves and duplicate odd option", (t) => {
//   t.plan(1);

//   const leaves = ["a", "b", "c"].map(SHA256);
//   const tree = new MerkleTree(leaves, SHA256, { duplicateOdd: true });
//   const root =
//     "d31a37ef6ac14a2db1470c4316beb5592e6afd4465022339adafda76a18ffabe";

//   t.equal(tree.getRoot().toString("hex"), root);
// });

//** REMOVED - removed crypto-js support **//
// test("crypto-js - SHA256 with SHA3 leaves", (t) => {
//   t.plan(1);

//   const leaves = ["a", "b", "c"].map((v) => SHA3(v));
//   const tree = new MerkleTree(leaves, SHA256);

//   const root =
//     "57e9ee696a291f8a51d224a6d64ba4a0693920a63f1e0329efe96c02a5f28849";

//   t.equal(tree.getRoot().toString("hex"), root);
// });

//** REMOVED - removed crypto-js support **//
// test("crypto-js - SHA256 with keccak256 leaves and duplicate odd option", (t) => {
//   t.plan(1);

//   const leaves = ["a", "b", "c"].map(keccak256);
//   const tree = new MerkleTree(leaves, SHA256, { duplicateOdd: true });
//   const root =
//     "bcdd0f60308db788712205115fe4273bfda49fa0925611fee765a63df9ab96a1";

//   t.equal(tree.getRoot().toString("hex"), root);
// });

test("solidity keccak256", (t) => {
  t.plan(20);

  const leaves = ["a", "b", "c"].map(keccak256);

  const a_hash =
    "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb";
  const b_hash =
    "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510";
  const c_hash =
    "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2";

  t.deepEqual(
    leaves.map((v) => v.toString("hex")),
    [a_hash, b_hash, c_hash],
  );

  const tree = new MerkleTree(leaves, keccak256);

  const layers = tree.getLayers().slice(1); // no leaves

  const layer_1 = keccak256(Buffer.concat([leaves[0], leaves[1]])).toString(
    "hex",
  );

  t.equal(layers[0][0].toString("hex"), layer_1);
  t.equal(layers[0][1].toString("hex"), c_hash);

  const root = Buffer.from(
    "aff1208e69c9e8be9b584b07ebac4e48a1ee9d15ce3afe20b77a4d29e4175aa3",
    "hex",
  );
  t.equal(tree.getRoot().toString("hex"), root.toString("hex"));

  const proof_0 = tree.getProof(leaves[0]);
  t.equal(proof_0.length, 2);
  t.equal(proof_0[0].position, "right");
  t.equal(proof_0[0].data.toString("hex"), b_hash);
  t.equal(proof_0[1].position, "right");
  t.equal(proof_0[1].data.toString("hex"), c_hash);

  t.true(tree.verify(proof_0, leaves[0], root));

  const proof_1 = tree.getProof(leaves[1]);
  t.equal(proof_1.length, 2);
  t.equal(proof_1[0].position, "left");
  t.equal(proof_1[0].data.toString("hex"), a_hash);
  t.equal(proof_1[1].position, "right");
  t.equal(proof_1[1].data.toString("hex"), c_hash);

  t.true(tree.verify(proof_1, leaves[1], root));

  const proof_2 = tree.getProof(leaves[2]);
  t.equal(proof_2.length, 1);
  t.equal(proof_2[0].position, "left");
  t.equal(proof_2[0].data.toString("hex"), layer_1);

  t.true(tree.verify(proof_2, leaves[2], root));
});

test("solidity keccak256 with duplicate odd option", (t) => {
  t.plan(20);

  const leaves = ["a", "b", "c"].map(keccak256);

  const a_hash =
    "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb";
  const b_hash =
    "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510";
  const c_hash =
    "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2";

  t.deepEqual(
    leaves.map((v) => v.toString("hex")),
    [a_hash, b_hash, c_hash],
  );

  const tree = new MerkleTree(leaves, keccak256, { duplicateOdd: true });
  const layers = tree.getLayers().slice(1); // no leaves
  const layer_1 = keccak256(Buffer.concat([leaves[0], leaves[1]])).toString(
    "hex",
  );
  const layer_2 = keccak256(Buffer.concat([leaves[2], leaves[2]])).toString(
    "hex",
  );
  t.equal(layers[0][0].toString("hex"), layer_1);
  t.equal(layers[0][1].toString("hex"), layer_2);

  const root = Buffer.from(
    "905b17edcf8b6fb1415b32cdbab3e02c2c93f80a345de80ea2bbf9feba9f5a55",
    "hex",
  );
  t.equal(tree.getRoot().toString("hex"), root.toString("hex"));

  const proof_0 = tree.getProof(leaves[0]);
  t.equal(proof_0.length, 2);
  t.equal(proof_0[0].position, "right");
  t.equal(proof_0[0].data.toString("hex"), b_hash);
  t.equal(proof_0[1].position, "right");
  t.equal(proof_0[1].data.toString("hex"), layer_2);

  t.true(tree.verify(proof_0, leaves[0], root));

  const proof_1 = tree.getProof(leaves[1]);
  t.equal(proof_1.length, 2);
  t.equal(proof_1[0].position, "left");
  t.equal(proof_1[0].data.toString("hex"), a_hash);
  t.equal(proof_1[1].position, "right");
  t.equal(proof_1[1].data.toString("hex"), layer_2);

  t.true(tree.verify(proof_1, leaves[1], root));

  const proof_2 = tree.getProof(leaves[2]);
  t.equal(proof_2.length, 1);
  t.equal(proof_2[0].position, "left");
  t.equal(proof_2[0].data.toString("hex"), layer_1);

  t.true(tree.verify(proof_2, layer_2, root));
});

test("solidity keccak256 with duplicate leaves", (t) => {
  t.plan(5);

  const leaves = ["a", "b", "a"].map(keccak256);

  const a_hash =
    "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb";
  const b_hash =
    "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510";

  const tree = new MerkleTree(leaves, keccak256);

  t.deepEqual(
    leaves.map((v) => v.toString("hex")),
    [a_hash, b_hash, a_hash],
  );

  const root = Buffer.from(
    "b8912f7269068901f231a965adfefbc10f0eedcfa61852b103efd54dac7db3d7",
    "hex",
  );
  t.equal(tree.getRoot().toString("hex"), root.toString("hex"));

  const layer_1 = keccak256(Buffer.concat([leaves[0], leaves[1]])).toString(
    "hex",
  );

  const proof_0 = tree.getProof(leaves[2], 2);
  t.equal(proof_0.length, 1);
  t.equal(proof_0[0].position, "left");
  t.equal(proof_0[0].data.toString("hex"), layer_1);
});

test("sha-256 with option.isBitcoinTree", (t) => {
  t.plan(100);

  /* Derived from:
   * http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html
   */
  const txHashes = [
    "00baf6626abc2df808da36a518c69f09b0d2ed0a79421ccfde4f559d2e42128b",
    "91c5e9f288437262f218c60f986e8bc10fb35ab3b9f6de477ff0eb554da89dea",
    "46685c94b82b84fa05b6a0f36de6ff46475520113d5cb8c6fb060e043a0dbc5c",
    "ba7ed2544c78ad793ef5bb0ebe0b1c62e8eb9404691165ffcb08662d1733d7a8",
    "b8dc1b7b7ed847c3595e7b02dbd7372aa221756b718c5f2943c75654faf48589",
    "25074ef168a061fcc8663b4554a31b617683abc33b72d2e2834f9329c93f8214",
    "0fb8e311bffffadc6dc4928d7da9e142951d3ba726c8bde2cf1489b62fb9ebc5",
    "c67c79204e681c8bb453195db8ca7d61d4692f0098514ca198ccfd1b59dbcee3",
    "bd27570a6cbd8ad026bfdb8909fdae9321788f0643dea195f39cd84a60a1901b",
    "41a06e53ffc5108358ddcec05b029763d714ae9f33c5403735e8dee78027fe74",
    "cc2696b44cb07612c316f24c07092956f7d8b6e0d48f758572e0d611d1da6fb9",
    "8fc508772c60ace7bfeb3f5f3a507659285ea6f351ac0474a0a9710c7673d4fd",
    "62fed508c095446d971580099f976428fc069f32e966a40a991953b798b28684",
    "928eadbc39196b95147416eedf6f635dcff818916da65419904df8fde977d5db",
    "b137e685df7c1dffe031fb966a0923bb5d0e56f381e730bc01c6d5244cfe47c1",
    "b92207cee1f9e0bfbd797b05a738fab9de9c799b74f54f6b922f20bd5ec23dd6",
    "29d6f37ada0481375b6903c6480a81f8deaf2dcdba03411ed9e8d3e5684d02dd",
    "48158deb116e4fd0429fbbbae61e8e68cb6d0e0c4465ff9a6a990037f88c489c",
    "be64ea86960864cc0a0236bbb11f232faf5b19ae6e2c85518628f5fae37ec1ca",
    "081363552e9fff7461f1fc6663e1abd0fb2dd1c54931e177479a18c4c26260e8",
    "eb87c25dd2b2537b1ff3dbabc420e422e2a801f1bededa6fa49ef7980feaef70",
    "339e16fcc11deb61ccb548239270af43f5ad34c321416bada4b8d66467b1c697",
    "4ad6417a3a04179482ed2e4b7251c396e38841c6fba8d2ce9543337ab7c93c02",
    "c28a45cded020bf424b400ffc9cb6f2f85601934f18c34a4f78283247192056a",
    "882037cc9e3ee6ddc2d3eba86b7ca163533b5d3cbb16eaa38696bb0a2ea1137e",
    "179bb936305b46bb0a9df330f8701984c725a60e063ad5892fa97461570b5c04",
    "9517c585d1578cb327b7988f38e1a15c663955ea288a2292b40d27f232fbb980",
    "2c7e07d0cf42e5520bcbfe2f5ef63761a9ab9d7ccb00ea346195eae030f3b86f",
    "534f631fc42ae2d309670e01c7a0890e4bfb65bae798522ca14df09c81b09734",
    "104643385619adb848593eb668a8066d1f32650edf35e74b0fc3306cb6719448",
    "87ac990808239c768182a752f4f71cd98558397072883c7e137efb49d22b9231",
    "9b3e2f1c47d59a444e9b6dc725f0ac6baf160d22f3a9d399434e5e65b14eccb0",
    "fbe123066ae5add633a542f151663db4eb5a7053e388faadb40240671ae1b09b",
    "1dd07e92e20b3cb9208af040031f7cfc4efd46cc31ec27be20a1047965a42849",
    "2709bb9ed27353c1fd76b9240cab7576a44de68945e256ad44b2cb8d849a8060",
    "d0174db2c712573432a7869c1508f371f3a1058aeedddc1b53a7e04d7c56c725",
    "b4a16f724cddb8f77ddf3d2146a12c4be13d503885eaba3518a03da005009f62",
    "2aa706d75decbe57745e01d46f9f5d30a08dedaf3288cee14cc4948e3684e1d4",
    "ee49c5f6a5129ccaf2abebbc1d6d07a402a600af6221476b89aafaa683ca95b7",
    "bea1011c77874845e9b4c876ed2ceebd530d428dd4a564ad003d9211d40bb091",
    "f1e88ffc2b1de2aa4827002f06943ce5468735f7433f960bf01e75885b9f832b",
    "19247d017e002fb9143d1a89eb921222a94f8a3d0faaf2e05b0f594989edc4c4",
    "13f714ff62ee7d26b6d69ca980c141ebc54e9f71d2697083fe6c5efc1b02bd0f",
    "0c78cbb8246572f015fbdc53dc9798fa54d1119ec77c1f07ac310bcbcc40dbf8",
    "4bcde0ef92a6d24a2be7be50ac5e5299d776df2e6229ba5d475c2491da94f255",
    "0cfd7d1058502730cf0b2ffa880c78ef534651e06832b5d87c0d7eb84eac5b0c",
    "3a168f794d6e0c614429ad874317cc4cd67a8177214880ff6ea1704d29228c2f",
    "f9a555d817334397b402518d6fd959dc73d981ee7f5fe67969b63974ebbef127",
    "24b52691f66eaed4ce391a473902e309018257c98b9f02aaa33b399c9e6f3168",
    "a37b5e623dc26a180d9e2c9510d06885b014e86e533adb63ec40511e10b55046",
    "9dbaeb485e51d9e25a5621dc46e0bc0aaf51fb26be5acc4e370b96f62c469b80",
    "a6431d3d39f6c38c5df48405090752cab03bfdf5c77cf881b18a946807fba74a",
    "faa77e309f125373acf19855dd496fffe2f74962e545420844557a3adc7ebc11",
    "3523f52543ecfea2f78486dc91550fad0e6467d46d9d9c82ca63b2e0230bfa71",
    "a0583e358e42d77d18d1fd0533ff0a65615fc3b3112061ef92f168a00bf640c1",
    "42ae900888d5e5dde59c8e3d06e13db9e84ef05d27726d4b67fd00c50cd9406a",
    "154940777d3ff78f592ef02790131a59263c36b4958bbc836f9a767ea1a9f178",
    "6a0337de6ac75eecf748306e8ebc5bfe5c811a1481ae50f6956a9e7f26a679f5",
    "c99530c2148e09688d0b88795625943371183bf1f5d56c7446c6ed51ea133589",
    "626421dbe8ad6a0fd0d622d5dd3308a1cdc00b98575a41a91fe01a439e6f40bd",
    "b2f3a559f605a158cc395126c3cf394a7e92a53b7514c75157e1dc43a6c7f93e",
    "dffe06d1bea81f2a01c76786404bb867258f9e68013bf25454097ce935090738",
    "0860159ec7a2a51ce107c182a988c40b4bc2057a734354a1219b6c65e72640ed",
    "a405ff1bb51846b1867acc0b0da17f6f9616e592a0a7ff5ef3297c1ecfd60911",
    "a7d451924263284765f6343bca8a21b79b89ebfe611c7355dd88e0ec1c29e232",
    "41c758d08a4d3fe4d90645711589b832a2cd54dd25bd5b66e463e5d389a53aff",
    "a05c1a93a521fa5dbc1790cfbb808893453a428a65f2c6b2d51249fbb12db309",
    "90997920aa9786e10f513cfdd14e294feee6739cee1ab61b3fb1e3f42e7a915d",
    "99fcb9cb62c20a3135484a70bd3f73983f8f3b7b26266dad34f3993958a7642c",
    "e05f9a668b37e5f78bd3b9d047f29f92b33a87f11dd48390410006f858188b7b",
    "56dbc65895f7992da4a6985e7edba4d1c00879f1b28442c644c8a07658ceab27",
    "5e9004fe262b829563d0804656ba68b1de1690401f08a1915273230d8c902fc0",
    "1ea9ed3717523c5e304b7a7ac8058a87fb4f3fed8c6004769f226c9bb67e79c5",
    "f0f1a4c009b3f1b2729e89898e2f5c0fcdc312edea5df884a9c897cb90e4c566",
    "b5bb4ddf04863e6a60f33cb96c20dac8175d3bae55f335781503143c97a50e43",
    "f14cc97a20c6f627b4b78301352ae35463bc359362589cd178a06c0fa90850b7",
    "628801c8f614015c0fa0ccb2768cccc3e7b9d41ceed06071ce2534d31f7236d6",
    "3be1013c8f8da150e2195408093153b55b08b037fd92db8bb5e803f4c2538aae",
    "c9e1f8777685f54ba65c4e02915fd649ee1edcbf9c77ddf584b943d27efb86c3",
    "4274e92ed3bd02eb101baa5fb8ff7b96236830762d08273749fbb5166db8ab0b",
    "aa84c955bea04c7cee8f5bbbec97d25930fcaca363eed1b8cad37b931556d3e3",
    "d6a29c948677fb1f71aaf16debc3d071a4dd349458eb9e056dce3a000ff853da",
    "ba84bdb3d78367ca365016ac4bff9269576eb010f874c2967af73e0de5638de0",
    "1546c79951e3b541bc64d1957b565b7a2850fc87192c7b374aee6cfc69b9805e",
    "f119227d492ebe27fe9aae321980802454dfa64b2691efbe796c5075d5b07f62",
    "b8cf13d64818b32f96bbb585998b1bc9505f6a94055488e5a71fee9479c6f2a9",
    "1aaf459705b6afef2d7b83e3f181f1af55be0813daf55edce104cc59abc28ed7",
    "61ac185c8f520b5e3134953dc52ff292a40e1e96b088dab259558a9d240ec02f",
    "2da96e3154d7ec2329f787b73cb8a436b92d64cf3cc28e920d073279ea73b5f8",
    "1c4d72ce733b971b9ec4e24f37d733355f6f2ea635cc67ffb3e22748484df446",
    "2a6f89769f3272ac8c7a36a42a57627eca6b260ab2c76d8046a27d44d4034893",
    "f8d11df51a2cc113698ebf39a958fe81179d7d973d2044322771c0fe63f4d7c9",
    "f2287f17a4fa232dca5715c24a92f7112402a8101b9a7b276fb8c8f617376b90",
    "bb5ee510a4fda29cae30c97e7eee80569d3ec3598465f2d7e0674c395e0256e9",
    "647ab8c84365620d60f2523505d14bd230b5e650c96dee48be47770063ee7461",
    "34b06018fcc33ba6ebb01198d785b0629fbdc5d1948f688059158f053093f08b",
    "ff58b258dab0d7f36a2908e6c75229ce308d34806289c912a1a5f39a5aa71f9f",
    "232fc124803668a9f23b1c3bcb1134274303f5c0e1b0e27c9b6c7db59f0e2a4d",
    "27a0797cc5b042ba4c11e72a9555d13a67f00161550b32ede0511718b22dbc2c",
  ];

  const leaves = txHashes.map((v) => Buffer.from(v, "hex"));

  const tree = new MerkleTree(leaves, sha256, { isBitcoinTree: true });
  const root = Buffer.from(
    "871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a",
    "hex",
  );
  t.equal(tree.getRoot().toString("hex"), root.toString("hex"));

  for (let i = 0; i < leaves.length; i++) {
    const proof = tree.getProof(leaves[i]);
    t.true(tree.verify(proof, leaves[i], root), "proof verification for " + i);
  }
});

test("keccak256 - hex strings", (t) => {
  t.plan(1);
  const leaves = ["a", "b", "c"].map(keccak256);
  //** SWITCHED TO native sha256 (removed crypto-js support) **//
  const tree = new MerkleTree(leaves, sha256);
  const root =
    "311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae";
  t.equal(tree.getRoot().toString("hex"), root);
});

test("sha256 - no leaves", (t) => {
  t.plan(1);

  const leaves = [];
  const tree = new MerkleTree(leaves, sha256);

  const root = "";
  t.equal(tree.getRoot().toString("hex"), root);
});

test.skip("sha256 - 1,000,000 leaves", (t) => {
  t.plan(1);

  const values = [];
  for (let i = 0; i < 1e6; i++) {
    values.push(`${i}`);
  }

  const leaves = values.map(sha256);
  const tree = new MerkleTree(leaves, sha256);
  const root =
    "101dd357df60384d254330fe118e3046871767c2748ebd62ce031c117df483da";

  t.equal(tree.getRoot().toString("hex"), root);
});

test("sha256 getHexLeaves", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);
  t.deepEqual(tree.getHexLeaves(), [
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  ]);
});

//** REMOVED - removed crypto-js support **//
// test("crypto-js SHA3 leaves SHA256", (t) => {
//   t.plan(2);

//   const leaves = ["a", "b", "c", "d"].map(SHA3);
//   const tree = new MerkleTree(leaves, SHA256);
//   t.deepEqual(tree.getLeaves(), leaves.map(MerkleTree.bufferify));
//   const root = tree.getRoot();

//   const verifications = leaves.map((leaf) => {
//     const proof = tree.getProof(leaf);
//     return tree.verify(proof, leaf, root);
//   });

//   t.true(verifications.every(Boolean));
// });

//** REMOVED - removed crypto-js support **//
// test("crypto-js SHA3 1 leaf SHA256", (t) => {
//   t.plan(4);

//   const leaves = ["a"].map(SHA3);
//   const tree = new MerkleTree(leaves, SHA256);
//   t.deepEqual(tree.getLeaves(), leaves.map(MerkleTree.bufferify));
//   const root = tree.getRoot();

//   const leaf = leaves[0];
//   const proof = tree.getProof(leaf);
//   t.equal(proof.length, 0);
//   t.equal(MerkleTree.bufferify(leaf).toString("hex"), root.toString("hex"));
//   t.true(tree.verify(proof, leaf, root));
// });

//** REMOVED - removed crypto-js support **//
// test("crypto-js bufferify", (t) => {
//   t.plan(1);

//   const leaves = ["a", "b", "c", "d"].map(SHA3);

//   const bufferifyCryptoJS = (v) =>
//     Buffer.from(v.toString(CryptoJS.enc.Hex), "hex");

//   t.deepEqual(leaves.map(MerkleTree.bufferify), leaves.map(bufferifyCryptoJS));
// });

test("bufferify", (t) => {
  t.plan(1);

  t.deepEqual(MerkleTree.bufferify("0x1234"), Buffer.from("1234", "hex"));
});

test("isHexString", (t) => {
  t.plan(1);

  t.deepEqual(MerkleTree.isHexString("0x1234"), true);
});

test("sha1", (t) => {
  t.plan(2);

  const leaves = [
    "d89f84d948796605a413e196f40bce1d6294175d",
    "32f04c7f572bf75a266268c6f4d8c92731dc3b7f",
    "b80b52d80f5fe940ac2c987044bc439e4218ac94",
    "1553c75a1d637961827f4904a0955e57915d8310",
  ];

  const tree = new MerkleTree(leaves, sha1, {
    sortLeaves: true,
    sortPairs: true,
  });

  const root = tree.getHexRoot();
  const leaf = "d89f84d948796605a413e196f40bce1d6294175d";
  const proof = tree.getHexProof(leaf);

  t.deepEqual(proof, [
    "0xb80b52d80f5fe940ac2c987044bc439e4218ac94",
    "0x59f544ee5de8d761b124ccd4e1285d3b02a2a539",
  ]);

  t.true(tree.verify(proof, leaf, root));
});

test("sha56 getHexLayers", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);
  const layers = tree.getHexLayers();

  t.deepEqual(layers, [
    [
      "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
      "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
      "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    ],
    [
      "0x176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1",
      "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    ],
    ["0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae"],
  ]);
});

test("getLayersAsObject", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);
  const obj = tree.getLayersAsObject();

  t.deepEqual(obj, {
    "311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae": {
      "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2": {
        "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2":
          null,
      },
      "176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1": {
        "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb":
          null,
        b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510: null,
      },
    },
  });
});

test("getLayersAsObject with duplicate odd option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256, { duplicateOdd: true });
  const obj = tree.getLayersAsObject();

  t.deepEqual(obj, {
    bcdd0f60308db788712205115fe4273bfda49fa0925611fee765a63df9ab96a1: {
      "176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1": {
        "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb":
          null,
        b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510: null,
      },
      "43e061172b1177f25d0f156b2d2ed11728006fade8e167ff3d1b9dbc979a3358": {
        "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2":
          null,
      },
    },
  });
});

test("sha256 getHexLayersFlat", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);
  const layers = tree.getHexLayersFlat();
  t.deepEqual(layers, [
    "0x00",
    "0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae",
    "0x176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  ]);
});

test("print", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);

  t.equal(
    tree.toString(),
    `└─ 311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae
   ├─ 176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1
   │  ├─ 3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb
   │  └─ b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510
   └─ 0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2
      └─ 0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2
`,
  );
});

test("print with duplicate odd option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256, { duplicateOdd: true });

  t.equal(
    tree.toString(),
    `└─ bcdd0f60308db788712205115fe4273bfda49fa0925611fee765a63df9ab96a1
   ├─ 176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1
   │  ├─ 3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb
   │  └─ b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510
   └─ 43e061172b1177f25d0f156b2d2ed11728006fade8e167ff3d1b9dbc979a3358
      └─ 0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2
`,
  );
});

test("sha256 getMultiProof + verifyMultiProof", (t) => {
  t.plan(3);

  const leaves = Array(16)
    .fill(0)
    .map((x, i) => {
      const b = Buffer.alloc(32);
      b.writeUIntLE(i, 31, 1);
      return b;
    });

  const tree = new MerkleTree(leaves, sha256);

  const root = tree.getHexRoot();
  t.equal(
    root,
    "0xc1ebc5b83154907160d73863bdae7eb86fe1888495a83cb8daadb1603b8aeaf5",
  );

  const n = 100;
  const proofIndices = Array(16)
    .fill(0)
    .map((x, j) => j)
    .filter((j) => (n >> j) % 2 === 1);

  const proof = tree.getMultiProof(proofIndices);

  t.deepEqual(
    proof.map((v) => v.toString("hex")),
    [
      "0000000000000000000000000000000000000000000000000000000000000007",
      "0000000000000000000000000000000000000000000000000000000000000004",
      "0000000000000000000000000000000000000000000000000000000000000003",
      "90f4b39548df55ad6187a1d20d731ecee78c545b94afd16f42ef7592d99cd365",
      "6b41dc65d0df2bb4b8c2f1fe48e85b7ba8f9b876113ec410fe612bae61a19eaf",
    ],
  );

  const proofLeaves = proofIndices.map((i) => leaves[i]);
  t.true(
    tree.verifyMultiProof(
      root,
      proofIndices,
      proofLeaves,
      leaves.length,
      proof,
    ),
  );
});

test("keccak256 verifyMultiProofWithFlags", (t) => {
  t.plan(4);

  const leaves = ["a", "b", "c", "d", "e", "f"]
    .map(keccak256)
    .sort(Buffer.compare);

  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  t.equal(
    root,
    "0x1b404f199ea828ec5771fb30139c222d8417a82175fefad5cd42bc3a189bd8d5",
  );

  const proofLeaves = [keccak256("b"), keccak256("d"), keccak256("f")].sort(
    Buffer.compare,
  );
  t.deepEqual(
    proofLeaves.map((v) => v.toString("hex")),
    [
      "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
      "d1e8aeb79500496ef3dc2e57ba746a8315d048b7a664a2bf948db4fa91960483",
      "f1918e8562236eb17adc8502332f4c9c82bc14e19bfc0aa10ab674ff75b3d2f3",
    ],
  );

  const proof = tree.getMultiProof(proofLeaves);
  t.deepEqual(
    proof.map((v) => v.toString("hex")),
    [
      "a8982c89d80987fb9a510e25981ee9170206be21af3c8e0eb312ef1d3382e761",
      "7dea550f679f3caab547cbbc5ee1a4c978c8c039b572ba00af1baa6481b88360",
    ],
  );
  const proofFlags = tree.getProofFlags(proofLeaves, proof);
  t.true(tree.verifyMultiProofWithFlags(root, proofLeaves, proof, proofFlags));
});

test("keccak256 getMultiProof uneven tree", (t) => {
  t.plan(3);

  const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree = new MerkleTree(leaves, sha256);
  const root = tree.getRoot();
  t.equal(
    root.toString("hex"),
    "1f7379539707bcaea00564168d1d4d626b09b73f8a2a365234c62d763f854da2",
  );
  const indicesToProve = [3, 4];
  const leavesToProve = indicesToProve.map((index) => leaves[index]);
  const proof = tree.getMultiProof(indicesToProve);
  t.deepEqual(
    proof.map((v) => v.toString("hex")),
    [
      "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
      "252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111",
      "e5a01fee14e0ed5c48714f22180f25ad8365b53f9779f79dc4a3d7e93963f94a",
    ],
  );
  t.true(
    tree.verifyMultiProof(
      root,
      indicesToProve,
      leavesToProve,
      leaves.length,
      proof,
    ),
  );
});

test("sha256 getMultiProof with pairs sorted", (t) => {
  t.plan(1);

  const leaves = Array(16)
    .fill(0)
    .map((x, i) => {
      const b = Buffer.alloc(32);
      b.writeUIntLE(i, 31, 1);
      return b;
    });

  const tree = new MerkleTree(leaves, sha256, { sortPairs: true });
  const root = tree.getHexRoot();

  const n = 100;
  const proofIndices = Array(16)
    .fill(0)
    .map((x, j) => j)
    .filter((j) => (n >> j) % 2 === 1);

  const proof = tree.getMultiProof(proofIndices);
  const proofLeaves = proofIndices.map((i) => leaves[i]);

  t.true(
    tree.verifyMultiProof(
      root,
      proofIndices,
      proofLeaves,
      leaves.length,
      proof,
    ),
  );
});

test("sha256 getMultiProof using tree array", (t) => {
  t.plan(5);

  const leaves = Array(16)
    .fill(0)
    .map((x, i) => {
      const b = Buffer.alloc(32);
      b.writeUIntLE(i, 31, 1);
      return b;
    });

  const tree = new MerkleTree(leaves, sha256);

  const root = tree.getHexRoot();
  t.equal(
    root,
    "0xc1ebc5b83154907160d73863bdae7eb86fe1888495a83cb8daadb1603b8aeaf5",
  );

  const treeFlat = tree.getLayersFlat();

  t.deepEqual(
    treeFlat.map((v) => v.toString("hex")),
    [
      "00",
      "c1ebc5b83154907160d73863bdae7eb86fe1888495a83cb8daadb1603b8aeaf5",
      "32e0fe0539aeca5782542f7232d32185eebec2e6dc258177456dcdebbbf18f8b",
      "6b41dc65d0df2bb4b8c2f1fe48e85b7ba8f9b876113ec410fe612bae61a19eaf",
      "d1d79b01cacccaa40e6a3825db8ff96f38858092ea71689ce31dc6df3cf31df2",
      "564ad5882547f199bbe82f40f4e5ddbd3836859c2e5caf3ff5b0989caf614af0",
      "5ef82769b7a6ea72894663fd3ed0736e7084beb596edeac229d4ae598d19aa2b",
      "446c09a38396a1f51846548cc4a87bddd73bdcce9cf86c65f9ac6c153a92a562",
      "90f4b39548df55ad6187a1d20d731ecee78c545b94afd16f42ef7592d99cd365",
      "a774c351cf3882b36b2c541586b0b59c6dfd119ae831ef3c6b2e269f7a6be220",
      "b023893dc819559da606f81778f566532801f428570db5fd3d3088491bb292c2",
      "277752261a13c9c81c37ea894efe5dc3af8b7ffecbedce75d0ec09862e74a2cb",
      "4c1f763d4f27669f41e511f15268e6396a66f7750c6128d68210a1dfbeb0cbc3",
      "856b7aa12bb3a7fb591ac8cfb8051bb89c4b57cb7faf852fdc5d226076423d04",
      "719cf2e4468492fde20372b704eca4a67397bba60d7513bb08f199887636027f",
      "cec448f4862209fa531a43a65ec850a6327f02f518ef55f4d347510a5cf5d1cf",
      "0000000000000000000000000000000000000000000000000000000000000000",
      "0000000000000000000000000000000000000000000000000000000000000001",
      "0000000000000000000000000000000000000000000000000000000000000002",
      "0000000000000000000000000000000000000000000000000000000000000003",
      "0000000000000000000000000000000000000000000000000000000000000004",
      "0000000000000000000000000000000000000000000000000000000000000005",
      "0000000000000000000000000000000000000000000000000000000000000006",
      "0000000000000000000000000000000000000000000000000000000000000007",
      "0000000000000000000000000000000000000000000000000000000000000008",
      "0000000000000000000000000000000000000000000000000000000000000009",
      "000000000000000000000000000000000000000000000000000000000000000a",
      "000000000000000000000000000000000000000000000000000000000000000b",
      "000000000000000000000000000000000000000000000000000000000000000c",
      "000000000000000000000000000000000000000000000000000000000000000d",
      "000000000000000000000000000000000000000000000000000000000000000e",
      "000000000000000000000000000000000000000000000000000000000000000f",
    ],
  );

  const proofIndices = [2, 5, 6];
  const proof = tree.getMultiProof(treeFlat, proofIndices);

  t.deepEqual(
    proof.map((v) => v.toString("hex")),
    [
      "0000000000000000000000000000000000000000000000000000000000000007",
      "0000000000000000000000000000000000000000000000000000000000000004",
      "0000000000000000000000000000000000000000000000000000000000000003",
      "90f4b39548df55ad6187a1d20d731ecee78c545b94afd16f42ef7592d99cd365",
      "6b41dc65d0df2bb4b8c2f1fe48e85b7ba8f9b876113ec410fe612bae61a19eaf",
    ],
  );

  const depth = tree.getDepth();
  t.equal(depth, Math.ceil(Math.log2(treeFlat.length / 2)));

  const treeRoot = treeFlat[1];
  const proofLeaves = proofIndices.map((i) => leaves[i]);
  t.true(
    tree.verifyMultiProof(
      treeRoot,
      proofIndices,
      proofLeaves,
      leaves.length,
      proof,
    ),
  );
});

test("sha256 getMultiProof", (t) => {
  t.plan(3);

  const leaves = Array(16)
    .fill(0)
    .map((x, i) => {
      const b = Buffer.alloc(32);
      b.writeUIntLE(i, 31, 1);
      return b;
    });

  const tree = new MerkleTree(leaves, sha256, {
    sortPairs: true,
    singleOdd: true,
  });

  const root = tree.getHexRoot();
  t.equal(
    root,
    "0xc336787ec1a678cbbb3391bd0146e0c11e62dac39f84fe9a404a882094c00273",
  );

  const treeFlat = tree.getLayersFlat();

  const proofIndices = [0, 1];
  const proof = tree.getMultiProof(treeFlat, proofIndices);
  const proofLeaves = proofIndices.map((i) => leaves[i]);

  t.deepEqual(
    proof.map((v) => v.toString("hex")),
    [
      "a774c351cf3882b36b2c541586b0b59c6dfd119ae831ef3c6b2e269f7a6be220",
      "de44f8fbe261b8ed52c606670f9c73e428a997908df7452806d6123829d50adc",
      "44f76d663f391971ba8bd22469061c70aa63c176bc29b651336db7587b6f5a6c",
    ],
  );

  const proofFlags = tree.getProofFlags(proofLeaves, proof);
  t.deepEqual(proofFlags, [true, false, false, false]);
});

test("sha256 getProofFlag with indices", (t) => {
  t.plan(3);

  const leaves = ["a", "b", "c", "d"].map(sha256);
  const tree = new MerkleTree(leaves, sha256, { sortPairs: true });
  const root = tree.getHexRoot();
  t.equal(
    root,
    "0x4c6aae040ffada3d02598207b8485fcbe161c03f4cb3f660e4d341e7496ff3b2",
  );

  const proofIndices = [2, 1];
  const proof = tree.getMultiProof(proofIndices);
  const proofFlags = tree.getProofFlags(proofIndices, proof);
  t.deepEqual(proofFlags, [false, false, true]);
  t.ok(
    tree.verifyMultiProofWithFlags(
      root,
      proofIndices.map((i) => leaves[i]),
      proof,
      proofFlags,
    ),
  );
});

test("sha256 getMultiProof - statusim", (t) => {
  t.plan(5);

  const elements = ["a", "b", "c", "d", "e", "f"].map((v) => Buffer.from(v));

  const tree = new MerkleTree(elements, keccak256, {
    hashLeaves: true,
    sortLeaves: true,
    sortPairs: true,
  });

  t.equal(
    tree.getHexRoot(),
    "0x1b404f199ea828ec5771fb30139c222d8417a82175fefad5cd42bc3a189bd8d5",
  );
  t.deepEqual(tree.getHexLeaves(), [
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xa8982c89d80987fb9a510e25981ee9170206be21af3c8e0eb312ef1d3382e761",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0xd1e8aeb79500496ef3dc2e57ba746a8315d048b7a664a2bf948db4fa91960483",
    "0xf1918e8562236eb17adc8502332f4c9c82bc14e19bfc0aa10ab674ff75b3d2f3",
  ]);

  const leaves = tree.getLeaves(["d", "a"].map((v) => Buffer.from(v)));
  const proof = tree.getMultiProof(leaves);
  const proofFlags = tree.getProofFlags(leaves, proof);

  t.deepEqual(
    leaves.map((v) => v.toString("hex")),
    [
      "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
      "f1918e8562236eb17adc8502332f4c9c82bc14e19bfc0aa10ab674ff75b3d2f3",
    ],
  );
  t.deepEqual(tree.getHexMultiProof(leaves), [
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
    "0xd1e8aeb79500496ef3dc2e57ba746a8315d048b7a664a2bf948db4fa91960483",
    "0x434d51cfeb80272378f4c3a8fd2824561c2cad9fce556ea600d46f20550976a6",
  ]);
  t.deepEqual(proofFlags, [false, false, false, true]);
});

test("marshal leaves", (t) => {
  t.plan(5);

  const leaves = ["a", "b", "c"].map(keccak256);
  const jsonLeaves = MerkleTree.marshalLeaves(leaves);
  t.equal(typeof jsonLeaves, "string");

  const parsed = JSON.parse(jsonLeaves);
  t.equal(parsed.length, 3);
  t.equal(
    parsed[0],
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
  );
  t.equal(
    parsed[1],
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
  );
  t.equal(
    parsed[2],
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  );
});

test("unmarshal leaves", (t) => {
  t.plan(4);

  const json = `[
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2"
  ]`;

  const leaves = MerkleTree.unmarshalLeaves(json);
  t.equal(leaves.length, 3);
  t.equal(
    leaves[0].toString("hex"),
    "3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
  );
  t.equal(
    leaves[1].toString("hex"),
    "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
  );
  t.equal(
    leaves[2].toString("hex"),
    "0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  );
});

//** REMOVED functinality **//
// test("marshal proof", (t) => {
//   t.plan(5);

//   const leaves = ["a", "b", "c"].map(keccak256);
//   const tree = new MerkleTree(leaves, sha256, { duplicateOdd: true });
//   const proof = tree.getProof(leaves[0]);

//   const jsonProof = MerkleTree.marshalProof(proof);
//   t.equal(typeof jsonProof, "string");

//   const parsed = JSON.parse(jsonProof);
//   t.equal(parsed.length, 2);
//   t.equal(
//     parsed[0].data,
//     "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
//   );
//   t.equal(
//     parsed[1].data,
//     "0x43e061172b1177f25d0f156b2d2ed11728006fade8e167ff3d1b9dbc979a3358",
//   );

//   t.true(tree.verify(parsed, leaves[0], tree.getRoot()));
// });

//** REMOVED functinality **//
// test("unmarshal proof", (t) => {
//   t.plan(3);

//   const json = `[
//     {
//       "position": "right",
//       "data": "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"
//     },
//     {
//       "position": "right",
//       "data": "0x43e061172b1177f25d0f156b2d2ed11728006fade8e167ff3d1b9dbc979a3358"
//     }
//   ]`;

//   const proof = MerkleTree.unmarshalProof(json);

//   t.equal(proof.length, 2);
//   t.equal(
//     proof[0].data.toString("hex"),
//     "b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
//   );
//   t.equal(
//     proof[1].data.toString("hex"),
//     "43e061172b1177f25d0f156b2d2ed11728006fade8e167ff3d1b9dbc979a3358",
//   );
// });

//** REMOVED functinality **//
// test("marshal tree", (t) => {
//   t.plan(7);

//   const leaves = ["a", "b", "c"].map(keccak256);
//   const tree = new MerkleTree(leaves, keccak256, { sort: true });
//   const jsonTree = MerkleTree.marshalTree(tree);
//   t.equal(typeof jsonTree, "string");

//   const parsed = JSON.parse(jsonTree);
//   t.deepEqual(parsed.options, {
//     complete: false,
//     isBitcoinTree: false,
//     hashLeaves: false,
//     sortLeaves: true,
//     sortPairs: true,
//     sort: true,
//     fillDefaultHash: null,
//     duplicateOdd: false,
//   });
//   t.equal(
//     parsed.root,
//     "0xc3b537cc8a2c6dcb3657718e1f3505ff751ff8c2eba2a70460df2cbee2b1413a",
//   );
//   t.equal(parsed.leaves.length, 3);
//   t.deepEqual(parsed.leaves, [
//     "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
//     "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
//     "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
//   ]);
//   t.equal(parsed.layers.length, 3);
//   t.deepEqual(parsed.layers, [
//     [
//       "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
//       "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
//       "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
//     ],
//     [
//       "0x7dea550f679f3caab547cbbc5ee1a4c978c8c039b572ba00af1baa6481b88360",
//       "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
//     ],
//     ["0xc3b537cc8a2c6dcb3657718e1f3505ff751ff8c2eba2a70460df2cbee2b1413a"],
//   ]);
// });

//** REMOVED functinality **//
// test("unmarshal tree", (t) => {
//   t.plan(4);

//   const json = `{
//     "options": {
//       "complete": false,
//       "isBitcoinTree": false,
//       "hashLeaves": false,
//       "sortLeaves": true,
//       "sortPairs": true,
//       "sort": true,
//       "fillDefaultHash": null,
//       "duplicateOdd": false
//     },
//     "root": "0xc3b537cc8a2c6dcb3657718e1f3505ff751ff8c2eba2a70460df2cbee2b1413a",
//     "layers": [
//       [
//         "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
//         "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
//         "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"
//       ],
//       [
//         "0x7dea550f679f3caab547cbbc5ee1a4c978c8c039b572ba00af1baa6481b88360",
//         "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"
//       ],
//       [
//         "0xc3b537cc8a2c6dcb3657718e1f3505ff751ff8c2eba2a70460df2cbee2b1413a"
//       ]
//     ],
//     "leaves": [
//       "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
//       "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
//       "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510"
//     ]
//   }`;

//   const parsed = JSON.parse(json);
//   const tree = MerkleTree.unmarshalTree(json, keccak256);

//   t.equal(tree.getHexRoot(), parsed.root);
//   t.deepEqual(tree.getOptions(), parsed.options);
//   t.deepEqual(tree.getHexLeaves(), parsed.leaves);
//   t.deepEqual(tree.getHexLayers(), parsed.layers);
// });

test("getOptions", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f"].map(sha256);
  const tree = new MerkleTree(leaves, sha256, {
    sortPairs: true,
    sortLeaves: true,
  });

  t.deepEqual(tree.getOptions(), {
    complete: false,
    isBitcoinTree: false,
    hashLeaves: false,
    sortLeaves: true,
    sortPairs: true,
    sort: false,
    fillDefaultHash: null,
    duplicateOdd: false,
  });
});

test("fillDefaultHashes", (t) => {
  t.plan(1);

  const leaves = [...Array(9)].map((x, i) => {
    return keccak256(Buffer.from([i]));
  });

  const tree = new MerkleTree(leaves, keccak256, {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fillDefaultHash: (idx, hashFn) => {
      return keccak256(Buffer.alloc(32));
    },
  });

  t.equal(
    tree.getHexRoot(),
    "0x11f470d712bb3a84f0b01cb7c73493ec7d06eda480f567c99b9a6dc773679a72",
  );
});

test("getLeafIndex", (t) => {
  t.plan(5);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);

  t.equal(
    tree.getHexRoot(),
    "0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae",
  );
  t.equal(tree.getLeafIndex(leaves[1]), 1);
  t.equal(tree.getLeafIndex(keccak256(Buffer.from("b"))), 1);
  t.equal(tree.getLeafIndex(leaves[2]), 2);
  t.equal(tree.getLeafIndex(Buffer.from("invalid")), -1);
});

test("getleafCount", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);

  t.equal(tree.getLeafCount(), 3);
});

test("getleaf", (t) => {
  t.plan(5);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);

  t.deepEqual(tree.getLeaf(-1), Buffer.from([]));
  t.deepEqual(tree.getLeaf(0), leaves[0]);
  t.deepEqual(tree.getLeaf(1), leaves[1]);
  t.deepEqual(tree.getLeaf(2), leaves[2]);
  t.deepEqual(tree.getLeaf(3), Buffer.from([]));
});

test("addLeaf", (t) => {
  t.plan(2);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree([], sha256);
  tree.addLeaf(leaves[0]);
  tree.addLeaf(leaves[1]);
  tree.addLeaf(leaves[2]);

  t.equal(
    tree.getHexRoot(),
    "0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae",
  );
  t.deepEqual(tree.getHexLeaves(), [
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  ]);
});

test("addLeaves", (t) => {
  t.plan(3);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree([], sha256);
  tree.addLeaves(leaves);

  t.equal(
    tree.getHexRoot(),
    "0x311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae",
  );
  t.deepEqual(tree.getHexLeaves(), [
    "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb",
    "0xb5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510",
    "0x0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2",
  ]);

  const moreLeaves = ["d", "e", "f"].map(keccak256);
  tree.addLeaves(moreLeaves);
  t.equal(
    tree.getHexRoot(),
    "0xb9a721d82428976e0d500f97646bf273ec1dd9c2104b9328873a94fc3897aec6",
  );
});

test("resetTree", (t) => {
  t.plan(2);

  const leaves = ["a", "b", "c"].map(keccak256);
  const tree = new MerkleTree(leaves, sha256);

  t.equal(tree.getLeafCount(), 3);

  tree.resetTree();

  t.equal(tree.getLeafCount(), 0);
});

test("ethereum-cryptography/keccak256", (t) => {
  t.plan(2);

  const expectedRoot =
    "0xaff1208e69c9e8be9b584b07ebac4e48a1ee9d15ce3afe20b77a4d29e4175aa3";

  const leaves = ["a", "b", "c"].map((v) => Buffer.from(v));
  const hashedLeaves = leaves.map(ethCryptoKeccak256);
  const tree1 = new MerkleTree(hashedLeaves, ethCryptoKeccak256);
  t.equal(tree1.getHexRoot(), expectedRoot);

  const tree2 = new MerkleTree(leaves, ethCryptoKeccak256, {
    hashLeaves: true,
  });
  t.equal(tree2.getHexRoot(), expectedRoot);
});

test("keccak256 with complete option", (t) => {
  t.plan(1);

  const leaves = ["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((v) =>
    keccak256(Buffer.from(v)),
  );
  const tree = new MerkleTree(leaves, keccak256, { complete: true });

  const root =
    "581ddb9a48c5ec60fd5a0023d4673e2b33c256f8886342bef35a8eebeda51b44";

  t.equal(tree.getRoot().toString("hex"), root);
});

test("complete option with incompatible options", (t) => {
  t.plan(2);

  const leaves = ["a", "b", "c"].map((v) => keccak256(Buffer.from(v)));
  t.throws(
    () =>
      new MerkleTree(leaves, keccak256, {
        complete: true,
        isBitcoinTree: true,
      }),
    /option "complete" is incompatible with "isBitcoinTree"/,
  );
  t.throws(
    () =>
      new MerkleTree(leaves, keccak256, { complete: true, duplicateOdd: true }),
    /option "complete" is incompatible with "duplicateOdd"/,
  );
});

test("simple bad proof", (t) => {
  t.plan(2);

  const leaves = ["d", "e", "f"];
  //** CHANGE - have to explicitly pass hash fn **//
  const tree = new MerkleTree(leaves, sha256);

  const proof = tree.getHexProof(leaves[0]);
  t.equal(proof.length, 1);
  t.equal(
    proof[0],
    "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  );
});

test.skip("1M leaves keccak256", (t) => {
  t.plan(3);

  const leaves = [];
  const max = 1000000;
  for (let i = 0; i < max; i++) {
    leaves.push(keccak256(`${i}`));
  }

  console.time("1MLeavesConstructor");
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  console.timeEnd("1MLeavesConstructor");

  console.time("1MLeavesProof");
  const proof = tree.getHexProof(keccak256(`${max - 1}`));
  console.timeEnd("1MLeavesProof");
  t.equal(tree.getLeafCount(), max);
  t.true(tree.verify(proof, keccak256(`${max - 1}`), tree.getRoot()));
  t.false(tree.verify(proof, keccak256(`${max + 1}`), tree.getRoot()));
});

test("poseidon hash", async (t) => {
  t.plan(4);

  const poseidon = await buildPoseidon();
  const poseidonHash = (inputs) => {
    const hash = poseidon(inputs.map(MerkleTree.bigNumberify));
    const bn = MerkleTree.bigNumberify(poseidon.F.toString(hash));
    return MerkleTree.bufferify(bn);
  };

  const result1 = poseidonHash([1, 2]);
  t.equal(
    result1.toString("hex"),
    "115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a",
  );

  const result2 = poseidonHash([1, 2, 3, 4]);
  t.equal(
    result2.toString("hex"),
    "299c867db6c1fdd79dcefa40e4510b9837e60ebb1ce0663dbaa525df65250465",
  );

  const leaves = [1, 2, 3, 4].map((x) => poseidonHash([x]));
  const tree = new MerkleTree(leaves, poseidonHash, {
    concatenator: (hashes) => hashes,
  });
  t.equal(
    tree.getHexRoot(),
    "0xd24e045226875e22b37ce607ea2af7a9fbb137ee128caa0ce3663615350245",
  );

  const proof = tree.getProof(leaves[2]);
  t.true(tree.verify(proof, leaves[2], tree.getHexRoot()));
});
