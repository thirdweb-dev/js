export enum FieldType {
  UINT256 = 0,
  STRING = 1,
  BOOLEAN = 2,
  ADDRESS = 3,
}

export enum FieldStatus {
  INDEXED = 0,
  DELETED = 1,
  OPTIONAL = 2,
}

export type CollectionField = {
  name: string;
  type: FieldType;
  status: FieldStatus[];
  defaultValue?: string;
};

export type CollectionSchema = CollectionField[];
