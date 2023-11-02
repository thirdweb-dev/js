import { FileOrBufferOrString } from "../types/data";
import { IStorageUploader, IpfsUploadBatchOptions } from "../types/upload";

type PinataOptions = {
  pinataApiKey: string;
  pinataSecretKey: string;
};

export class PinataUploader
  implements IStorageUploader<IpfsUploadBatchOptions>
{
  private pinataApiKey: string;
  private pinataSecretKey: string;
  constructor(options: PinataOptions) {
    this.pinataApiKey = options.pinataApiKey;
    this.pinataSecretKey = options.pinataSecretKey;
  }

  async uploadBatch(
    data: FileOrBufferOrString[],
    options?: IpfsUploadBatchOptions | undefined,
  ): Promise<string[]> {
    return [];
  }
}
