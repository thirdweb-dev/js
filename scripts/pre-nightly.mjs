import fs from "node:fs";
// load the changesets config file
const changesetsConfig = JSON.parse(
  fs.readFileSync("./.changeset/config.json", "utf8"),
);
// enable useCalculatedVersion in the snapshot configuration
const nightlyChangesetsConfig = {
  ...changesetsConfig,
  snapshot: { ...changesetsConfig.snapshot, useCalculatedVersion: true },
};

// write it back to the file
fs.writeFileSync(
  "./.changeset/config.json",
  JSON.stringify(nightlyChangesetsConfig, null, 2),
);
