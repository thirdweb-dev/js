/**
 * @extension LENS
 */
export type LensProfileSchema = {
  // A cryptographic signature of the Lens metadata
  signature: string;
  lens: {
    // lens id
    id: string;
    // The profile display name
    name: string;
    // The profile bio as markdown
    bio: string;
    // The profile picture (avatar)
    picture: string;
    // The profile cover picture
    coverPicture: string;
    // extra metadata
    attributes: MetadataAttribute[];
    // The App Id, if omitted considered as global Profile data
    appId?: string;
  };
};

/**
 * @internal
 */
type MetadataAttribute =
  | {
      type: "Boolean";
      key: string;
      value: "true" | "false";
    }
  | {
      type: "Date";
      key: string;
      value: string; // should be a valid ISO 8601 date string
    }
  | {
      type: "Number";
      key: string;
      value: string; // should be a valid JS number serialized as string
    }
  | {
      type: "String";
      key: string;
      value: string;
    }
  | {
      type: "JSON";
      key: string;
      value: string; // should be a JSON string
    };
