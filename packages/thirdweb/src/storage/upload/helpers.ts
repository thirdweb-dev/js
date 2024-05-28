import { isObjectWithKeys } from "../../utils/type-guards.js";
import { areUint8ArraysEqual, isUint8Array } from "../../utils/uint8-array.js";
import type {
  BufferOrStringWithName,
  BuildFormDataOptions,
  FileOrBuffer,
  FileOrBufferOrString,
} from "./types.js";

/**
 * @internal
 */
function isFileInstance(data: unknown): data is File {
  return globalThis.File && data instanceof File;
}

/**
 * @internal
 */
function isBufferOrStringWithName(
  data: unknown,
): data is BufferOrStringWithName {
  if (!data) {
    return false;
  }
  if (!isObjectWithKeys(data, ["data", "name"])) {
    return false;
  }
  return !!(
    typeof data.name === "string" &&
    (typeof data.data === "string" || isUint8Array(data.data))
  );
}

export function isFileBufferOrStringEqual(
  input1: unknown,
  input2: unknown,
): boolean {
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
      }
      if (isUint8Array(input1.data) && isUint8Array(input2.data)) {
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
    // biome-ignore lint/style/noNonNullAssertion: we know that files[i] is not null or undefined because we are iterating over the array
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
      ? "files"
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
    form.append("file", new Blob([fileData as BlobPart]), filepath);
  }

  const metadata = {
    name: "Storage SDK",
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

export function isFileOrUint8Array(
  data: unknown,
): data is File | Uint8Array | BufferOrStringWithName {
  return (
    isFileInstance(data) || isUint8Array(data) || isBufferOrStringWithName(data)
  );
}

/**
 * @internal
 */
export function extractObjectFiles(
  data: unknown,
  files: FileOrBuffer[] = [],
): FileOrBuffer[] {
  // If item is a FileOrBuffer add it to our list of files
  if (isFileOrUint8Array(data)) {
    files.push(data);
    return files;
  }

  if (typeof data === "object") {
    if (!data) {
      return files;
    }

    if (Array.isArray(data)) {
      for (const entry of data) {
        extractObjectFiles(entry, files);
      }
    } else {
      Object.keys(data).map((key) =>
        extractObjectFiles(data[key as keyof typeof data], files),
      );
    }
  }

  return files;
}

/**
 * @internal
 */
export function replaceObjectFilesWithUris(
  data: unknown,
  uris: string[],
): unknown {
  if (isFileOrUint8Array(data)) {
    if (uris.length) {
      return uris.shift() as string;
    }
    console.warn("Not enough URIs to replace all files in object.");
  }

  if (typeof data === "object") {
    if (!data) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((entry) => replaceObjectFilesWithUris(entry, uris));
    }
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        replaceObjectFilesWithUris(value, uris),
      ]),
    );
  }

  return data;
}

/**
 * @internal
 */
export function replaceGatewayUrlWithScheme(url: string): string {
  if (url.includes("/ipfs/")) {
    const hash = url.split("/ipfs/")[1];
    return `ipfs://${hash}`;
  }
  return url;
}

/**
 * @internal
 */
export function replaceObjectGatewayUrlsWithSchemes<TData>(data: TData): TData {
  if (typeof data === "string") {
    return replaceGatewayUrlWithScheme(data) as TData;
  }
  if (typeof data === "object") {
    if (!data) {
      return data;
    }

    if (isFileOrUint8Array(data)) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((entry) =>
        replaceObjectGatewayUrlsWithSchemes(entry),
      ) as TData;
    }

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        replaceObjectGatewayUrlsWithSchemes(value),
      ]),
    ) as TData;
  }

  return data;
}
