/**
 * @public
 */
export type IpfsDownloaderOptions = {
  /**
   * Optional clientId to associate with the IpfsDownloader - when used from the frontend.
   * You can get a clientId here: https://thirdweb.com/create-api-key
   */
  clientId?: string;
};

/**
 * @public
 */
export type IpfsUploaderOptions = {
  /**
   * Whether or not to replace any URLs with schemes with resolved URLs before upload
   */
  uploadWithGatewayUrl?: boolean;
  /**
   * Optional clientId to associate with the IpfsUploader.
   * You can get an clientId here: https://thirdweb.com/create-api-key
   */
  clientId?: string;
};

type UploadFile = { name?: string; type?: string; uri: string };

export type UploadDataValue = UploadFile | any;
