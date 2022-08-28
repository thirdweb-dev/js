const fs = require("fs");

const existingPackageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const newPackageJson = { ...existingPackageJson, name: "thirdweb" };

fs.writeFileSync("package.json", JSON.stringify(newPackageJson, null, 2));

fs.writeFileSync(
  "README.md",
  `# thirdweb cli

  This is a proxied package of the \`@thirdweb-dev/cli\` for convenient usage with \`npx thirdweb\`.
  
  You can find the actual package [here](https://www.npmjs.com/package/@thirdweb-dev/cli).
  `
);
