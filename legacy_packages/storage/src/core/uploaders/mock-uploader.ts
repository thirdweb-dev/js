import { isBufferInstance, isFileInstance } from "../../common/utils";
import { FileOrBufferOrString } from "../../types/data";
import { MemoryStorage } from "../../types/download";
import { IpfsUploadBatchOptions, IStorageUploader } from "../../types/upload";
import { v4 as uuidv4 } from "uuid";

/**
 * @internal
 */
export class MockUploader implements IStorageUploader<IpfsUploadBatchOptions> {
  storage: MemoryStorage;

  constructor(storage: MemoryStorage) {
    this.storage = storage;
  }

  async uploadBatch(
    data: FileOrBufferOrString[],
    options?: IpfsUploadBatchOptions | undefined,
  ): Promise<string[]> {
    const cid = uuidv4();
    const uris: string[] = [];
    this.storage[cid] = {};

    let index = options?.rewriteFileNames?.fileStartNumber || 0;
    for (const file of data) {
      let contents: string;
      if (isFileInstance(file)) {
        contents = await file.text();
      } else if (isBufferInstance(file)) {
        contents = file.toString();
      } else if (typeof file === "string") {
        contents = file;
      } else {
        contents = isBufferInstance(file.data)
          ? file.data.toString()
          : file.data;
        const name = file.name ? file.name : `file_${index}`;
        this.storage[cid][name] = contents;
        uris.push(`mock://${cid}/${name}`);
        continue;
      }
      this.storage[cid][index.toString()] = contents;
      uris.push(`mock://${cid}/${index}`);
      index += 1;
    }

    return uris;
  }
}
