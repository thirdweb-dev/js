import * as fs from "node:fs";
import * as path from "node:path";

const filesToIgnore = new Set([
  // favicons
  "public/favicon-32x32.png",
  "public/favicon-16x16.png",
  "public/apple-touch-icon.png",
  "public/android-chrome-192x192.png",
  "public/android-chrome-512x512.png",
  // .well-known
  "public/.well-known/apple-app-site-association",
  "public/.well-known/apple-developer-merchantid-domain-association",
  "public/.well-known/assetlinks.json",
  // sitemap and robots
  "public/sitemap-0.xml",
  "public/sitemap.xml",
  "public/robots.txt",
  // not deleting just in case someone is using this outside thirdweb for adding a logo
  "public/brand/thirdweb-logo-full.svg",
  "public/brand/thirdweb-brand-dark.png",
  "public/brand/thirdweb-logo-square.png",
  "public/brand/thirdweb-grey.png",
  "public/brand/thirdweb-icon.png",
  "public/brand/thirdweb-wordmark.svg",
  // macOS stuff
  "public/assets/product-pages/.DS_Store",
  "public/assets/.DS_Store",
  // pdfs
  "public/Thirdweb_Terms_of_Service.pdf",
  "public/thirdweb_Privacy_Policy_May_2022.pdf",
]);

function getAllFilesInFolder(folderPath: string) {
  const files: Array<{ fullPath: string; name: string }> = [];
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const subFileNames = getAllFilesInFolder(fullPath);
      for (const subFileName of subFileNames) {
        files.push(subFileName);
      }
    } else {
      files.push({
        fullPath,
        name: item,
      });
    }
  }

  return files.filter((file) => !filesToIgnore.has(file.fullPath));
}

function folderVisitor(
  folderPath: string,
  handleFileContent: (content: string) => void,
) {
  const folderItems = fs.readdirSync(folderPath);

  for (const item of folderItems) {
    const fullPath = path.join(folderPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (folderVisitor(fullPath, handleFileContent)) {
        return true;
      }
    } else {
      console.log("checking:", fullPath);
      const content = fs.readFileSync(fullPath, "utf-8");
      handleFileContent(content);
    }
  }
}

/**
 * Get file names from `assetsFolder` that do not appear in any files in `srcFolder`.
 * @param assetsFolder - The folder containing asset files.
 * @param srcFolder - The source folder to search for file name occurrences.
 * @returns An array of unused file names.
 */
function main(params: { assetsFolder: string; srcFolder: string }) {
  const assetFileNames = getAllFilesInFolder(params.assetsFolder);
  console.log("Assets found:", assetFileNames.length);
  const unusedFileNames = new Set(assetFileNames);

  // go over each file in srcFolder
  // remove the files for which its name can be found in the content of the file
  folderVisitor(params.srcFolder, (content) => {
    for (const assetFileName of assetFileNames) {
      if (content.includes(assetFileName.name)) {
        unusedFileNames.delete(assetFileName);
      }
    }
  });

  // create a file unusedFiles.txt and write the unused file names
  const unusedFilePaths = Array.from(unusedFileNames).map(
    (file) => file.fullPath,
  );

  fs.writeFileSync("unusedFiles.txt", unusedFilePaths.join("\n"));
}

main({ assetsFolder: "./public", srcFolder: "./src" });

console.log(" --- Done ---- ");
console.log('Unused file paths are written to "unusedFiles.txt"');
