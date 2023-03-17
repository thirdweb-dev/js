// @ts-check
import getReleasePlanPkg from "@changesets/get-release-plan";
import parsePkg from "@changesets/parse";
import fs from "node:fs";
import path from "node:path";

/** @typedef { import("@changesets/get-release-plan").default } getReleasePlan */
/** @typedef { import("@changesets/parse").default } parse */

/** @type {getReleasePlan} */
// @ts-ignore
const getReleasePlan = getReleasePlanPkg.default;

/** @type {parse} */
// @ts-ignore
const parse = parsePkg.default;

const releasePlan = await getReleasePlan(".");

// a utility function to load the changeset given a changeset file name (e.g. "changeset-1.md")
const loadChangeset = (/** @type {string} */ changesetName) => {
  const changesetPath = path.join(".", ".changeset", changesetName + ".md");
  const changesetContents = fs.readFileSync(changesetPath, "utf8");
  const parsed = parse(changesetContents);
  return parsed;
};

// rename a given changeset file to a .xd extension so that it is ignored by changesets
const ignoreChangeset = (/** @type {string} */ changesetName) => {
  const changesetPath = path.join(".", ".changeset", changesetName + ".md");
  const ignoredChangesetPath = path.join(
    ".",
    ".changeset",
    changesetName + ".xd",
  );

  try {
    fs.renameSync(changesetPath, ignoredChangesetPath);
  } catch (e) {
    // noop
  }
};

// rename a given changeset file to a .md extension so that it is no longer ignored by changesets
const unignoreChangeset = (/** @type {string} */ changesetName) => {
  const ignoredChangesetPath = path.join(
    ".",
    ".changeset",
    changesetName + ".xd",
  );
  const changesetPath = path.join(".", ".changeset", changesetName + ".md");
  try {
    fs.renameSync(ignoredChangesetPath, changesetPath);
  } catch (e) {
    // noop
  }
};

// function to look at all files in the .changeset directory and rename any files that are .xd files back to .md files
const unignoreAllChangesets = () => {
  const changesetDir = path.join(".", ".changeset");
  const changesetFiles = fs.readdirSync(changesetDir);
  for (const changesetFile of changesetFiles) {
    if (changesetFile.endsWith(".xd")) {
      unignoreChangeset(changesetFile.replace(".xd", ""));
    }
  }
};

async function findMajorChangesetForPackage(
  /** @type {string} */ pkgName,
  /** @type {string[]} */ ignoredChangesets = [],
) {
  // load the current release plan

  // ignore the changesets that were ignored
  for (const changesetName of ignoredChangesets) {
    ignoreChangeset(changesetName);
  }

  const releasePlan = await getReleasePlan(".");

  // find the release plan entry for the given package
  const releasePlanEntry = releasePlan.releases.find(
    (release) => release.name === pkgName,
  );

  if (!releasePlanEntry) {
    unignoreAllChangesets();
    throw new Error("could not find release plan entry for " + pkgName);
  }

  let changesetsToCheck = releasePlan.changesets;
  // ignore changesets that are part of the package's release plan first
  if (releasePlanEntry) {
    changesetsToCheck = changesetsToCheck.filter(
      (changeset) => !releasePlanEntry.changesets.includes(changeset.id),
    );
  }
  // if there a re no *other* changesets to check then fall back to trying *all* changesets
  if (changesetsToCheck.length === 0) {
    // try all (other) changesets
    changesetsToCheck = releasePlan.changesets;
  }

  if (!changesetsToCheck.length) {
    // unignore the changesets that were ignored

    unignoreAllChangesets();
    throw new Error("no changesets to check");
  }

  // check if the release plan entry is not a major release
  if (releasePlanEntry.type === "major") {
    // recurse to find the changeset that caused the major release
    return await findMajorChangesetForPackage(
      pkgName,
      ignoredChangesets.concat(changesetsToCheck[0].id),
    );
  }

  // unignore the changesets that were ignored
  unignoreAllChangesets();

  // otherwise return the changeset that caused the release
  // it will have to be the last one in the list of ignored changesets

  return ignoredChangesets.at(-1);
}

// find all releases that have major versions
const majorReleases = releasePlan.releases.filter(
  (release) => release.type === "major",
);

const majorReleaseNames = majorReleases.map((release) => release.name);

if (!majorReleaseNames.length) {
  console.log();
  console.log("No major releases found");
  console.log();
}

for (const majorReleaseName of majorReleaseNames) {
  let changesetName;

  console.log("Checking:", majorReleaseName);
  try {
    changesetName = await findMajorChangesetForPackage(majorReleaseName);
    console.log(`Changeset causing major version: ${changesetName}`);
    console.log();
    const changeset = loadChangeset(changesetName);
    console.log(changeset.summary);
    console.log();
  } catch (err) {
    console.error(
      "failed to find major bump changeset for " + majorReleaseName,
    );
  }
  console.log();
}
