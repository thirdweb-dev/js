import fs from "fs";

/**
 *
 * @param dir
 * @param fileFormat
 * @returns
 */
export function getFilesRecursive(dir: string, fileFormat: string) {
	const output: string[] = [];

	const fileOrDirList = fs.readdirSync(dir);

	// Create the full path of the file/directory by concatenating the passed directory and file/directory name
	for (const file of fileOrDirList) {
		const path = `${dir}/${file}`;
		// Check if the current file/directory is a directory using fs.statSync
		if (fs.statSync(path).isDirectory()) {
			// If it is a directory, recursively call the getFiles function with the directory path and the files array
			const files = getFilesRecursive(path, fileFormat);
			if (files.length > 0) {
				output.push(...getFilesRecursive(path, fileFormat));
			}
		} else {
			const isHTML = path.endsWith("." + fileFormat);

			if (isHTML) {
				output.push(path);
			}
		}
	}

	return output;
}
