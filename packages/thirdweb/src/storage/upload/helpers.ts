import { areUint8ArraysEqual, isUint8Array } from "../../utils/uint8-array.js";
import type {
  BufferOrStringWithName,
  BuildFormDataOptions,
  FileOrBufferOrString,
} from "./types.js";

/**
 * @internal
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * @internal
 */
export function isFileInstance(data: any): data is File {
  return global.File && data instanceof File;
}

/**
 * @internal
 */
export function isBufferOrStringWithName(
  data: any,
): data is BufferOrStringWithName {
  return !!(
    data &&
    data.name &&
    data.data &&
    typeof data.name === "string" &&
    (typeof data.data === "string" || isUint8Array(data.data))
  );
}

export function isFileBufferOrStringEqual(input1: any, input2: any): boolean {
  if (isFileInstance(input1) && isFileInstance(input2)) {
    // if both are File types, compare the name, size, and last modified date (best guess that these are the same files)
    if (
      input1.name === input2.name &&
      input1.lastModified === input2.lastModified &&
      input1.size === input2.size
    ) {
      return true;
    }
  } else if (isUint8Array(input1) && isUint8Array(input2)) {
    // buffer gives us an easy way to compare the contents!

    return areUint8ArraysEqual(input1, input2);
  } else if (
    isBufferOrStringWithName(input1) &&
    isBufferOrStringWithName(input2)
  ) {
    // first check the names
    if (input1.name === input2.name) {
      // if the data for both is a string, compare the strings
      if (typeof input1.data === "string" && typeof input2.data === "string") {
        return input1.data === input2.data;
      } else if (isUint8Array(input1.data) && isUint8Array(input2.data)) {
        // otherwise we know it's buffers, so compare the buffers
        return areUint8ArraysEqual(input1.data, input2.data);
      }
    }
  }
  // otherwise if we have not found a match, return false
  return false;
}

export function buildFormData(
  form: FormData,
  files: FileOrBufferOrString[],
  options?: BuildFormDataOptions,
) {
  const fileNameToFileMap = new Map<string, FileOrBufferOrString>();
  const fileNames: string[] = [];
  for (let i = 0; i < files.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const file = files[i]!;
    let fileName = "";
    let fileData = file;

    if (isFileInstance(file)) {
      if (options?.rewriteFileNames) {
        let extensions = "";
        if (file.name) {
          const extensionStartIndex = file.name.lastIndexOf(".");
          if (extensionStartIndex > -1) {
            extensions = file.name.substring(extensionStartIndex);
          }
        }
        fileName = `${
          i + options.rewriteFileNames.fileStartNumber
        }${extensions}`;
      } else {
        fileName = `${file.name}`;
      }
    } else if (isBufferOrStringWithName(file)) {
      fileData = file.data;
      if (options?.rewriteFileNames) {
        fileName = `${i + options.rewriteFileNames.fileStartNumber}`;
      } else {
        fileName = `${file.name}`;
      }
    } else {
      if (options?.rewriteFileNames) {
        fileName = `${i + options.rewriteFileNames.fileStartNumber}`;
      } else {
        fileName = `${i}`;
      }
    }

    // If we don't want to wrap with directory, adjust the filepath
    const filepath = options?.uploadWithoutDirectory
      ? `files`
      : `files/${fileName}`;

    if (fileNameToFileMap.has(fileName)) {
      // if the file in the map is the same as the file we are already looking at then just skip and continue
      if (isFileBufferOrStringEqual(fileNameToFileMap.get(fileName), file)) {
        // we add it to the filenames array so that we can return the correct number of urls,
        fileNames.push(fileName);
        // but then we skip because we don't need to upload it multiple times
        continue;
      }
      // otherwise if file names are the same but they are not the same file then we should throw an error (trying to upload to differnt files but with the same names)
      throw new Error(
        `[DUPLICATE_FILE_NAME_ERROR] File name ${fileName} was passed for more than one different file.`,
      );
    }

    // add it to the map so that we can check for duplicates
    fileNameToFileMap.set(fileName, file);
    // add it to the filenames array so that we can return the correct number of urls
    fileNames.push(fileName);
    form.append("file", new Blob([fileData as any]), filepath);
  }

  const metadata = {
    name: `Storage SDK`,
    keyvalues: { ...options?.metadata },
  };
  form.append("pinataMetadata", JSON.stringify(metadata));

  if (options?.uploadWithoutDirectory) {
    form.append(
      "pinataOptions",
      JSON.stringify({
        wrapWithDirectory: false,
      }),
    );
  }

  return {
    form,
    // encode the file names on the way out (which is what the upload backend expects)
    fileNames: fileNames.map((fName) => encodeURIComponent(fName)),
  };
}
