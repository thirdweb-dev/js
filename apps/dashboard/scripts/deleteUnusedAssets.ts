import { promises as fs } from "node:fs";
import path from "node:path";

// after running logUnusedAssets.ts,
// 1. validate the output
// 2. If you think that a file should not be deleted, remove it from the output
// 3. paste the output files in `filesToDelete` and run this script to delete them
const filesToDelete: string[] = [];

async function deleteFiles() {
  for (const filePath of filesToDelete) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      await fs.unlink(fullPath);
      console.log(`Deleted: ${filePath}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.warn(`File not found: ${filePath}`);
      } else {
        console.error(`Error deleting ${filePath}:`, error);
      }
    }
  }

  console.log("--- DONE ---");
}

deleteFiles();
