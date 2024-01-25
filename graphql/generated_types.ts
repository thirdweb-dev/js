export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  bigint: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamp: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** Single accounts that belong to a higher level organization (seller table) */
export type Account = {
  __typename?: 'account';
  convertkit_subscriber_id?: Maybe<Scalars['Int']['output']>;
  created_at: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  full_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
  seller_id: Scalars['String']['output'];
  source?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "account" */
export type Account_Aggregate = {
  __typename?: 'account_aggregate';
  aggregate?: Maybe<Account_Aggregate_Fields>;
  nodes: Array<Account>;
};

/** aggregate fields of "account" */
export type Account_Aggregate_Fields = {
  __typename?: 'account_aggregate_fields';
  avg?: Maybe<Account_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Account_Max_Fields>;
  min?: Maybe<Account_Min_Fields>;
  stddev?: Maybe<Account_Stddev_Fields>;
  stddev_pop?: Maybe<Account_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Account_Stddev_Samp_Fields>;
  sum?: Maybe<Account_Sum_Fields>;
  var_pop?: Maybe<Account_Var_Pop_Fields>;
  var_samp?: Maybe<Account_Var_Samp_Fields>;
  variance?: Maybe<Account_Variance_Fields>;
};


/** aggregate fields of "account" */
export type Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Account_Avg_Fields = {
  __typename?: 'account_avg_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export type Account_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Bool_Exp>>;
  _not?: InputMaybe<Account_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Bool_Exp>>;
  convertkit_subscriber_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  full_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
  source?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "account" */
export enum Account_Constraint {
  /** unique or primary key constraint on columns "email" */
  AccountEmailKey = 'account_email_key',
  /** unique or primary key constraint on columns "id" */
  AccountPkey = 'account_pkey'
}

/** input type for incrementing numeric columns in table "account" */
export type Account_Inc_Input = {
  convertkit_subscriber_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "account" */
export type Account_Insert_Input = {
  convertkit_subscriber_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "account_invite" */
export type Account_Invite = {
  __typename?: 'account_invite';
  created_at: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  invite_expires_at: Scalars['timestamptz']['output'];
  is_invite_accepted: Scalars['Boolean']['output'];
  role: Scalars['String']['output'];
  seller_id: Scalars['String']['output'];
};

/** aggregated selection of "account_invite" */
export type Account_Invite_Aggregate = {
  __typename?: 'account_invite_aggregate';
  aggregate?: Maybe<Account_Invite_Aggregate_Fields>;
  nodes: Array<Account_Invite>;
};

/** aggregate fields of "account_invite" */
export type Account_Invite_Aggregate_Fields = {
  __typename?: 'account_invite_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Account_Invite_Max_Fields>;
  min?: Maybe<Account_Invite_Min_Fields>;
};


/** aggregate fields of "account_invite" */
export type Account_Invite_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Account_Invite_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "account_invite". All fields are combined with a logical 'AND'. */
export type Account_Invite_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Invite_Bool_Exp>>;
  _not?: InputMaybe<Account_Invite_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Invite_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invite_expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  is_invite_accepted?: InputMaybe<Boolean_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "account_invite" */
export enum Account_Invite_Constraint {
  /** unique or primary key constraint on columns "id" */
  AccountInvitePkey = 'account_invite_pkey',
  /** unique or primary key constraint on columns "seller_id", "email" */
  AccountInviteSellerIdEmailKey = 'account_invite_seller_id_email_key'
}

/** input type for inserting data into table "account_invite" */
export type Account_Invite_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invite_expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  is_invite_accepted?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Account_Invite_Max_Fields = {
  __typename?: 'account_invite_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invite_expires_at?: Maybe<Scalars['timestamptz']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Account_Invite_Min_Fields = {
  __typename?: 'account_invite_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  invite_expires_at?: Maybe<Scalars['timestamptz']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "account_invite" */
export type Account_Invite_Mutation_Response = {
  __typename?: 'account_invite_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Account_Invite>;
};

/** on_conflict condition type for table "account_invite" */
export type Account_Invite_On_Conflict = {
  constraint: Account_Invite_Constraint;
  update_columns?: Array<Account_Invite_Update_Column>;
  where?: InputMaybe<Account_Invite_Bool_Exp>;
};

/** Ordering options when selecting data from "account_invite". */
export type Account_Invite_Order_By = {
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  invite_expires_at?: InputMaybe<Order_By>;
  is_invite_accepted?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  seller_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: account_invite */
export type Account_Invite_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "account_invite" */
export enum Account_Invite_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  InviteExpiresAt = 'invite_expires_at',
  /** column name */
  IsInviteAccepted = 'is_invite_accepted',
  /** column name */
  Role = 'role',
  /** column name */
  SellerId = 'seller_id'
}

/** input type for updating data in table "account_invite" */
export type Account_Invite_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invite_expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  is_invite_accepted?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "account_invite" */
export type Account_Invite_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Account_Invite_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Account_Invite_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  invite_expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  is_invite_accepted?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "account_invite" */
export enum Account_Invite_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  InviteExpiresAt = 'invite_expires_at',
  /** column name */
  IsInviteAccepted = 'is_invite_accepted',
  /** column name */
  Role = 'role',
  /** column name */
  SellerId = 'seller_id'
}

export type Account_Invite_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Account_Invite_Set_Input>;
  /** filter the rows which have to be updated */
  where: Account_Invite_Bool_Exp;
};

/** aggregate max on columns */
export type Account_Max_Fields = {
  __typename?: 'account_max_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Account_Min_Fields = {
  __typename?: 'account_min_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "account" */
export type Account_Mutation_Response = {
  __typename?: 'account_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Account>;
};

/** on_conflict condition type for table "account" */
export type Account_On_Conflict = {
  constraint: Account_Constraint;
  update_columns?: Array<Account_Update_Column>;
  where?: InputMaybe<Account_Bool_Exp>;
};

/** Ordering options when selecting data from "account". */
export type Account_Order_By = {
  convertkit_subscriber_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  full_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  seller_id?: InputMaybe<Order_By>;
  source?: InputMaybe<Order_By>;
};

/** primary key columns input for table: account */
export type Account_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "account" */
export enum Account_Select_Column {
  /** column name */
  ConvertkitSubscriberId = 'convertkit_subscriber_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FullName = 'full_name',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Source = 'source'
}

/** input type for updating data in table "account" */
export type Account_Set_Input = {
  convertkit_subscriber_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Account_Stddev_Fields = {
  __typename?: 'account_stddev_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Account_Stddev_Pop_Fields = {
  __typename?: 'account_stddev_pop_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Account_Stddev_Samp_Fields = {
  __typename?: 'account_stddev_samp_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "account" */
export type Account_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Account_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Account_Stream_Cursor_Value_Input = {
  convertkit_subscriber_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Account_Sum_Fields = {
  __typename?: 'account_sum_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "account" */
export enum Account_Update_Column {
  /** column name */
  ConvertkitSubscriberId = 'convertkit_subscriber_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FullName = 'full_name',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Source = 'source'
}

export type Account_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Account_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Account_Set_Input>;
  /** filter the rows which have to be updated */
  where: Account_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Account_Var_Pop_Fields = {
  __typename?: 'account_var_pop_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Account_Var_Samp_Fields = {
  __typename?: 'account_var_samp_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Account_Variance_Fields = {
  __typename?: 'account_variance_fields';
  convertkit_subscriber_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "airdrop" */
export type Airdrop = {
  __typename?: 'airdrop';
  /** An object relationship */
  contract?: Maybe<Contract>;
  contract_id?: Maybe<Scalars['uuid']['output']>;
  created_at: Scalars['timestamptz']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  seller_id: Scalars['String']['output'];
  /** Claimed, Unclaimed, Failed */
  status: Scalars['String']['output'];
  transaction_id: Scalars['uuid']['output'];
  updated_at: Scalars['timestamptz']['output'];
  wallet_address?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "airdrop" */
export type Airdrop_Aggregate = {
  __typename?: 'airdrop_aggregate';
  aggregate?: Maybe<Airdrop_Aggregate_Fields>;
  nodes: Array<Airdrop>;
};

/** aggregate fields of "airdrop" */
export type Airdrop_Aggregate_Fields = {
  __typename?: 'airdrop_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Airdrop_Max_Fields>;
  min?: Maybe<Airdrop_Min_Fields>;
};


/** aggregate fields of "airdrop" */
export type Airdrop_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Airdrop_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "airdrop". All fields are combined with a logical 'AND'. */
export type Airdrop_Bool_Exp = {
  _and?: InputMaybe<Array<Airdrop_Bool_Exp>>;
  _not?: InputMaybe<Airdrop_Bool_Exp>;
  _or?: InputMaybe<Array<Airdrop_Bool_Exp>>;
  contract?: InputMaybe<Contract_Bool_Exp>;
  contract_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  transaction_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  wallet_address?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "airdrop" */
export enum Airdrop_Constraint {
  /** unique or primary key constraint on columns "id" */
  AirdropPkey = 'airdrop_pkey',
  /** unique or primary key constraint on columns "transaction_id" */
  AirdropTransactionIdKey = 'airdrop_transaction_id_key'
}

/** input type for inserting data into table "airdrop" */
export type Airdrop_Insert_Input = {
  contract?: InputMaybe<Contract_Obj_Rel_Insert_Input>;
  contract_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  /** Claimed, Unclaimed, Failed */
  status?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  wallet_address?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Airdrop_Max_Fields = {
  __typename?: 'airdrop_max_fields';
  contract_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  /** Claimed, Unclaimed, Failed */
  status?: Maybe<Scalars['String']['output']>;
  transaction_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  wallet_address?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Airdrop_Min_Fields = {
  __typename?: 'airdrop_min_fields';
  contract_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  /** Claimed, Unclaimed, Failed */
  status?: Maybe<Scalars['String']['output']>;
  transaction_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  wallet_address?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "airdrop" */
export type Airdrop_Mutation_Response = {
  __typename?: 'airdrop_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Airdrop>;
};

/** on_conflict condition type for table "airdrop" */
export type Airdrop_On_Conflict = {
  constraint: Airdrop_Constraint;
  update_columns?: Array<Airdrop_Update_Column>;
  where?: InputMaybe<Airdrop_Bool_Exp>;
};

/** Ordering options when selecting data from "airdrop". */
export type Airdrop_Order_By = {
  contract?: InputMaybe<Contract_Order_By>;
  contract_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  seller_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  wallet_address?: InputMaybe<Order_By>;
};

/** primary key columns input for table: airdrop */
export type Airdrop_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "airdrop" */
export enum Airdrop_Select_Column {
  /** column name */
  ContractId = 'contract_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WalletAddress = 'wallet_address'
}

/** input type for updating data in table "airdrop" */
export type Airdrop_Set_Input = {
  contract_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  /** Claimed, Unclaimed, Failed */
  status?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  wallet_address?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "airdrop" */
export type Airdrop_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Airdrop_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Airdrop_Stream_Cursor_Value_Input = {
  contract_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  /** Claimed, Unclaimed, Failed */
  status?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  wallet_address?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "airdrop" */
export enum Airdrop_Update_Column {
  /** column name */
  ContractId = 'contract_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WalletAddress = 'wallet_address'
}

export type Airdrop_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Airdrop_Set_Input>;
  /** filter the rows which have to be updated */
  where: Airdrop_Bool_Exp;
};

/** columns and relationships of "analytics_overview" */
export type Analytics_Overview = {
  __typename?: 'analytics_overview';
  checkout_created_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "analytics_overview_2" */
export type Analytics_Overview_2 = {
  __typename?: 'analytics_overview_2';
  checkout_created_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  fiat_currency?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "analytics_overview_2" */
export type Analytics_Overview_2_Aggregate = {
  __typename?: 'analytics_overview_2_aggregate';
  aggregate?: Maybe<Analytics_Overview_2_Aggregate_Fields>;
  nodes: Array<Analytics_Overview_2>;
};

/** aggregate fields of "analytics_overview_2" */
export type Analytics_Overview_2_Aggregate_Fields = {
  __typename?: 'analytics_overview_2_aggregate_fields';
  avg?: Maybe<Analytics_Overview_2_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Analytics_Overview_2_Max_Fields>;
  min?: Maybe<Analytics_Overview_2_Min_Fields>;
  stddev?: Maybe<Analytics_Overview_2_Stddev_Fields>;
  stddev_pop?: Maybe<Analytics_Overview_2_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Analytics_Overview_2_Stddev_Samp_Fields>;
  sum?: Maybe<Analytics_Overview_2_Sum_Fields>;
  var_pop?: Maybe<Analytics_Overview_2_Var_Pop_Fields>;
  var_samp?: Maybe<Analytics_Overview_2_Var_Samp_Fields>;
  variance?: Maybe<Analytics_Overview_2_Variance_Fields>;
};


/** aggregate fields of "analytics_overview_2" */
export type Analytics_Overview_2_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Analytics_Overview_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Analytics_Overview_2_Avg_Fields = {
  __typename?: 'analytics_overview_2_avg_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "analytics_overview_2". All fields are combined with a logical 'AND'. */
export type Analytics_Overview_2_Bool_Exp = {
  _and?: InputMaybe<Array<Analytics_Overview_2_Bool_Exp>>;
  _not?: InputMaybe<Analytics_Overview_2_Bool_Exp>;
  _or?: InputMaybe<Array<Analytics_Overview_2_Bool_Exp>>;
  checkout_created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  checkout_deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  checkout_id?: InputMaybe<Uuid_Comparison_Exp>;
  collection_description?: InputMaybe<String_Comparison_Exp>;
  collection_title?: InputMaybe<String_Comparison_Exp>;
  fiat_currency?: InputMaybe<String_Comparison_Exp>;
  image_url?: InputMaybe<String_Comparison_Exp>;
  network_fees_cents?: InputMaybe<Bigint_Comparison_Exp>;
  num_transactions_made?: InputMaybe<Bigint_Comparison_Exp>;
  number_sold?: InputMaybe<Bigint_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  paper_fees_cents?: InputMaybe<Bigint_Comparison_Exp>;
  payment_method?: InputMaybe<String_Comparison_Exp>;
  revenue_cents?: InputMaybe<Bigint_Comparison_Exp>;
  unit_price_cents?: InputMaybe<Int_Comparison_Exp>;
  wallet_type?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Analytics_Overview_2_Max_Fields = {
  __typename?: 'analytics_overview_2_max_fields';
  checkout_created_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  fiat_currency?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Analytics_Overview_2_Min_Fields = {
  __typename?: 'analytics_overview_2_min_fields';
  checkout_created_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  fiat_currency?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "analytics_overview_2". */
export type Analytics_Overview_2_Order_By = {
  checkout_created_at?: InputMaybe<Order_By>;
  checkout_deleted_at?: InputMaybe<Order_By>;
  checkout_id?: InputMaybe<Order_By>;
  collection_description?: InputMaybe<Order_By>;
  collection_title?: InputMaybe<Order_By>;
  fiat_currency?: InputMaybe<Order_By>;
  image_url?: InputMaybe<Order_By>;
  network_fees_cents?: InputMaybe<Order_By>;
  num_transactions_made?: InputMaybe<Order_By>;
  number_sold?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  paper_fees_cents?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  revenue_cents?: InputMaybe<Order_By>;
  unit_price_cents?: InputMaybe<Order_By>;
  wallet_type?: InputMaybe<Order_By>;
};

/** select columns of table "analytics_overview_2" */
export enum Analytics_Overview_2_Select_Column {
  /** column name */
  CheckoutCreatedAt = 'checkout_created_at',
  /** column name */
  CheckoutDeletedAt = 'checkout_deleted_at',
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  CollectionDescription = 'collection_description',
  /** column name */
  CollectionTitle = 'collection_title',
  /** column name */
  FiatCurrency = 'fiat_currency',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  NetworkFeesCents = 'network_fees_cents',
  /** column name */
  NumTransactionsMade = 'num_transactions_made',
  /** column name */
  NumberSold = 'number_sold',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PaperFeesCents = 'paper_fees_cents',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  RevenueCents = 'revenue_cents',
  /** column name */
  UnitPriceCents = 'unit_price_cents',
  /** column name */
  WalletType = 'wallet_type'
}

/** aggregate stddev on columns */
export type Analytics_Overview_2_Stddev_Fields = {
  __typename?: 'analytics_overview_2_stddev_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Analytics_Overview_2_Stddev_Pop_Fields = {
  __typename?: 'analytics_overview_2_stddev_pop_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Analytics_Overview_2_Stddev_Samp_Fields = {
  __typename?: 'analytics_overview_2_stddev_samp_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "analytics_overview_2" */
export type Analytics_Overview_2_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Analytics_Overview_2_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Analytics_Overview_2_Stream_Cursor_Value_Input = {
  checkout_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  checkout_deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  collection_description?: InputMaybe<Scalars['String']['input']>;
  collection_title?: InputMaybe<Scalars['String']['input']>;
  fiat_currency?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  network_fees_cents?: InputMaybe<Scalars['bigint']['input']>;
  num_transactions_made?: InputMaybe<Scalars['bigint']['input']>;
  number_sold?: InputMaybe<Scalars['bigint']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  paper_fees_cents?: InputMaybe<Scalars['bigint']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  revenue_cents?: InputMaybe<Scalars['bigint']['input']>;
  unit_price_cents?: InputMaybe<Scalars['Int']['input']>;
  wallet_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Analytics_Overview_2_Sum_Fields = {
  __typename?: 'analytics_overview_2_sum_fields';
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Analytics_Overview_2_Var_Pop_Fields = {
  __typename?: 'analytics_overview_2_var_pop_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Analytics_Overview_2_Var_Samp_Fields = {
  __typename?: 'analytics_overview_2_var_samp_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Analytics_Overview_2_Variance_Fields = {
  __typename?: 'analytics_overview_2_variance_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregated selection of "analytics_overview" */
export type Analytics_Overview_Aggregate = {
  __typename?: 'analytics_overview_aggregate';
  aggregate?: Maybe<Analytics_Overview_Aggregate_Fields>;
  nodes: Array<Analytics_Overview>;
};

/** aggregate fields of "analytics_overview" */
export type Analytics_Overview_Aggregate_Fields = {
  __typename?: 'analytics_overview_aggregate_fields';
  avg?: Maybe<Analytics_Overview_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Analytics_Overview_Max_Fields>;
  min?: Maybe<Analytics_Overview_Min_Fields>;
  stddev?: Maybe<Analytics_Overview_Stddev_Fields>;
  stddev_pop?: Maybe<Analytics_Overview_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Analytics_Overview_Stddev_Samp_Fields>;
  sum?: Maybe<Analytics_Overview_Sum_Fields>;
  var_pop?: Maybe<Analytics_Overview_Var_Pop_Fields>;
  var_samp?: Maybe<Analytics_Overview_Var_Samp_Fields>;
  variance?: Maybe<Analytics_Overview_Variance_Fields>;
};


/** aggregate fields of "analytics_overview" */
export type Analytics_Overview_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Analytics_Overview_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Analytics_Overview_Avg_Fields = {
  __typename?: 'analytics_overview_avg_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "analytics_overview". All fields are combined with a logical 'AND'. */
export type Analytics_Overview_Bool_Exp = {
  _and?: InputMaybe<Array<Analytics_Overview_Bool_Exp>>;
  _not?: InputMaybe<Analytics_Overview_Bool_Exp>;
  _or?: InputMaybe<Array<Analytics_Overview_Bool_Exp>>;
  checkout_created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  checkout_deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  checkout_id?: InputMaybe<Uuid_Comparison_Exp>;
  collection_description?: InputMaybe<String_Comparison_Exp>;
  collection_title?: InputMaybe<String_Comparison_Exp>;
  image_url?: InputMaybe<String_Comparison_Exp>;
  network_fees_cents?: InputMaybe<Bigint_Comparison_Exp>;
  num_transactions_made?: InputMaybe<Bigint_Comparison_Exp>;
  number_sold?: InputMaybe<Bigint_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  paper_fees_cents?: InputMaybe<Bigint_Comparison_Exp>;
  payment_method?: InputMaybe<String_Comparison_Exp>;
  revenue_cents?: InputMaybe<Bigint_Comparison_Exp>;
  unit_price_cents?: InputMaybe<Int_Comparison_Exp>;
  wallet_type?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Analytics_Overview_Max_Fields = {
  __typename?: 'analytics_overview_max_fields';
  checkout_created_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Analytics_Overview_Min_Fields = {
  __typename?: 'analytics_overview_min_fields';
  checkout_created_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "analytics_overview". */
export type Analytics_Overview_Order_By = {
  checkout_created_at?: InputMaybe<Order_By>;
  checkout_deleted_at?: InputMaybe<Order_By>;
  checkout_id?: InputMaybe<Order_By>;
  collection_description?: InputMaybe<Order_By>;
  collection_title?: InputMaybe<Order_By>;
  image_url?: InputMaybe<Order_By>;
  network_fees_cents?: InputMaybe<Order_By>;
  num_transactions_made?: InputMaybe<Order_By>;
  number_sold?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  paper_fees_cents?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  revenue_cents?: InputMaybe<Order_By>;
  unit_price_cents?: InputMaybe<Order_By>;
  wallet_type?: InputMaybe<Order_By>;
};

/** select columns of table "analytics_overview" */
export enum Analytics_Overview_Select_Column {
  /** column name */
  CheckoutCreatedAt = 'checkout_created_at',
  /** column name */
  CheckoutDeletedAt = 'checkout_deleted_at',
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  CollectionDescription = 'collection_description',
  /** column name */
  CollectionTitle = 'collection_title',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  NetworkFeesCents = 'network_fees_cents',
  /** column name */
  NumTransactionsMade = 'num_transactions_made',
  /** column name */
  NumberSold = 'number_sold',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PaperFeesCents = 'paper_fees_cents',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  RevenueCents = 'revenue_cents',
  /** column name */
  UnitPriceCents = 'unit_price_cents',
  /** column name */
  WalletType = 'wallet_type'
}

/** aggregate stddev on columns */
export type Analytics_Overview_Stddev_Fields = {
  __typename?: 'analytics_overview_stddev_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Analytics_Overview_Stddev_Pop_Fields = {
  __typename?: 'analytics_overview_stddev_pop_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Analytics_Overview_Stddev_Samp_Fields = {
  __typename?: 'analytics_overview_stddev_samp_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "analytics_overview" */
export type Analytics_Overview_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Analytics_Overview_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Analytics_Overview_Stream_Cursor_Value_Input = {
  checkout_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  checkout_deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  collection_description?: InputMaybe<Scalars['String']['input']>;
  collection_title?: InputMaybe<Scalars['String']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  network_fees_cents?: InputMaybe<Scalars['bigint']['input']>;
  num_transactions_made?: InputMaybe<Scalars['bigint']['input']>;
  number_sold?: InputMaybe<Scalars['bigint']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  paper_fees_cents?: InputMaybe<Scalars['bigint']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  revenue_cents?: InputMaybe<Scalars['bigint']['input']>;
  unit_price_cents?: InputMaybe<Scalars['Int']['input']>;
  wallet_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Analytics_Overview_Sum_Fields = {
  __typename?: 'analytics_overview_sum_fields';
  network_fees_cents?: Maybe<Scalars['bigint']['output']>;
  num_transactions_made?: Maybe<Scalars['bigint']['output']>;
  number_sold?: Maybe<Scalars['bigint']['output']>;
  paper_fees_cents?: Maybe<Scalars['bigint']['output']>;
  revenue_cents?: Maybe<Scalars['bigint']['output']>;
  unit_price_cents?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Analytics_Overview_Var_Pop_Fields = {
  __typename?: 'analytics_overview_var_pop_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Analytics_Overview_Var_Samp_Fields = {
  __typename?: 'analytics_overview_var_samp_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Analytics_Overview_Variance_Fields = {
  __typename?: 'analytics_overview_variance_fields';
  network_fees_cents?: Maybe<Scalars['Float']['output']>;
  num_transactions_made?: Maybe<Scalars['Float']['output']>;
  number_sold?: Maybe<Scalars['Float']['output']>;
  paper_fees_cents?: Maybe<Scalars['Float']['output']>;
  revenue_cents?: Maybe<Scalars['Float']['output']>;
  unit_price_cents?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "api_secret_key" */
export type Api_Secret_Key = {
  __typename?: 'api_secret_key';
  created_at: Scalars['timestamptz']['output'];
  hashed_key: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  owner_id: Scalars['String']['output'];
  plaintext?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "api_secret_key" */
export type Api_Secret_Key_Aggregate = {
  __typename?: 'api_secret_key_aggregate';
  aggregate?: Maybe<Api_Secret_Key_Aggregate_Fields>;
  nodes: Array<Api_Secret_Key>;
};

/** aggregate fields of "api_secret_key" */
export type Api_Secret_Key_Aggregate_Fields = {
  __typename?: 'api_secret_key_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Api_Secret_Key_Max_Fields>;
  min?: Maybe<Api_Secret_Key_Min_Fields>;
};


/** aggregate fields of "api_secret_key" */
export type Api_Secret_Key_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Api_Secret_Key_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "api_secret_key". All fields are combined with a logical 'AND'. */
export type Api_Secret_Key_Bool_Exp = {
  _and?: InputMaybe<Array<Api_Secret_Key_Bool_Exp>>;
  _not?: InputMaybe<Api_Secret_Key_Bool_Exp>;
  _or?: InputMaybe<Array<Api_Secret_Key_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  hashed_key?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  plaintext?: InputMaybe<String_Comparison_Exp>;
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "api_secret_key" */
export enum Api_Secret_Key_Constraint {
  /** unique or primary key constraint on columns "id" */
  ApiSecretKeyPkey = 'api_secret_key_pkey',
  /** unique or primary key constraint on columns "plaintext" */
  ApiSecretKeyPlaintext = 'api_secret_key_plaintext'
}

/** input type for inserting data into table "api_secret_key" */
export type Api_Secret_Key_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  hashed_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  plaintext?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Api_Secret_Key_Max_Fields = {
  __typename?: 'api_secret_key_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  hashed_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  plaintext?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Api_Secret_Key_Min_Fields = {
  __typename?: 'api_secret_key_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  hashed_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  plaintext?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "api_secret_key" */
export type Api_Secret_Key_Mutation_Response = {
  __typename?: 'api_secret_key_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Api_Secret_Key>;
};

/** on_conflict condition type for table "api_secret_key" */
export type Api_Secret_Key_On_Conflict = {
  constraint: Api_Secret_Key_Constraint;
  update_columns?: Array<Api_Secret_Key_Update_Column>;
  where?: InputMaybe<Api_Secret_Key_Bool_Exp>;
};

/** Ordering options when selecting data from "api_secret_key". */
export type Api_Secret_Key_Order_By = {
  created_at?: InputMaybe<Order_By>;
  hashed_key?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  plaintext?: InputMaybe<Order_By>;
  revoked_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: api_secret_key */
export type Api_Secret_Key_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "api_secret_key" */
export enum Api_Secret_Key_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HashedKey = 'hashed_key',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  Plaintext = 'plaintext',
  /** column name */
  RevokedAt = 'revoked_at'
}

/** input type for updating data in table "api_secret_key" */
export type Api_Secret_Key_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  hashed_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  plaintext?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "api_secret_key" */
export type Api_Secret_Key_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Api_Secret_Key_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Api_Secret_Key_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  hashed_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  plaintext?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "api_secret_key" */
export enum Api_Secret_Key_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HashedKey = 'hashed_key',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  Plaintext = 'plaintext',
  /** column name */
  RevokedAt = 'revoked_at'
}

export type Api_Secret_Key_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Api_Secret_Key_Set_Input>;
  /** filter the rows which have to be updated */
  where: Api_Secret_Key_Bool_Exp;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** columns and relationships of "billing_history" */
export type Billing_History = {
  __typename?: 'billing_history';
  description: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  payment_completed_at: Scalars['timestamptz']['output'];
  price_charged_usd_cents: Scalars['Int']['output'];
  seller_id: Scalars['String']['output'];
  status: Scalars['String']['output'];
  stripe_payment_id: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

/** aggregated selection of "billing_history" */
export type Billing_History_Aggregate = {
  __typename?: 'billing_history_aggregate';
  aggregate?: Maybe<Billing_History_Aggregate_Fields>;
  nodes: Array<Billing_History>;
};

/** aggregate fields of "billing_history" */
export type Billing_History_Aggregate_Fields = {
  __typename?: 'billing_history_aggregate_fields';
  avg?: Maybe<Billing_History_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Billing_History_Max_Fields>;
  min?: Maybe<Billing_History_Min_Fields>;
  stddev?: Maybe<Billing_History_Stddev_Fields>;
  stddev_pop?: Maybe<Billing_History_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Billing_History_Stddev_Samp_Fields>;
  sum?: Maybe<Billing_History_Sum_Fields>;
  var_pop?: Maybe<Billing_History_Var_Pop_Fields>;
  var_samp?: Maybe<Billing_History_Var_Samp_Fields>;
  variance?: Maybe<Billing_History_Variance_Fields>;
};


/** aggregate fields of "billing_history" */
export type Billing_History_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_History_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Billing_History_Avg_Fields = {
  __typename?: 'billing_history_avg_fields';
  price_charged_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "billing_history". All fields are combined with a logical 'AND'. */
export type Billing_History_Bool_Exp = {
  _and?: InputMaybe<Array<Billing_History_Bool_Exp>>;
  _not?: InputMaybe<Billing_History_Bool_Exp>;
  _or?: InputMaybe<Array<Billing_History_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  payment_completed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  price_charged_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  stripe_payment_id?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "billing_history" */
export enum Billing_History_Constraint {
  /** unique or primary key constraint on columns "id" */
  BillingHistoryPkey = 'billing_history_pkey',
  /** unique or primary key constraint on columns "stripe_payment_id" */
  BillingHistoryStripePaymentIdKey = 'billing_history_stripe_payment_id_key'
}

/** input type for incrementing numeric columns in table "billing_history" */
export type Billing_History_Inc_Input = {
  price_charged_usd_cents?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "billing_history" */
export type Billing_History_Insert_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  price_charged_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  stripe_payment_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Billing_History_Max_Fields = {
  __typename?: 'billing_history_max_fields';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payment_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  price_charged_usd_cents?: Maybe<Scalars['Int']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  stripe_payment_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Billing_History_Min_Fields = {
  __typename?: 'billing_history_min_fields';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  payment_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  price_charged_usd_cents?: Maybe<Scalars['Int']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  stripe_payment_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "billing_history" */
export type Billing_History_Mutation_Response = {
  __typename?: 'billing_history_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Billing_History>;
};

/** on_conflict condition type for table "billing_history" */
export type Billing_History_On_Conflict = {
  constraint: Billing_History_Constraint;
  update_columns?: Array<Billing_History_Update_Column>;
  where?: InputMaybe<Billing_History_Bool_Exp>;
};

/** Ordering options when selecting data from "billing_history". */
export type Billing_History_Order_By = {
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  payment_completed_at?: InputMaybe<Order_By>;
  price_charged_usd_cents?: InputMaybe<Order_By>;
  seller_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  stripe_payment_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: billing_history */
export type Billing_History_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "billing_history" */
export enum Billing_History_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  PaymentCompletedAt = 'payment_completed_at',
  /** column name */
  PriceChargedUsdCents = 'price_charged_usd_cents',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Status = 'status',
  /** column name */
  StripePaymentId = 'stripe_payment_id',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "billing_history" */
export type Billing_History_Set_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  price_charged_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  stripe_payment_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Billing_History_Stddev_Fields = {
  __typename?: 'billing_history_stddev_fields';
  price_charged_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Billing_History_Stddev_Pop_Fields = {
  __typename?: 'billing_history_stddev_pop_fields';
  price_charged_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Billing_History_Stddev_Samp_Fields = {
  __typename?: 'billing_history_stddev_samp_fields';
  price_charged_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "billing_history" */
export type Billing_History_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Billing_History_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Billing_History_Stream_Cursor_Value_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  payment_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  price_charged_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  stripe_payment_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Billing_History_Sum_Fields = {
  __typename?: 'billing_history_sum_fields';
  price_charged_usd_cents?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "billing_history" */
export enum Billing_History_Update_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  PaymentCompletedAt = 'payment_completed_at',
  /** column name */
  PriceChargedUsdCents = 'price_charged_usd_cents',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Status = 'status',
  /** column name */
  StripePaymentId = 'stripe_payment_id',
  /** column name */
  Type = 'type'
}

export type Billing_History_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Billing_History_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Billing_History_Set_Input>;
  /** filter the rows which have to be updated */
  where: Billing_History_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Billing_History_Var_Pop_Fields = {
  __typename?: 'billing_history_var_pop_fields';
  price_charged_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Billing_History_Var_Samp_Fields = {
  __typename?: 'billing_history_var_samp_fields';
  price_charged_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Billing_History_Variance_Fields = {
  __typename?: 'billing_history_variance_fields';
  price_charged_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "buyer" */
export type Buyer = {
  __typename?: 'buyer';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  customer?: Maybe<Customer>;
  email: Scalars['String']['output'];
  full_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  is_paper_wallet?: Maybe<Scalars['Boolean']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "buyer" */
export type Buyer_Aggregate = {
  __typename?: 'buyer_aggregate';
  aggregate?: Maybe<Buyer_Aggregate_Fields>;
  nodes: Array<Buyer>;
};

/** aggregate fields of "buyer" */
export type Buyer_Aggregate_Fields = {
  __typename?: 'buyer_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Buyer_Max_Fields>;
  min?: Maybe<Buyer_Min_Fields>;
};


/** aggregate fields of "buyer" */
export type Buyer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Buyer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "buyer". All fields are combined with a logical 'AND'. */
export type Buyer_Bool_Exp = {
  _and?: InputMaybe<Array<Buyer_Bool_Exp>>;
  _not?: InputMaybe<Buyer_Bool_Exp>;
  _or?: InputMaybe<Array<Buyer_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  customer?: InputMaybe<Customer_Bool_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  full_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  is_paper_wallet?: InputMaybe<Boolean_Comparison_Exp>;
  stripe_customer_id?: InputMaybe<String_Comparison_Exp>;
  stripe_testmode_customer_id?: InputMaybe<String_Comparison_Exp>;
  stripe_testmode_verification_session_id?: InputMaybe<String_Comparison_Exp>;
  stripe_verification_session_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "buyer" */
export enum Buyer_Constraint {
  /** unique or primary key constraint on columns "id", "email" */
  BuyerEmailIdKey = 'buyer_email_id_key',
  /** unique or primary key constraint on columns "id" */
  BuyerPkey = 'buyer_pkey'
}

/** input type for inserting data into table "buyer" */
export type Buyer_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  customer?: InputMaybe<Customer_Obj_Rel_Insert_Input>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  is_paper_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Buyer_Max_Fields = {
  __typename?: 'buyer_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Buyer_Min_Fields = {
  __typename?: 'buyer_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "buyer" */
export type Buyer_Mutation_Response = {
  __typename?: 'buyer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Buyer>;
};

/** input type for inserting object relation for remote table "buyer" */
export type Buyer_Obj_Rel_Insert_Input = {
  data: Buyer_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Buyer_On_Conflict>;
};

/** on_conflict condition type for table "buyer" */
export type Buyer_On_Conflict = {
  constraint: Buyer_Constraint;
  update_columns?: Array<Buyer_Update_Column>;
  where?: InputMaybe<Buyer_Bool_Exp>;
};

/** Ordering options when selecting data from "buyer". */
export type Buyer_Order_By = {
  created_at?: InputMaybe<Order_By>;
  customer?: InputMaybe<Customer_Order_By>;
  email?: InputMaybe<Order_By>;
  full_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_paper_wallet?: InputMaybe<Order_By>;
  stripe_customer_id?: InputMaybe<Order_By>;
  stripe_testmode_customer_id?: InputMaybe<Order_By>;
  stripe_testmode_verification_session_id?: InputMaybe<Order_By>;
  stripe_verification_session_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: buyer */
export type Buyer_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** select columns of table "buyer" */
export enum Buyer_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FullName = 'full_name',
  /** column name */
  Id = 'id',
  /** column name */
  IsPaperWallet = 'is_paper_wallet',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  StripeTestmodeCustomerId = 'stripe_testmode_customer_id',
  /** column name */
  StripeTestmodeVerificationSessionId = 'stripe_testmode_verification_session_id',
  /** column name */
  StripeVerificationSessionId = 'stripe_verification_session_id'
}

/** input type for updating data in table "buyer" */
export type Buyer_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  is_paper_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "buyer" */
export type Buyer_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Buyer_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Buyer_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  is_paper_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "buyer" */
export enum Buyer_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FullName = 'full_name',
  /** column name */
  Id = 'id',
  /** column name */
  IsPaperWallet = 'is_paper_wallet',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  StripeTestmodeCustomerId = 'stripe_testmode_customer_id',
  /** column name */
  StripeTestmodeVerificationSessionId = 'stripe_testmode_verification_session_id',
  /** column name */
  StripeVerificationSessionId = 'stripe_verification_session_id'
}

export type Buyer_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Buyer_Set_Input>;
  /** filter the rows which have to be updated */
  where: Buyer_Bool_Exp;
};

/** columns and relationships of "checkout" */
export type Checkout = {
  __typename?: 'checkout';
  brand_button_shape: Scalars['String']['output'];
  brand_color_scheme: Scalars['String']['output'];
  brand_dark_mode: Scalars['Boolean']['output'];
  bundle_address?: Maybe<Scalars['String']['output']>;
  cancel_callback_url?: Maybe<Scalars['String']['output']>;
  card_payments_vendor?: Maybe<Scalars['String']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title: Scalars['String']['output'];
  /** An object relationship */
  contract?: Maybe<Contract>;
  contract_address: Scalars['String']['output'];
  contract_args?: Maybe<Scalars['jsonb']['output']>;
  contract_chain: Scalars['String']['output'];
  contract_type: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  custom_abi: Scalars['jsonb']['output'];
  deleted_at: Scalars['timestamptz']['output'];
  float_wallet_addresses: Scalars['jsonb']['output'];
  generated_by_registered_contract: Scalars['Boolean']['output'];
  has_public_link: Scalars['Boolean']['output'];
  hide_connect_external_wallet: Scalars['Boolean']['output'];
  hide_connect_paper_wallet: Scalars['Boolean']['output'];
  hide_native_mint: Scalars['Boolean']['output'];
  hide_pay_with_afterpay: Scalars['Boolean']['output'];
  hide_pay_with_bank: Scalars['Boolean']['output'];
  hide_pay_with_card: Scalars['Boolean']['output'];
  hide_pay_with_crypto: Scalars['Boolean']['output'];
  hide_pay_with_ideal: Scalars['Boolean']['output'];
  id: Scalars['uuid']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  limit_per_transaction: Scalars['Int']['output'];
  limit_per_wallet_address?: Maybe<Scalars['Int']['output']>;
  listing_id?: Maybe<Scalars['String']['output']>;
  mint_abi_function_name?: Maybe<Scalars['String']['output']>;
  owner_id: Scalars['String']['output'];
  pack_address?: Maybe<Scalars['String']['output']>;
  pack_id?: Maybe<Scalars['String']['output']>;
  post_purchase_button_text?: Maybe<Scalars['String']['output']>;
  post_purchase_message_markdown?: Maybe<Scalars['String']['output']>;
  price: Scalars['jsonb']['output'];
  redirect_after_payment: Scalars['Boolean']['output'];
  registered_contract_id?: Maybe<Scalars['uuid']['output']>;
  require_verified_email: Scalars['Boolean']['output'];
  /** An object relationship */
  seller: Seller;
  seller_twitter_handle?: Maybe<Scalars['String']['output']>;
  should_send_transfer_completed_email: Scalars['Boolean']['output'];
  sponsored_fees: Scalars['Boolean']['output'];
  success_callback_url?: Maybe<Scalars['String']['output']>;
  thirdweb_client_id?: Maybe<Scalars['String']['output']>;
  token_id?: Maybe<Scalars['String']['output']>;
  use_paper_access_key: Scalars['Boolean']['output'];
  webhook_urls: Scalars['jsonb']['output'];
};


/** columns and relationships of "checkout" */
export type CheckoutContract_ArgsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "checkout" */
export type CheckoutCustom_AbiArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "checkout" */
export type CheckoutFloat_Wallet_AddressesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "checkout" */
export type CheckoutPriceArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "checkout" */
export type CheckoutWebhook_UrlsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "checkout_active_error" */
export type Checkout_Active_Error = {
  __typename?: 'checkout_active_error';
  condition: Scalars['jsonb']['output'];
  display_type: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  message: Scalars['String']['output'];
};


/** columns and relationships of "checkout_active_error" */
export type Checkout_Active_ErrorConditionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "checkout_active_error" */
export type Checkout_Active_Error_Aggregate = {
  __typename?: 'checkout_active_error_aggregate';
  aggregate?: Maybe<Checkout_Active_Error_Aggregate_Fields>;
  nodes: Array<Checkout_Active_Error>;
};

/** aggregate fields of "checkout_active_error" */
export type Checkout_Active_Error_Aggregate_Fields = {
  __typename?: 'checkout_active_error_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Checkout_Active_Error_Max_Fields>;
  min?: Maybe<Checkout_Active_Error_Min_Fields>;
};


/** aggregate fields of "checkout_active_error" */
export type Checkout_Active_Error_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Checkout_Active_Error_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Checkout_Active_Error_Append_Input = {
  condition?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "checkout_active_error". All fields are combined with a logical 'AND'. */
export type Checkout_Active_Error_Bool_Exp = {
  _and?: InputMaybe<Array<Checkout_Active_Error_Bool_Exp>>;
  _not?: InputMaybe<Checkout_Active_Error_Bool_Exp>;
  _or?: InputMaybe<Array<Checkout_Active_Error_Bool_Exp>>;
  condition?: InputMaybe<Jsonb_Comparison_Exp>;
  display_type?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "checkout_active_error" */
export enum Checkout_Active_Error_Constraint {
  /** unique or primary key constraint on columns "id" */
  CheckoutActiveErrorsPkey = 'checkout_active_errors_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Checkout_Active_Error_Delete_At_Path_Input = {
  condition?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Checkout_Active_Error_Delete_Elem_Input = {
  condition?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Checkout_Active_Error_Delete_Key_Input = {
  condition?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "checkout_active_error" */
export type Checkout_Active_Error_Insert_Input = {
  condition?: InputMaybe<Scalars['jsonb']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Checkout_Active_Error_Max_Fields = {
  __typename?: 'checkout_active_error_max_fields';
  display_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Checkout_Active_Error_Min_Fields = {
  __typename?: 'checkout_active_error_min_fields';
  display_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "checkout_active_error" */
export type Checkout_Active_Error_Mutation_Response = {
  __typename?: 'checkout_active_error_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Checkout_Active_Error>;
};

/** on_conflict condition type for table "checkout_active_error" */
export type Checkout_Active_Error_On_Conflict = {
  constraint: Checkout_Active_Error_Constraint;
  update_columns?: Array<Checkout_Active_Error_Update_Column>;
  where?: InputMaybe<Checkout_Active_Error_Bool_Exp>;
};

/** Ordering options when selecting data from "checkout_active_error". */
export type Checkout_Active_Error_Order_By = {
  condition?: InputMaybe<Order_By>;
  display_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
};

/** primary key columns input for table: checkout_active_error */
export type Checkout_Active_Error_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Checkout_Active_Error_Prepend_Input = {
  condition?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "checkout_active_error" */
export enum Checkout_Active_Error_Select_Column {
  /** column name */
  Condition = 'condition',
  /** column name */
  DisplayType = 'display_type',
  /** column name */
  Id = 'id',
  /** column name */
  Message = 'message'
}

/** input type for updating data in table "checkout_active_error" */
export type Checkout_Active_Error_Set_Input = {
  condition?: InputMaybe<Scalars['jsonb']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "checkout_active_error" */
export type Checkout_Active_Error_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Checkout_Active_Error_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Checkout_Active_Error_Stream_Cursor_Value_Input = {
  condition?: InputMaybe<Scalars['jsonb']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "checkout_active_error" */
export enum Checkout_Active_Error_Update_Column {
  /** column name */
  Condition = 'condition',
  /** column name */
  DisplayType = 'display_type',
  /** column name */
  Id = 'id',
  /** column name */
  Message = 'message'
}

export type Checkout_Active_Error_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Checkout_Active_Error_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Checkout_Active_Error_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Checkout_Active_Error_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Checkout_Active_Error_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Checkout_Active_Error_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Checkout_Active_Error_Set_Input>;
  /** filter the rows which have to be updated */
  where: Checkout_Active_Error_Bool_Exp;
};

/** aggregated selection of "checkout" */
export type Checkout_Aggregate = {
  __typename?: 'checkout_aggregate';
  aggregate?: Maybe<Checkout_Aggregate_Fields>;
  nodes: Array<Checkout>;
};

export type Checkout_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Checkout_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Checkout_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Checkout_Aggregate_Bool_Exp_Count>;
};

export type Checkout_Aggregate_Bool_Exp_Bool_And = {
  arguments: Checkout_Select_Column_Checkout_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Checkout_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Checkout_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Checkout_Select_Column_Checkout_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Checkout_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Checkout_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Checkout_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Checkout_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "checkout" */
export type Checkout_Aggregate_Fields = {
  __typename?: 'checkout_aggregate_fields';
  avg?: Maybe<Checkout_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Checkout_Max_Fields>;
  min?: Maybe<Checkout_Min_Fields>;
  stddev?: Maybe<Checkout_Stddev_Fields>;
  stddev_pop?: Maybe<Checkout_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Checkout_Stddev_Samp_Fields>;
  sum?: Maybe<Checkout_Sum_Fields>;
  var_pop?: Maybe<Checkout_Var_Pop_Fields>;
  var_samp?: Maybe<Checkout_Var_Samp_Fields>;
  variance?: Maybe<Checkout_Variance_Fields>;
};


/** aggregate fields of "checkout" */
export type Checkout_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Checkout_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "checkout" */
export type Checkout_Aggregate_Order_By = {
  avg?: InputMaybe<Checkout_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Checkout_Max_Order_By>;
  min?: InputMaybe<Checkout_Min_Order_By>;
  stddev?: InputMaybe<Checkout_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Checkout_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Checkout_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Checkout_Sum_Order_By>;
  var_pop?: InputMaybe<Checkout_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Checkout_Var_Samp_Order_By>;
  variance?: InputMaybe<Checkout_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Checkout_Append_Input = {
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  custom_abi?: InputMaybe<Scalars['jsonb']['input']>;
  float_wallet_addresses?: InputMaybe<Scalars['jsonb']['input']>;
  price?: InputMaybe<Scalars['jsonb']['input']>;
  webhook_urls?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "checkout" */
export type Checkout_Arr_Rel_Insert_Input = {
  data: Array<Checkout_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Checkout_On_Conflict>;
};

/** aggregate avg on columns */
export type Checkout_Avg_Fields = {
  __typename?: 'checkout_avg_fields';
  limit_per_transaction?: Maybe<Scalars['Float']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "checkout" */
export type Checkout_Avg_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "checkout". All fields are combined with a logical 'AND'. */
export type Checkout_Bool_Exp = {
  _and?: InputMaybe<Array<Checkout_Bool_Exp>>;
  _not?: InputMaybe<Checkout_Bool_Exp>;
  _or?: InputMaybe<Array<Checkout_Bool_Exp>>;
  brand_button_shape?: InputMaybe<String_Comparison_Exp>;
  brand_color_scheme?: InputMaybe<String_Comparison_Exp>;
  brand_dark_mode?: InputMaybe<Boolean_Comparison_Exp>;
  bundle_address?: InputMaybe<String_Comparison_Exp>;
  cancel_callback_url?: InputMaybe<String_Comparison_Exp>;
  card_payments_vendor?: InputMaybe<String_Comparison_Exp>;
  collection_description?: InputMaybe<String_Comparison_Exp>;
  collection_title?: InputMaybe<String_Comparison_Exp>;
  contract?: InputMaybe<Contract_Bool_Exp>;
  contract_address?: InputMaybe<String_Comparison_Exp>;
  contract_args?: InputMaybe<Jsonb_Comparison_Exp>;
  contract_chain?: InputMaybe<String_Comparison_Exp>;
  contract_type?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  custom_abi?: InputMaybe<Jsonb_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  float_wallet_addresses?: InputMaybe<Jsonb_Comparison_Exp>;
  generated_by_registered_contract?: InputMaybe<Boolean_Comparison_Exp>;
  has_public_link?: InputMaybe<Boolean_Comparison_Exp>;
  hide_connect_external_wallet?: InputMaybe<Boolean_Comparison_Exp>;
  hide_connect_paper_wallet?: InputMaybe<Boolean_Comparison_Exp>;
  hide_native_mint?: InputMaybe<Boolean_Comparison_Exp>;
  hide_pay_with_afterpay?: InputMaybe<Boolean_Comparison_Exp>;
  hide_pay_with_bank?: InputMaybe<Boolean_Comparison_Exp>;
  hide_pay_with_card?: InputMaybe<Boolean_Comparison_Exp>;
  hide_pay_with_crypto?: InputMaybe<Boolean_Comparison_Exp>;
  hide_pay_with_ideal?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  image_url?: InputMaybe<String_Comparison_Exp>;
  limit_per_transaction?: InputMaybe<Int_Comparison_Exp>;
  limit_per_wallet_address?: InputMaybe<Int_Comparison_Exp>;
  listing_id?: InputMaybe<String_Comparison_Exp>;
  mint_abi_function_name?: InputMaybe<String_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  pack_address?: InputMaybe<String_Comparison_Exp>;
  pack_id?: InputMaybe<String_Comparison_Exp>;
  post_purchase_button_text?: InputMaybe<String_Comparison_Exp>;
  post_purchase_message_markdown?: InputMaybe<String_Comparison_Exp>;
  price?: InputMaybe<Jsonb_Comparison_Exp>;
  redirect_after_payment?: InputMaybe<Boolean_Comparison_Exp>;
  registered_contract_id?: InputMaybe<Uuid_Comparison_Exp>;
  require_verified_email?: InputMaybe<Boolean_Comparison_Exp>;
  seller?: InputMaybe<Seller_Bool_Exp>;
  seller_twitter_handle?: InputMaybe<String_Comparison_Exp>;
  should_send_transfer_completed_email?: InputMaybe<Boolean_Comparison_Exp>;
  sponsored_fees?: InputMaybe<Boolean_Comparison_Exp>;
  success_callback_url?: InputMaybe<String_Comparison_Exp>;
  thirdweb_client_id?: InputMaybe<String_Comparison_Exp>;
  token_id?: InputMaybe<String_Comparison_Exp>;
  use_paper_access_key?: InputMaybe<Boolean_Comparison_Exp>;
  webhook_urls?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "checkout" */
export enum Checkout_Constraint {
  /** unique or primary key constraint on columns "id" */
  CheckoutPkey = 'checkout_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Checkout_Delete_At_Path_Input = {
  contract_args?: InputMaybe<Array<Scalars['String']['input']>>;
  custom_abi?: InputMaybe<Array<Scalars['String']['input']>>;
  float_wallet_addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  price?: InputMaybe<Array<Scalars['String']['input']>>;
  webhook_urls?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Checkout_Delete_Elem_Input = {
  contract_args?: InputMaybe<Scalars['Int']['input']>;
  custom_abi?: InputMaybe<Scalars['Int']['input']>;
  float_wallet_addresses?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  webhook_urls?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Checkout_Delete_Key_Input = {
  contract_args?: InputMaybe<Scalars['String']['input']>;
  custom_abi?: InputMaybe<Scalars['String']['input']>;
  float_wallet_addresses?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  webhook_urls?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "checkout" */
export type Checkout_Inc_Input = {
  limit_per_transaction?: InputMaybe<Scalars['Int']['input']>;
  limit_per_wallet_address?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "checkout" */
export type Checkout_Insert_Input = {
  brand_button_shape?: InputMaybe<Scalars['String']['input']>;
  brand_color_scheme?: InputMaybe<Scalars['String']['input']>;
  brand_dark_mode?: InputMaybe<Scalars['Boolean']['input']>;
  bundle_address?: InputMaybe<Scalars['String']['input']>;
  cancel_callback_url?: InputMaybe<Scalars['String']['input']>;
  card_payments_vendor?: InputMaybe<Scalars['String']['input']>;
  collection_description?: InputMaybe<Scalars['String']['input']>;
  collection_title?: InputMaybe<Scalars['String']['input']>;
  contract?: InputMaybe<Contract_Obj_Rel_Insert_Input>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  contract_chain?: InputMaybe<Scalars['String']['input']>;
  contract_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  custom_abi?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  float_wallet_addresses?: InputMaybe<Scalars['jsonb']['input']>;
  generated_by_registered_contract?: InputMaybe<Scalars['Boolean']['input']>;
  has_public_link?: InputMaybe<Scalars['Boolean']['input']>;
  hide_connect_external_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  hide_connect_paper_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  hide_native_mint?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_afterpay?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_bank?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_card?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_crypto?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_ideal?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  limit_per_transaction?: InputMaybe<Scalars['Int']['input']>;
  limit_per_wallet_address?: InputMaybe<Scalars['Int']['input']>;
  listing_id?: InputMaybe<Scalars['String']['input']>;
  mint_abi_function_name?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  pack_address?: InputMaybe<Scalars['String']['input']>;
  pack_id?: InputMaybe<Scalars['String']['input']>;
  post_purchase_button_text?: InputMaybe<Scalars['String']['input']>;
  post_purchase_message_markdown?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['jsonb']['input']>;
  redirect_after_payment?: InputMaybe<Scalars['Boolean']['input']>;
  registered_contract_id?: InputMaybe<Scalars['uuid']['input']>;
  require_verified_email?: InputMaybe<Scalars['Boolean']['input']>;
  seller?: InputMaybe<Seller_Obj_Rel_Insert_Input>;
  seller_twitter_handle?: InputMaybe<Scalars['String']['input']>;
  should_send_transfer_completed_email?: InputMaybe<Scalars['Boolean']['input']>;
  sponsored_fees?: InputMaybe<Scalars['Boolean']['input']>;
  success_callback_url?: InputMaybe<Scalars['String']['input']>;
  thirdweb_client_id?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
  use_paper_access_key?: InputMaybe<Scalars['Boolean']['input']>;
  webhook_urls?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Checkout_Max_Fields = {
  __typename?: 'checkout_max_fields';
  brand_button_shape?: Maybe<Scalars['String']['output']>;
  brand_color_scheme?: Maybe<Scalars['String']['output']>;
  bundle_address?: Maybe<Scalars['String']['output']>;
  cancel_callback_url?: Maybe<Scalars['String']['output']>;
  card_payments_vendor?: Maybe<Scalars['String']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  contract_address?: Maybe<Scalars['String']['output']>;
  contract_chain?: Maybe<Scalars['String']['output']>;
  contract_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  limit_per_transaction?: Maybe<Scalars['Int']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Int']['output']>;
  listing_id?: Maybe<Scalars['String']['output']>;
  mint_abi_function_name?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  pack_address?: Maybe<Scalars['String']['output']>;
  pack_id?: Maybe<Scalars['String']['output']>;
  post_purchase_button_text?: Maybe<Scalars['String']['output']>;
  post_purchase_message_markdown?: Maybe<Scalars['String']['output']>;
  registered_contract_id?: Maybe<Scalars['uuid']['output']>;
  seller_twitter_handle?: Maybe<Scalars['String']['output']>;
  success_callback_url?: Maybe<Scalars['String']['output']>;
  thirdweb_client_id?: Maybe<Scalars['String']['output']>;
  token_id?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "checkout" */
export type Checkout_Max_Order_By = {
  brand_button_shape?: InputMaybe<Order_By>;
  brand_color_scheme?: InputMaybe<Order_By>;
  bundle_address?: InputMaybe<Order_By>;
  cancel_callback_url?: InputMaybe<Order_By>;
  card_payments_vendor?: InputMaybe<Order_By>;
  collection_description?: InputMaybe<Order_By>;
  collection_title?: InputMaybe<Order_By>;
  contract_address?: InputMaybe<Order_By>;
  contract_chain?: InputMaybe<Order_By>;
  contract_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  image_url?: InputMaybe<Order_By>;
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
  listing_id?: InputMaybe<Order_By>;
  mint_abi_function_name?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  pack_address?: InputMaybe<Order_By>;
  pack_id?: InputMaybe<Order_By>;
  post_purchase_button_text?: InputMaybe<Order_By>;
  post_purchase_message_markdown?: InputMaybe<Order_By>;
  registered_contract_id?: InputMaybe<Order_By>;
  seller_twitter_handle?: InputMaybe<Order_By>;
  success_callback_url?: InputMaybe<Order_By>;
  thirdweb_client_id?: InputMaybe<Order_By>;
  token_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Checkout_Min_Fields = {
  __typename?: 'checkout_min_fields';
  brand_button_shape?: Maybe<Scalars['String']['output']>;
  brand_color_scheme?: Maybe<Scalars['String']['output']>;
  bundle_address?: Maybe<Scalars['String']['output']>;
  cancel_callback_url?: Maybe<Scalars['String']['output']>;
  card_payments_vendor?: Maybe<Scalars['String']['output']>;
  collection_description?: Maybe<Scalars['String']['output']>;
  collection_title?: Maybe<Scalars['String']['output']>;
  contract_address?: Maybe<Scalars['String']['output']>;
  contract_chain?: Maybe<Scalars['String']['output']>;
  contract_type?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  limit_per_transaction?: Maybe<Scalars['Int']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Int']['output']>;
  listing_id?: Maybe<Scalars['String']['output']>;
  mint_abi_function_name?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  pack_address?: Maybe<Scalars['String']['output']>;
  pack_id?: Maybe<Scalars['String']['output']>;
  post_purchase_button_text?: Maybe<Scalars['String']['output']>;
  post_purchase_message_markdown?: Maybe<Scalars['String']['output']>;
  registered_contract_id?: Maybe<Scalars['uuid']['output']>;
  seller_twitter_handle?: Maybe<Scalars['String']['output']>;
  success_callback_url?: Maybe<Scalars['String']['output']>;
  thirdweb_client_id?: Maybe<Scalars['String']['output']>;
  token_id?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "checkout" */
export type Checkout_Min_Order_By = {
  brand_button_shape?: InputMaybe<Order_By>;
  brand_color_scheme?: InputMaybe<Order_By>;
  bundle_address?: InputMaybe<Order_By>;
  cancel_callback_url?: InputMaybe<Order_By>;
  card_payments_vendor?: InputMaybe<Order_By>;
  collection_description?: InputMaybe<Order_By>;
  collection_title?: InputMaybe<Order_By>;
  contract_address?: InputMaybe<Order_By>;
  contract_chain?: InputMaybe<Order_By>;
  contract_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  image_url?: InputMaybe<Order_By>;
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
  listing_id?: InputMaybe<Order_By>;
  mint_abi_function_name?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  pack_address?: InputMaybe<Order_By>;
  pack_id?: InputMaybe<Order_By>;
  post_purchase_button_text?: InputMaybe<Order_By>;
  post_purchase_message_markdown?: InputMaybe<Order_By>;
  registered_contract_id?: InputMaybe<Order_By>;
  seller_twitter_handle?: InputMaybe<Order_By>;
  success_callback_url?: InputMaybe<Order_By>;
  thirdweb_client_id?: InputMaybe<Order_By>;
  token_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "checkout" */
export type Checkout_Mutation_Response = {
  __typename?: 'checkout_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Checkout>;
};

/** input type for inserting object relation for remote table "checkout" */
export type Checkout_Obj_Rel_Insert_Input = {
  data: Checkout_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Checkout_On_Conflict>;
};

/** on_conflict condition type for table "checkout" */
export type Checkout_On_Conflict = {
  constraint: Checkout_Constraint;
  update_columns?: Array<Checkout_Update_Column>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};

/** Ordering options when selecting data from "checkout". */
export type Checkout_Order_By = {
  brand_button_shape?: InputMaybe<Order_By>;
  brand_color_scheme?: InputMaybe<Order_By>;
  brand_dark_mode?: InputMaybe<Order_By>;
  bundle_address?: InputMaybe<Order_By>;
  cancel_callback_url?: InputMaybe<Order_By>;
  card_payments_vendor?: InputMaybe<Order_By>;
  collection_description?: InputMaybe<Order_By>;
  collection_title?: InputMaybe<Order_By>;
  contract?: InputMaybe<Contract_Order_By>;
  contract_address?: InputMaybe<Order_By>;
  contract_args?: InputMaybe<Order_By>;
  contract_chain?: InputMaybe<Order_By>;
  contract_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  custom_abi?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  float_wallet_addresses?: InputMaybe<Order_By>;
  generated_by_registered_contract?: InputMaybe<Order_By>;
  has_public_link?: InputMaybe<Order_By>;
  hide_connect_external_wallet?: InputMaybe<Order_By>;
  hide_connect_paper_wallet?: InputMaybe<Order_By>;
  hide_native_mint?: InputMaybe<Order_By>;
  hide_pay_with_afterpay?: InputMaybe<Order_By>;
  hide_pay_with_bank?: InputMaybe<Order_By>;
  hide_pay_with_card?: InputMaybe<Order_By>;
  hide_pay_with_crypto?: InputMaybe<Order_By>;
  hide_pay_with_ideal?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  image_url?: InputMaybe<Order_By>;
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
  listing_id?: InputMaybe<Order_By>;
  mint_abi_function_name?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  pack_address?: InputMaybe<Order_By>;
  pack_id?: InputMaybe<Order_By>;
  post_purchase_button_text?: InputMaybe<Order_By>;
  post_purchase_message_markdown?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  redirect_after_payment?: InputMaybe<Order_By>;
  registered_contract_id?: InputMaybe<Order_By>;
  require_verified_email?: InputMaybe<Order_By>;
  seller?: InputMaybe<Seller_Order_By>;
  seller_twitter_handle?: InputMaybe<Order_By>;
  should_send_transfer_completed_email?: InputMaybe<Order_By>;
  sponsored_fees?: InputMaybe<Order_By>;
  success_callback_url?: InputMaybe<Order_By>;
  thirdweb_client_id?: InputMaybe<Order_By>;
  token_id?: InputMaybe<Order_By>;
  use_paper_access_key?: InputMaybe<Order_By>;
  webhook_urls?: InputMaybe<Order_By>;
};

/** primary key columns input for table: checkout */
export type Checkout_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Checkout_Prepend_Input = {
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  custom_abi?: InputMaybe<Scalars['jsonb']['input']>;
  float_wallet_addresses?: InputMaybe<Scalars['jsonb']['input']>;
  price?: InputMaybe<Scalars['jsonb']['input']>;
  webhook_urls?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "checkout" */
export enum Checkout_Select_Column {
  /** column name */
  BrandButtonShape = 'brand_button_shape',
  /** column name */
  BrandColorScheme = 'brand_color_scheme',
  /** column name */
  BrandDarkMode = 'brand_dark_mode',
  /** column name */
  BundleAddress = 'bundle_address',
  /** column name */
  CancelCallbackUrl = 'cancel_callback_url',
  /** column name */
  CardPaymentsVendor = 'card_payments_vendor',
  /** column name */
  CollectionDescription = 'collection_description',
  /** column name */
  CollectionTitle = 'collection_title',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractArgs = 'contract_args',
  /** column name */
  ContractChain = 'contract_chain',
  /** column name */
  ContractType = 'contract_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomAbi = 'custom_abi',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FloatWalletAddresses = 'float_wallet_addresses',
  /** column name */
  GeneratedByRegisteredContract = 'generated_by_registered_contract',
  /** column name */
  HasPublicLink = 'has_public_link',
  /** column name */
  HideConnectExternalWallet = 'hide_connect_external_wallet',
  /** column name */
  HideConnectPaperWallet = 'hide_connect_paper_wallet',
  /** column name */
  HideNativeMint = 'hide_native_mint',
  /** column name */
  HidePayWithAfterpay = 'hide_pay_with_afterpay',
  /** column name */
  HidePayWithBank = 'hide_pay_with_bank',
  /** column name */
  HidePayWithCard = 'hide_pay_with_card',
  /** column name */
  HidePayWithCrypto = 'hide_pay_with_crypto',
  /** column name */
  HidePayWithIdeal = 'hide_pay_with_ideal',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  LimitPerTransaction = 'limit_per_transaction',
  /** column name */
  LimitPerWalletAddress = 'limit_per_wallet_address',
  /** column name */
  ListingId = 'listing_id',
  /** column name */
  MintAbiFunctionName = 'mint_abi_function_name',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PackAddress = 'pack_address',
  /** column name */
  PackId = 'pack_id',
  /** column name */
  PostPurchaseButtonText = 'post_purchase_button_text',
  /** column name */
  PostPurchaseMessageMarkdown = 'post_purchase_message_markdown',
  /** column name */
  Price = 'price',
  /** column name */
  RedirectAfterPayment = 'redirect_after_payment',
  /** column name */
  RegisteredContractId = 'registered_contract_id',
  /** column name */
  RequireVerifiedEmail = 'require_verified_email',
  /** column name */
  SellerTwitterHandle = 'seller_twitter_handle',
  /** column name */
  ShouldSendTransferCompletedEmail = 'should_send_transfer_completed_email',
  /** column name */
  SponsoredFees = 'sponsored_fees',
  /** column name */
  SuccessCallbackUrl = 'success_callback_url',
  /** column name */
  ThirdwebClientId = 'thirdweb_client_id',
  /** column name */
  TokenId = 'token_id',
  /** column name */
  UsePaperAccessKey = 'use_paper_access_key',
  /** column name */
  WebhookUrls = 'webhook_urls'
}

/** select "checkout_aggregate_bool_exp_bool_and_arguments_columns" columns of table "checkout" */
export enum Checkout_Select_Column_Checkout_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  BrandDarkMode = 'brand_dark_mode',
  /** column name */
  GeneratedByRegisteredContract = 'generated_by_registered_contract',
  /** column name */
  HasPublicLink = 'has_public_link',
  /** column name */
  HideConnectExternalWallet = 'hide_connect_external_wallet',
  /** column name */
  HideConnectPaperWallet = 'hide_connect_paper_wallet',
  /** column name */
  HideNativeMint = 'hide_native_mint',
  /** column name */
  HidePayWithAfterpay = 'hide_pay_with_afterpay',
  /** column name */
  HidePayWithBank = 'hide_pay_with_bank',
  /** column name */
  HidePayWithCard = 'hide_pay_with_card',
  /** column name */
  HidePayWithCrypto = 'hide_pay_with_crypto',
  /** column name */
  HidePayWithIdeal = 'hide_pay_with_ideal',
  /** column name */
  RedirectAfterPayment = 'redirect_after_payment',
  /** column name */
  RequireVerifiedEmail = 'require_verified_email',
  /** column name */
  ShouldSendTransferCompletedEmail = 'should_send_transfer_completed_email',
  /** column name */
  SponsoredFees = 'sponsored_fees',
  /** column name */
  UsePaperAccessKey = 'use_paper_access_key'
}

/** select "checkout_aggregate_bool_exp_bool_or_arguments_columns" columns of table "checkout" */
export enum Checkout_Select_Column_Checkout_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  BrandDarkMode = 'brand_dark_mode',
  /** column name */
  GeneratedByRegisteredContract = 'generated_by_registered_contract',
  /** column name */
  HasPublicLink = 'has_public_link',
  /** column name */
  HideConnectExternalWallet = 'hide_connect_external_wallet',
  /** column name */
  HideConnectPaperWallet = 'hide_connect_paper_wallet',
  /** column name */
  HideNativeMint = 'hide_native_mint',
  /** column name */
  HidePayWithAfterpay = 'hide_pay_with_afterpay',
  /** column name */
  HidePayWithBank = 'hide_pay_with_bank',
  /** column name */
  HidePayWithCard = 'hide_pay_with_card',
  /** column name */
  HidePayWithCrypto = 'hide_pay_with_crypto',
  /** column name */
  HidePayWithIdeal = 'hide_pay_with_ideal',
  /** column name */
  RedirectAfterPayment = 'redirect_after_payment',
  /** column name */
  RequireVerifiedEmail = 'require_verified_email',
  /** column name */
  ShouldSendTransferCompletedEmail = 'should_send_transfer_completed_email',
  /** column name */
  SponsoredFees = 'sponsored_fees',
  /** column name */
  UsePaperAccessKey = 'use_paper_access_key'
}

/** input type for updating data in table "checkout" */
export type Checkout_Set_Input = {
  brand_button_shape?: InputMaybe<Scalars['String']['input']>;
  brand_color_scheme?: InputMaybe<Scalars['String']['input']>;
  brand_dark_mode?: InputMaybe<Scalars['Boolean']['input']>;
  bundle_address?: InputMaybe<Scalars['String']['input']>;
  cancel_callback_url?: InputMaybe<Scalars['String']['input']>;
  card_payments_vendor?: InputMaybe<Scalars['String']['input']>;
  collection_description?: InputMaybe<Scalars['String']['input']>;
  collection_title?: InputMaybe<Scalars['String']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  contract_chain?: InputMaybe<Scalars['String']['input']>;
  contract_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  custom_abi?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  float_wallet_addresses?: InputMaybe<Scalars['jsonb']['input']>;
  generated_by_registered_contract?: InputMaybe<Scalars['Boolean']['input']>;
  has_public_link?: InputMaybe<Scalars['Boolean']['input']>;
  hide_connect_external_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  hide_connect_paper_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  hide_native_mint?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_afterpay?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_bank?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_card?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_crypto?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_ideal?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  limit_per_transaction?: InputMaybe<Scalars['Int']['input']>;
  limit_per_wallet_address?: InputMaybe<Scalars['Int']['input']>;
  listing_id?: InputMaybe<Scalars['String']['input']>;
  mint_abi_function_name?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  pack_address?: InputMaybe<Scalars['String']['input']>;
  pack_id?: InputMaybe<Scalars['String']['input']>;
  post_purchase_button_text?: InputMaybe<Scalars['String']['input']>;
  post_purchase_message_markdown?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['jsonb']['input']>;
  redirect_after_payment?: InputMaybe<Scalars['Boolean']['input']>;
  registered_contract_id?: InputMaybe<Scalars['uuid']['input']>;
  require_verified_email?: InputMaybe<Scalars['Boolean']['input']>;
  seller_twitter_handle?: InputMaybe<Scalars['String']['input']>;
  should_send_transfer_completed_email?: InputMaybe<Scalars['Boolean']['input']>;
  sponsored_fees?: InputMaybe<Scalars['Boolean']['input']>;
  success_callback_url?: InputMaybe<Scalars['String']['input']>;
  thirdweb_client_id?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
  use_paper_access_key?: InputMaybe<Scalars['Boolean']['input']>;
  webhook_urls?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate stddev on columns */
export type Checkout_Stddev_Fields = {
  __typename?: 'checkout_stddev_fields';
  limit_per_transaction?: Maybe<Scalars['Float']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "checkout" */
export type Checkout_Stddev_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Checkout_Stddev_Pop_Fields = {
  __typename?: 'checkout_stddev_pop_fields';
  limit_per_transaction?: Maybe<Scalars['Float']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "checkout" */
export type Checkout_Stddev_Pop_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Checkout_Stddev_Samp_Fields = {
  __typename?: 'checkout_stddev_samp_fields';
  limit_per_transaction?: Maybe<Scalars['Float']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "checkout" */
export type Checkout_Stddev_Samp_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "checkout" */
export type Checkout_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Checkout_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Checkout_Stream_Cursor_Value_Input = {
  brand_button_shape?: InputMaybe<Scalars['String']['input']>;
  brand_color_scheme?: InputMaybe<Scalars['String']['input']>;
  brand_dark_mode?: InputMaybe<Scalars['Boolean']['input']>;
  bundle_address?: InputMaybe<Scalars['String']['input']>;
  cancel_callback_url?: InputMaybe<Scalars['String']['input']>;
  card_payments_vendor?: InputMaybe<Scalars['String']['input']>;
  collection_description?: InputMaybe<Scalars['String']['input']>;
  collection_title?: InputMaybe<Scalars['String']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  contract_chain?: InputMaybe<Scalars['String']['input']>;
  contract_type?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  custom_abi?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  float_wallet_addresses?: InputMaybe<Scalars['jsonb']['input']>;
  generated_by_registered_contract?: InputMaybe<Scalars['Boolean']['input']>;
  has_public_link?: InputMaybe<Scalars['Boolean']['input']>;
  hide_connect_external_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  hide_connect_paper_wallet?: InputMaybe<Scalars['Boolean']['input']>;
  hide_native_mint?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_afterpay?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_bank?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_card?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_crypto?: InputMaybe<Scalars['Boolean']['input']>;
  hide_pay_with_ideal?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  limit_per_transaction?: InputMaybe<Scalars['Int']['input']>;
  limit_per_wallet_address?: InputMaybe<Scalars['Int']['input']>;
  listing_id?: InputMaybe<Scalars['String']['input']>;
  mint_abi_function_name?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  pack_address?: InputMaybe<Scalars['String']['input']>;
  pack_id?: InputMaybe<Scalars['String']['input']>;
  post_purchase_button_text?: InputMaybe<Scalars['String']['input']>;
  post_purchase_message_markdown?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['jsonb']['input']>;
  redirect_after_payment?: InputMaybe<Scalars['Boolean']['input']>;
  registered_contract_id?: InputMaybe<Scalars['uuid']['input']>;
  require_verified_email?: InputMaybe<Scalars['Boolean']['input']>;
  seller_twitter_handle?: InputMaybe<Scalars['String']['input']>;
  should_send_transfer_completed_email?: InputMaybe<Scalars['Boolean']['input']>;
  sponsored_fees?: InputMaybe<Scalars['Boolean']['input']>;
  success_callback_url?: InputMaybe<Scalars['String']['input']>;
  thirdweb_client_id?: InputMaybe<Scalars['String']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
  use_paper_access_key?: InputMaybe<Scalars['Boolean']['input']>;
  webhook_urls?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate sum on columns */
export type Checkout_Sum_Fields = {
  __typename?: 'checkout_sum_fields';
  limit_per_transaction?: Maybe<Scalars['Int']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "checkout" */
export type Checkout_Sum_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** update columns of table "checkout" */
export enum Checkout_Update_Column {
  /** column name */
  BrandButtonShape = 'brand_button_shape',
  /** column name */
  BrandColorScheme = 'brand_color_scheme',
  /** column name */
  BrandDarkMode = 'brand_dark_mode',
  /** column name */
  BundleAddress = 'bundle_address',
  /** column name */
  CancelCallbackUrl = 'cancel_callback_url',
  /** column name */
  CardPaymentsVendor = 'card_payments_vendor',
  /** column name */
  CollectionDescription = 'collection_description',
  /** column name */
  CollectionTitle = 'collection_title',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractArgs = 'contract_args',
  /** column name */
  ContractChain = 'contract_chain',
  /** column name */
  ContractType = 'contract_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomAbi = 'custom_abi',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FloatWalletAddresses = 'float_wallet_addresses',
  /** column name */
  GeneratedByRegisteredContract = 'generated_by_registered_contract',
  /** column name */
  HasPublicLink = 'has_public_link',
  /** column name */
  HideConnectExternalWallet = 'hide_connect_external_wallet',
  /** column name */
  HideConnectPaperWallet = 'hide_connect_paper_wallet',
  /** column name */
  HideNativeMint = 'hide_native_mint',
  /** column name */
  HidePayWithAfterpay = 'hide_pay_with_afterpay',
  /** column name */
  HidePayWithBank = 'hide_pay_with_bank',
  /** column name */
  HidePayWithCard = 'hide_pay_with_card',
  /** column name */
  HidePayWithCrypto = 'hide_pay_with_crypto',
  /** column name */
  HidePayWithIdeal = 'hide_pay_with_ideal',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  LimitPerTransaction = 'limit_per_transaction',
  /** column name */
  LimitPerWalletAddress = 'limit_per_wallet_address',
  /** column name */
  ListingId = 'listing_id',
  /** column name */
  MintAbiFunctionName = 'mint_abi_function_name',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PackAddress = 'pack_address',
  /** column name */
  PackId = 'pack_id',
  /** column name */
  PostPurchaseButtonText = 'post_purchase_button_text',
  /** column name */
  PostPurchaseMessageMarkdown = 'post_purchase_message_markdown',
  /** column name */
  Price = 'price',
  /** column name */
  RedirectAfterPayment = 'redirect_after_payment',
  /** column name */
  RegisteredContractId = 'registered_contract_id',
  /** column name */
  RequireVerifiedEmail = 'require_verified_email',
  /** column name */
  SellerTwitterHandle = 'seller_twitter_handle',
  /** column name */
  ShouldSendTransferCompletedEmail = 'should_send_transfer_completed_email',
  /** column name */
  SponsoredFees = 'sponsored_fees',
  /** column name */
  SuccessCallbackUrl = 'success_callback_url',
  /** column name */
  ThirdwebClientId = 'thirdweb_client_id',
  /** column name */
  TokenId = 'token_id',
  /** column name */
  UsePaperAccessKey = 'use_paper_access_key',
  /** column name */
  WebhookUrls = 'webhook_urls'
}

export type Checkout_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Checkout_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Checkout_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Checkout_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Checkout_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Checkout_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Checkout_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Checkout_Set_Input>;
  /** filter the rows which have to be updated */
  where: Checkout_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Checkout_Var_Pop_Fields = {
  __typename?: 'checkout_var_pop_fields';
  limit_per_transaction?: Maybe<Scalars['Float']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "checkout" */
export type Checkout_Var_Pop_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Checkout_Var_Samp_Fields = {
  __typename?: 'checkout_var_samp_fields';
  limit_per_transaction?: Maybe<Scalars['Float']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "checkout" */
export type Checkout_Var_Samp_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Checkout_Variance_Fields = {
  __typename?: 'checkout_variance_fields';
  limit_per_transaction?: Maybe<Scalars['Float']['output']>;
  limit_per_wallet_address?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "checkout" */
export type Checkout_Variance_Order_By = {
  limit_per_transaction?: InputMaybe<Order_By>;
  limit_per_wallet_address?: InputMaybe<Order_By>;
};

/** Information about the contract that the user wants to interact with */
export type Contract = {
  __typename?: 'contract';
  address: Scalars['String']['output'];
  chain: Scalars['String']['output'];
  /** An array relationship */
  checkouts: Array<Checkout>;
  /** An aggregate relationship */
  checkouts_aggregate: Checkout_Aggregate;
  created_at: Scalars['timestamptz']['output'];
  definition: Scalars['jsonb']['output'];
  deleted_at: Scalars['timestamptz']['output'];
  display_name: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  is_airdrop: Scalars['Boolean']['output'];
  is_created_by_contract_deployer: Scalars['Boolean']['output'];
  is_fiat_payout_enabled: Scalars['Boolean']['output'];
  is_paper_managed: Scalars['Boolean']['output'];
  owner_id: Scalars['String']['output'];
  secondary_sales: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};


/** Information about the contract that the user wants to interact with */
export type ContractCheckoutsArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Order_By>>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};


/** Information about the contract that the user wants to interact with */
export type ContractCheckouts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Order_By>>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};


/** Information about the contract that the user wants to interact with */
export type ContractDefinitionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "contract" */
export type Contract_Aggregate = {
  __typename?: 'contract_aggregate';
  aggregate?: Maybe<Contract_Aggregate_Fields>;
  nodes: Array<Contract>;
};

/** aggregate fields of "contract" */
export type Contract_Aggregate_Fields = {
  __typename?: 'contract_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Contract_Max_Fields>;
  min?: Maybe<Contract_Min_Fields>;
};


/** aggregate fields of "contract" */
export type Contract_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contract_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Contract_Append_Input = {
  definition?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Contracts that are authorized to be managed by another seller. */
export type Contract_Authorized_Seller = {
  __typename?: 'contract_authorized_seller';
  authorized_seller_id: Scalars['String']['output'];
  /** An object relationship */
  contract?: Maybe<Contract>;
  contract_id: Scalars['uuid']['output'];
  granted_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  seller?: Maybe<Seller>;
};

/** aggregated selection of "contract_authorized_seller" */
export type Contract_Authorized_Seller_Aggregate = {
  __typename?: 'contract_authorized_seller_aggregate';
  aggregate?: Maybe<Contract_Authorized_Seller_Aggregate_Fields>;
  nodes: Array<Contract_Authorized_Seller>;
};

/** aggregate fields of "contract_authorized_seller" */
export type Contract_Authorized_Seller_Aggregate_Fields = {
  __typename?: 'contract_authorized_seller_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Contract_Authorized_Seller_Max_Fields>;
  min?: Maybe<Contract_Authorized_Seller_Min_Fields>;
};


/** aggregate fields of "contract_authorized_seller" */
export type Contract_Authorized_Seller_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contract_Authorized_Seller_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "contract_authorized_seller". All fields are combined with a logical 'AND'. */
export type Contract_Authorized_Seller_Bool_Exp = {
  _and?: InputMaybe<Array<Contract_Authorized_Seller_Bool_Exp>>;
  _not?: InputMaybe<Contract_Authorized_Seller_Bool_Exp>;
  _or?: InputMaybe<Array<Contract_Authorized_Seller_Bool_Exp>>;
  authorized_seller_id?: InputMaybe<String_Comparison_Exp>;
  contract?: InputMaybe<Contract_Bool_Exp>;
  contract_id?: InputMaybe<Uuid_Comparison_Exp>;
  granted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  seller?: InputMaybe<Seller_Bool_Exp>;
};

/** unique or primary key constraints on table "contract_authorized_seller" */
export enum Contract_Authorized_Seller_Constraint {
  /** unique or primary key constraint on columns "id" */
  ContractAuthorizedSellerPkey = 'contract_authorized_seller_pkey'
}

/** input type for inserting data into table "contract_authorized_seller" */
export type Contract_Authorized_Seller_Insert_Input = {
  authorized_seller_id?: InputMaybe<Scalars['String']['input']>;
  contract?: InputMaybe<Contract_Obj_Rel_Insert_Input>;
  contract_id?: InputMaybe<Scalars['uuid']['input']>;
  granted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  seller?: InputMaybe<Seller_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Contract_Authorized_Seller_Max_Fields = {
  __typename?: 'contract_authorized_seller_max_fields';
  authorized_seller_id?: Maybe<Scalars['String']['output']>;
  contract_id?: Maybe<Scalars['uuid']['output']>;
  granted_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Contract_Authorized_Seller_Min_Fields = {
  __typename?: 'contract_authorized_seller_min_fields';
  authorized_seller_id?: Maybe<Scalars['String']['output']>;
  contract_id?: Maybe<Scalars['uuid']['output']>;
  granted_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "contract_authorized_seller" */
export type Contract_Authorized_Seller_Mutation_Response = {
  __typename?: 'contract_authorized_seller_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Contract_Authorized_Seller>;
};

/** on_conflict condition type for table "contract_authorized_seller" */
export type Contract_Authorized_Seller_On_Conflict = {
  constraint: Contract_Authorized_Seller_Constraint;
  update_columns?: Array<Contract_Authorized_Seller_Update_Column>;
  where?: InputMaybe<Contract_Authorized_Seller_Bool_Exp>;
};

/** Ordering options when selecting data from "contract_authorized_seller". */
export type Contract_Authorized_Seller_Order_By = {
  authorized_seller_id?: InputMaybe<Order_By>;
  contract?: InputMaybe<Contract_Order_By>;
  contract_id?: InputMaybe<Order_By>;
  granted_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  revoked_at?: InputMaybe<Order_By>;
  seller?: InputMaybe<Seller_Order_By>;
};

/** primary key columns input for table: contract_authorized_seller */
export type Contract_Authorized_Seller_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "contract_authorized_seller" */
export enum Contract_Authorized_Seller_Select_Column {
  /** column name */
  AuthorizedSellerId = 'authorized_seller_id',
  /** column name */
  ContractId = 'contract_id',
  /** column name */
  GrantedAt = 'granted_at',
  /** column name */
  Id = 'id',
  /** column name */
  RevokedAt = 'revoked_at'
}

/** input type for updating data in table "contract_authorized_seller" */
export type Contract_Authorized_Seller_Set_Input = {
  authorized_seller_id?: InputMaybe<Scalars['String']['input']>;
  contract_id?: InputMaybe<Scalars['uuid']['input']>;
  granted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "contract_authorized_seller" */
export type Contract_Authorized_Seller_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contract_Authorized_Seller_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contract_Authorized_Seller_Stream_Cursor_Value_Input = {
  authorized_seller_id?: InputMaybe<Scalars['String']['input']>;
  contract_id?: InputMaybe<Scalars['uuid']['input']>;
  granted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "contract_authorized_seller" */
export enum Contract_Authorized_Seller_Update_Column {
  /** column name */
  AuthorizedSellerId = 'authorized_seller_id',
  /** column name */
  ContractId = 'contract_id',
  /** column name */
  GrantedAt = 'granted_at',
  /** column name */
  Id = 'id',
  /** column name */
  RevokedAt = 'revoked_at'
}

export type Contract_Authorized_Seller_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contract_Authorized_Seller_Set_Input>;
  /** filter the rows which have to be updated */
  where: Contract_Authorized_Seller_Bool_Exp;
};

/** Boolean expression to filter rows from the table "contract". All fields are combined with a logical 'AND'. */
export type Contract_Bool_Exp = {
  _and?: InputMaybe<Array<Contract_Bool_Exp>>;
  _not?: InputMaybe<Contract_Bool_Exp>;
  _or?: InputMaybe<Array<Contract_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chain?: InputMaybe<String_Comparison_Exp>;
  checkouts?: InputMaybe<Checkout_Bool_Exp>;
  checkouts_aggregate?: InputMaybe<Checkout_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  definition?: InputMaybe<Jsonb_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  display_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_airdrop?: InputMaybe<Boolean_Comparison_Exp>;
  is_created_by_contract_deployer?: InputMaybe<Boolean_Comparison_Exp>;
  is_fiat_payout_enabled?: InputMaybe<Boolean_Comparison_Exp>;
  is_paper_managed?: InputMaybe<Boolean_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  secondary_sales?: InputMaybe<Boolean_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "contract" */
export enum Contract_Constraint {
  /** unique or primary key constraint on columns "address", "deleted_at", "chain", "owner_id" */
  ContractChainOwnerIdAddressDeletedAtKey = 'contract_chain_owner_id_address_deleted_at_key',
  /** unique or primary key constraint on columns "id" */
  ContractIdKey = 'contract_id_key',
  /** unique or primary key constraint on columns "id" */
  ContractPkey = 'contract_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Contract_Delete_At_Path_Input = {
  definition?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Contract_Delete_Elem_Input = {
  definition?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Contract_Delete_Key_Input = {
  definition?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "contract" */
export type Contract_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  checkouts?: InputMaybe<Checkout_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  definition?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_airdrop?: InputMaybe<Scalars['Boolean']['input']>;
  is_created_by_contract_deployer?: InputMaybe<Scalars['Boolean']['input']>;
  is_fiat_payout_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  is_paper_managed?: InputMaybe<Scalars['Boolean']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  secondary_sales?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Contract_Max_Fields = {
  __typename?: 'contract_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Contract_Min_Fields = {
  __typename?: 'contract_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "contract" */
export type Contract_Mutation_Response = {
  __typename?: 'contract_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Contract>;
};

/** input type for inserting object relation for remote table "contract" */
export type Contract_Obj_Rel_Insert_Input = {
  data: Contract_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Contract_On_Conflict>;
};

/** on_conflict condition type for table "contract" */
export type Contract_On_Conflict = {
  constraint: Contract_Constraint;
  update_columns?: Array<Contract_Update_Column>;
  where?: InputMaybe<Contract_Bool_Exp>;
};

/** Ordering options when selecting data from "contract". */
export type Contract_Order_By = {
  address?: InputMaybe<Order_By>;
  chain?: InputMaybe<Order_By>;
  checkouts_aggregate?: InputMaybe<Checkout_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  definition?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  display_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_airdrop?: InputMaybe<Order_By>;
  is_created_by_contract_deployer?: InputMaybe<Order_By>;
  is_fiat_payout_enabled?: InputMaybe<Order_By>;
  is_paper_managed?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  secondary_sales?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: contract */
export type Contract_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Contract_Prepend_Input = {
  definition?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "contract" */
export enum Contract_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Chain = 'chain',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Definition = 'definition',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DisplayName = 'display_name',
  /** column name */
  Id = 'id',
  /** column name */
  IsAirdrop = 'is_airdrop',
  /** column name */
  IsCreatedByContractDeployer = 'is_created_by_contract_deployer',
  /** column name */
  IsFiatPayoutEnabled = 'is_fiat_payout_enabled',
  /** column name */
  IsPaperManaged = 'is_paper_managed',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  SecondarySales = 'secondary_sales',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "contract" */
export type Contract_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  definition?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_airdrop?: InputMaybe<Scalars['Boolean']['input']>;
  is_created_by_contract_deployer?: InputMaybe<Scalars['Boolean']['input']>;
  is_fiat_payout_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  is_paper_managed?: InputMaybe<Scalars['Boolean']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  secondary_sales?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "contract" */
export type Contract_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Contract_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Contract_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  definition?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_airdrop?: InputMaybe<Scalars['Boolean']['input']>;
  is_created_by_contract_deployer?: InputMaybe<Scalars['Boolean']['input']>;
  is_fiat_payout_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  is_paper_managed?: InputMaybe<Scalars['Boolean']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  secondary_sales?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "contract" */
export enum Contract_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Chain = 'chain',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Definition = 'definition',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DisplayName = 'display_name',
  /** column name */
  Id = 'id',
  /** column name */
  IsAirdrop = 'is_airdrop',
  /** column name */
  IsCreatedByContractDeployer = 'is_created_by_contract_deployer',
  /** column name */
  IsFiatPayoutEnabled = 'is_fiat_payout_enabled',
  /** column name */
  IsPaperManaged = 'is_paper_managed',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  SecondarySales = 'secondary_sales',
  /** column name */
  Type = 'type'
}

export type Contract_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Contract_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Contract_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Contract_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Contract_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Contract_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Contract_Set_Input>;
  /** filter the rows which have to be updated */
  where: Contract_Bool_Exp;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "customer" */
export type Customer = {
  __typename?: 'customer';
  checkoutcom_customer_id?: Maybe<Scalars['String']['output']>;
  checkoutcom_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_result?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_result_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "customer" */
export type Customer_Aggregate = {
  __typename?: 'customer_aggregate';
  aggregate?: Maybe<Customer_Aggregate_Fields>;
  nodes: Array<Customer>;
};

/** aggregate fields of "customer" */
export type Customer_Aggregate_Fields = {
  __typename?: 'customer_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Customer_Max_Fields>;
  min?: Maybe<Customer_Min_Fields>;
};


/** aggregate fields of "customer" */
export type Customer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Customer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "customer". All fields are combined with a logical 'AND'. */
export type Customer_Bool_Exp = {
  _and?: InputMaybe<Array<Customer_Bool_Exp>>;
  _not?: InputMaybe<Customer_Bool_Exp>;
  _or?: InputMaybe<Array<Customer_Bool_Exp>>;
  checkoutcom_customer_id?: InputMaybe<String_Comparison_Exp>;
  checkoutcom_testmode_customer_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  stripe_customer_id?: InputMaybe<String_Comparison_Exp>;
  stripe_testmode_customer_id?: InputMaybe<String_Comparison_Exp>;
  stripe_testmode_verification_session_id?: InputMaybe<String_Comparison_Exp>;
  stripe_testmode_verification_session_result?: InputMaybe<String_Comparison_Exp>;
  stripe_testmode_verification_session_result_updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  stripe_verification_session_id?: InputMaybe<String_Comparison_Exp>;
  stripe_verification_session_result?: InputMaybe<String_Comparison_Exp>;
  stripe_verification_session_result_updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "customer" */
export enum Customer_Constraint {
  /** unique or primary key constraint on columns "email" */
  CustomerEmailKey = 'customer_email_key',
  /** unique or primary key constraint on columns "id" */
  CustomerPkey = 'customer_pkey'
}

/** input type for inserting data into table "customer" */
export type Customer_Insert_Input = {
  checkoutcom_customer_id?: InputMaybe<Scalars['String']['input']>;
  checkoutcom_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_result_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Customer_Max_Fields = {
  __typename?: 'customer_max_fields';
  checkoutcom_customer_id?: Maybe<Scalars['String']['output']>;
  checkoutcom_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_result?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_result_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Customer_Min_Fields = {
  __typename?: 'customer_min_fields';
  checkoutcom_customer_id?: Maybe<Scalars['String']['output']>;
  checkoutcom_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_result?: Maybe<Scalars['String']['output']>;
  stripe_testmode_verification_session_result_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "customer" */
export type Customer_Mutation_Response = {
  __typename?: 'customer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Customer>;
};

/** input type for inserting object relation for remote table "customer" */
export type Customer_Obj_Rel_Insert_Input = {
  data: Customer_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Customer_On_Conflict>;
};

/** on_conflict condition type for table "customer" */
export type Customer_On_Conflict = {
  constraint: Customer_Constraint;
  update_columns?: Array<Customer_Update_Column>;
  where?: InputMaybe<Customer_Bool_Exp>;
};

/** Ordering options when selecting data from "customer". */
export type Customer_Order_By = {
  checkoutcom_customer_id?: InputMaybe<Order_By>;
  checkoutcom_testmode_customer_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stripe_customer_id?: InputMaybe<Order_By>;
  stripe_testmode_customer_id?: InputMaybe<Order_By>;
  stripe_testmode_verification_session_id?: InputMaybe<Order_By>;
  stripe_testmode_verification_session_result?: InputMaybe<Order_By>;
  stripe_testmode_verification_session_result_updated_at?: InputMaybe<Order_By>;
  stripe_verification_session_id?: InputMaybe<Order_By>;
  stripe_verification_session_result?: InputMaybe<Order_By>;
  stripe_verification_session_result_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: customer */
export type Customer_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "customer" */
export enum Customer_Select_Column {
  /** column name */
  CheckoutcomCustomerId = 'checkoutcom_customer_id',
  /** column name */
  CheckoutcomTestmodeCustomerId = 'checkoutcom_testmode_customer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  StripeTestmodeCustomerId = 'stripe_testmode_customer_id',
  /** column name */
  StripeTestmodeVerificationSessionId = 'stripe_testmode_verification_session_id',
  /** column name */
  StripeTestmodeVerificationSessionResult = 'stripe_testmode_verification_session_result',
  /** column name */
  StripeTestmodeVerificationSessionResultUpdatedAt = 'stripe_testmode_verification_session_result_updated_at',
  /** column name */
  StripeVerificationSessionId = 'stripe_verification_session_id',
  /** column name */
  StripeVerificationSessionResult = 'stripe_verification_session_result',
  /** column name */
  StripeVerificationSessionResultUpdatedAt = 'stripe_verification_session_result_updated_at',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "customer" */
export type Customer_Set_Input = {
  checkoutcom_customer_id?: InputMaybe<Scalars['String']['input']>;
  checkoutcom_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_result_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "customer" */
export type Customer_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Customer_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Customer_Stream_Cursor_Value_Input = {
  checkoutcom_customer_id?: InputMaybe<Scalars['String']['input']>;
  checkoutcom_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  stripe_testmode_verification_session_result_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "customer" */
export enum Customer_Update_Column {
  /** column name */
  CheckoutcomCustomerId = 'checkoutcom_customer_id',
  /** column name */
  CheckoutcomTestmodeCustomerId = 'checkoutcom_testmode_customer_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  StripeTestmodeCustomerId = 'stripe_testmode_customer_id',
  /** column name */
  StripeTestmodeVerificationSessionId = 'stripe_testmode_verification_session_id',
  /** column name */
  StripeTestmodeVerificationSessionResult = 'stripe_testmode_verification_session_result',
  /** column name */
  StripeTestmodeVerificationSessionResultUpdatedAt = 'stripe_testmode_verification_session_result_updated_at',
  /** column name */
  StripeVerificationSessionId = 'stripe_verification_session_id',
  /** column name */
  StripeVerificationSessionResult = 'stripe_verification_session_result',
  /** column name */
  StripeVerificationSessionResultUpdatedAt = 'stripe_verification_session_result_updated_at',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Customer_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Customer_Set_Input>;
  /** filter the rows which have to be updated */
  where: Customer_Bool_Exp;
};

/** columns and relationships of "detailed_analytics" */
export type Detailed_Analytics = {
  __typename?: 'detailed_analytics';
  checkout_id: Scalars['uuid']['output'];
  network_fee_usd_cents: Scalars['bigint']['output'];
  owner_id?: Maybe<Scalars['String']['output']>;
  page_visits: Scalars['bigint']['output'];
  paper_fee_usd_cents: Scalars['bigint']['output'];
  revenue_usd_cents: Scalars['bigint']['output'];
  sales: Scalars['bigint']['output'];
  transaction_created_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "detailed_analytics" */
export type Detailed_Analytics_Aggregate = {
  __typename?: 'detailed_analytics_aggregate';
  aggregate?: Maybe<Detailed_Analytics_Aggregate_Fields>;
  nodes: Array<Detailed_Analytics>;
};

/** aggregate fields of "detailed_analytics" */
export type Detailed_Analytics_Aggregate_Fields = {
  __typename?: 'detailed_analytics_aggregate_fields';
  avg?: Maybe<Detailed_Analytics_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Detailed_Analytics_Max_Fields>;
  min?: Maybe<Detailed_Analytics_Min_Fields>;
  stddev?: Maybe<Detailed_Analytics_Stddev_Fields>;
  stddev_pop?: Maybe<Detailed_Analytics_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Detailed_Analytics_Stddev_Samp_Fields>;
  sum?: Maybe<Detailed_Analytics_Sum_Fields>;
  var_pop?: Maybe<Detailed_Analytics_Var_Pop_Fields>;
  var_samp?: Maybe<Detailed_Analytics_Var_Samp_Fields>;
  variance?: Maybe<Detailed_Analytics_Variance_Fields>;
};


/** aggregate fields of "detailed_analytics" */
export type Detailed_Analytics_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Detailed_Analytics_Avg_Fields = {
  __typename?: 'detailed_analytics_avg_fields';
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  page_visits?: Maybe<Scalars['Float']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  revenue_usd_cents?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "detailed_analytics". All fields are combined with a logical 'AND'. */
export type Detailed_Analytics_Bool_Exp = {
  _and?: InputMaybe<Array<Detailed_Analytics_Bool_Exp>>;
  _not?: InputMaybe<Detailed_Analytics_Bool_Exp>;
  _or?: InputMaybe<Array<Detailed_Analytics_Bool_Exp>>;
  checkout_id?: InputMaybe<Uuid_Comparison_Exp>;
  network_fee_usd_cents?: InputMaybe<Bigint_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  page_visits?: InputMaybe<Bigint_Comparison_Exp>;
  paper_fee_usd_cents?: InputMaybe<Bigint_Comparison_Exp>;
  revenue_usd_cents?: InputMaybe<Bigint_Comparison_Exp>;
  sales?: InputMaybe<Bigint_Comparison_Exp>;
  transaction_created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "detailed_analytics" */
export enum Detailed_Analytics_Constraint {
  /** unique or primary key constraint on columns "checkout_id", "transaction_created_at" */
  DetailedAnalyticsPkey = 'detailed_analytics_pkey'
}

/** input type for incrementing numeric columns in table "detailed_analytics" */
export type Detailed_Analytics_Inc_Input = {
  network_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  page_visits?: InputMaybe<Scalars['bigint']['input']>;
  paper_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  revenue_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  sales?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "detailed_analytics" */
export type Detailed_Analytics_Insert_Input = {
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  network_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  page_visits?: InputMaybe<Scalars['bigint']['input']>;
  paper_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  revenue_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  sales?: InputMaybe<Scalars['bigint']['input']>;
  transaction_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Detailed_Analytics_Max_Fields = {
  __typename?: 'detailed_analytics_max_fields';
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  page_visits?: Maybe<Scalars['bigint']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['bigint']['output']>;
  revenue_usd_cents?: Maybe<Scalars['bigint']['output']>;
  sales?: Maybe<Scalars['bigint']['output']>;
  transaction_created_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Detailed_Analytics_Min_Fields = {
  __typename?: 'detailed_analytics_min_fields';
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['bigint']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  page_visits?: Maybe<Scalars['bigint']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['bigint']['output']>;
  revenue_usd_cents?: Maybe<Scalars['bigint']['output']>;
  sales?: Maybe<Scalars['bigint']['output']>;
  transaction_created_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "detailed_analytics" */
export type Detailed_Analytics_Mutation_Response = {
  __typename?: 'detailed_analytics_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Detailed_Analytics>;
};

/** on_conflict condition type for table "detailed_analytics" */
export type Detailed_Analytics_On_Conflict = {
  constraint: Detailed_Analytics_Constraint;
  update_columns?: Array<Detailed_Analytics_Update_Column>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};

/** Ordering options when selecting data from "detailed_analytics". */
export type Detailed_Analytics_Order_By = {
  checkout_id?: InputMaybe<Order_By>;
  network_fee_usd_cents?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  page_visits?: InputMaybe<Order_By>;
  paper_fee_usd_cents?: InputMaybe<Order_By>;
  revenue_usd_cents?: InputMaybe<Order_By>;
  sales?: InputMaybe<Order_By>;
  transaction_created_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: detailed_analytics */
export type Detailed_Analytics_Pk_Columns_Input = {
  checkout_id: Scalars['uuid']['input'];
  transaction_created_at: Scalars['timestamptz']['input'];
};

/** select columns of table "detailed_analytics" */
export enum Detailed_Analytics_Select_Column {
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  NetworkFeeUsdCents = 'network_fee_usd_cents',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PageVisits = 'page_visits',
  /** column name */
  PaperFeeUsdCents = 'paper_fee_usd_cents',
  /** column name */
  RevenueUsdCents = 'revenue_usd_cents',
  /** column name */
  Sales = 'sales',
  /** column name */
  TransactionCreatedAt = 'transaction_created_at'
}

/** input type for updating data in table "detailed_analytics" */
export type Detailed_Analytics_Set_Input = {
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  network_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  page_visits?: InputMaybe<Scalars['bigint']['input']>;
  paper_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  revenue_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  sales?: InputMaybe<Scalars['bigint']['input']>;
  transaction_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Detailed_Analytics_Stddev_Fields = {
  __typename?: 'detailed_analytics_stddev_fields';
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  page_visits?: Maybe<Scalars['Float']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  revenue_usd_cents?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Detailed_Analytics_Stddev_Pop_Fields = {
  __typename?: 'detailed_analytics_stddev_pop_fields';
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  page_visits?: Maybe<Scalars['Float']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  revenue_usd_cents?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Detailed_Analytics_Stddev_Samp_Fields = {
  __typename?: 'detailed_analytics_stddev_samp_fields';
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  page_visits?: Maybe<Scalars['Float']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  revenue_usd_cents?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "detailed_analytics" */
export type Detailed_Analytics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Detailed_Analytics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Detailed_Analytics_Stream_Cursor_Value_Input = {
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  network_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  page_visits?: InputMaybe<Scalars['bigint']['input']>;
  paper_fee_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  revenue_usd_cents?: InputMaybe<Scalars['bigint']['input']>;
  sales?: InputMaybe<Scalars['bigint']['input']>;
  transaction_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Detailed_Analytics_Sum_Fields = {
  __typename?: 'detailed_analytics_sum_fields';
  network_fee_usd_cents?: Maybe<Scalars['bigint']['output']>;
  page_visits?: Maybe<Scalars['bigint']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['bigint']['output']>;
  revenue_usd_cents?: Maybe<Scalars['bigint']['output']>;
  sales?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "detailed_analytics" */
export enum Detailed_Analytics_Update_Column {
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  NetworkFeeUsdCents = 'network_fee_usd_cents',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PageVisits = 'page_visits',
  /** column name */
  PaperFeeUsdCents = 'paper_fee_usd_cents',
  /** column name */
  RevenueUsdCents = 'revenue_usd_cents',
  /** column name */
  Sales = 'sales',
  /** column name */
  TransactionCreatedAt = 'transaction_created_at'
}

export type Detailed_Analytics_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Detailed_Analytics_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Detailed_Analytics_Set_Input>;
  /** filter the rows which have to be updated */
  where: Detailed_Analytics_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Detailed_Analytics_Var_Pop_Fields = {
  __typename?: 'detailed_analytics_var_pop_fields';
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  page_visits?: Maybe<Scalars['Float']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  revenue_usd_cents?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Detailed_Analytics_Var_Samp_Fields = {
  __typename?: 'detailed_analytics_var_samp_fields';
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  page_visits?: Maybe<Scalars['Float']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  revenue_usd_cents?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Detailed_Analytics_Variance_Fields = {
  __typename?: 'detailed_analytics_variance_fields';
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  page_visits?: Maybe<Scalars['Float']['output']>;
  paper_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  revenue_usd_cents?: Maybe<Scalars['Float']['output']>;
  sales?: Maybe<Scalars['Float']['output']>;
};

/** Developer settings for auth providers (used in the embedded wallet service) */
export type Developer_Auth_Setting = {
  __typename?: 'developer_auth_setting';
  auth_provider: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  deleted_at: Scalars['timestamptz']['output'];
  developer_client_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  oauth?: Maybe<Oauth>;
  settings: Scalars['jsonb']['output'];
};


/** Developer settings for auth providers (used in the embedded wallet service) */
export type Developer_Auth_SettingSettingsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "developer_auth_setting" */
export type Developer_Auth_Setting_Aggregate = {
  __typename?: 'developer_auth_setting_aggregate';
  aggregate?: Maybe<Developer_Auth_Setting_Aggregate_Fields>;
  nodes: Array<Developer_Auth_Setting>;
};

/** aggregate fields of "developer_auth_setting" */
export type Developer_Auth_Setting_Aggregate_Fields = {
  __typename?: 'developer_auth_setting_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Developer_Auth_Setting_Max_Fields>;
  min?: Maybe<Developer_Auth_Setting_Min_Fields>;
};


/** aggregate fields of "developer_auth_setting" */
export type Developer_Auth_Setting_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Developer_Auth_Setting_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Developer_Auth_Setting_Append_Input = {
  settings?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "developer_auth_setting". All fields are combined with a logical 'AND'. */
export type Developer_Auth_Setting_Bool_Exp = {
  _and?: InputMaybe<Array<Developer_Auth_Setting_Bool_Exp>>;
  _not?: InputMaybe<Developer_Auth_Setting_Bool_Exp>;
  _or?: InputMaybe<Array<Developer_Auth_Setting_Bool_Exp>>;
  auth_provider?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  developer_client_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  oauth?: InputMaybe<Oauth_Bool_Exp>;
  settings?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "developer_auth_setting" */
export enum Developer_Auth_Setting_Constraint {
  /** unique or primary key constraint on columns "auth_provider", "developer_client_id", "deleted_at" */
  DeveloperAuthSettingDeveloperClientIdAuthProviderDelete = 'developer_auth_setting_developer_client_id_auth_provider_delete',
  /** unique or primary key constraint on columns "id" */
  DeveloperAuthSettingPkey = 'developer_auth_setting_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Developer_Auth_Setting_Delete_At_Path_Input = {
  settings?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Developer_Auth_Setting_Delete_Elem_Input = {
  settings?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Developer_Auth_Setting_Delete_Key_Input = {
  settings?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "developer_auth_setting" */
export type Developer_Auth_Setting_Insert_Input = {
  auth_provider?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  developer_client_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  oauth?: InputMaybe<Oauth_Obj_Rel_Insert_Input>;
  settings?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate max on columns */
export type Developer_Auth_Setting_Max_Fields = {
  __typename?: 'developer_auth_setting_max_fields';
  auth_provider?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  developer_client_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Developer_Auth_Setting_Min_Fields = {
  __typename?: 'developer_auth_setting_min_fields';
  auth_provider?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  developer_client_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "developer_auth_setting" */
export type Developer_Auth_Setting_Mutation_Response = {
  __typename?: 'developer_auth_setting_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Developer_Auth_Setting>;
};

/** on_conflict condition type for table "developer_auth_setting" */
export type Developer_Auth_Setting_On_Conflict = {
  constraint: Developer_Auth_Setting_Constraint;
  update_columns?: Array<Developer_Auth_Setting_Update_Column>;
  where?: InputMaybe<Developer_Auth_Setting_Bool_Exp>;
};

/** Ordering options when selecting data from "developer_auth_setting". */
export type Developer_Auth_Setting_Order_By = {
  auth_provider?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  developer_client_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  oauth?: InputMaybe<Oauth_Order_By>;
  settings?: InputMaybe<Order_By>;
};

/** primary key columns input for table: developer_auth_setting */
export type Developer_Auth_Setting_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Developer_Auth_Setting_Prepend_Input = {
  settings?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "developer_auth_setting" */
export enum Developer_Auth_Setting_Select_Column {
  /** column name */
  AuthProvider = 'auth_provider',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DeveloperClientId = 'developer_client_id',
  /** column name */
  Id = 'id',
  /** column name */
  Settings = 'settings'
}

/** input type for updating data in table "developer_auth_setting" */
export type Developer_Auth_Setting_Set_Input = {
  auth_provider?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  developer_client_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  settings?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Streaming cursor of the table "developer_auth_setting" */
export type Developer_Auth_Setting_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Developer_Auth_Setting_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Developer_Auth_Setting_Stream_Cursor_Value_Input = {
  auth_provider?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  developer_client_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  settings?: InputMaybe<Scalars['jsonb']['input']>;
};

/** update columns of table "developer_auth_setting" */
export enum Developer_Auth_Setting_Update_Column {
  /** column name */
  AuthProvider = 'auth_provider',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DeveloperClientId = 'developer_client_id',
  /** column name */
  Id = 'id',
  /** column name */
  Settings = 'settings'
}

export type Developer_Auth_Setting_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Developer_Auth_Setting_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Developer_Auth_Setting_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Developer_Auth_Setting_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Developer_Auth_Setting_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Developer_Auth_Setting_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Developer_Auth_Setting_Set_Input>;
  /** filter the rows which have to be updated */
  where: Developer_Auth_Setting_Bool_Exp;
};

/** columns and relationships of "email_otp_user" */
export type Email_Otp_User = {
  __typename?: 'email_otp_user';
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
};

/** aggregated selection of "email_otp_user" */
export type Email_Otp_User_Aggregate = {
  __typename?: 'email_otp_user_aggregate';
  aggregate?: Maybe<Email_Otp_User_Aggregate_Fields>;
  nodes: Array<Email_Otp_User>;
};

/** aggregate fields of "email_otp_user" */
export type Email_Otp_User_Aggregate_Fields = {
  __typename?: 'email_otp_user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Email_Otp_User_Max_Fields>;
  min?: Maybe<Email_Otp_User_Min_Fields>;
};


/** aggregate fields of "email_otp_user" */
export type Email_Otp_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Email_Otp_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "email_otp_user". All fields are combined with a logical 'AND'. */
export type Email_Otp_User_Bool_Exp = {
  _and?: InputMaybe<Array<Email_Otp_User_Bool_Exp>>;
  _not?: InputMaybe<Email_Otp_User_Bool_Exp>;
  _or?: InputMaybe<Array<Email_Otp_User_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "email_otp_user" */
export enum Email_Otp_User_Constraint {
  /** unique or primary key constraint on columns "email" */
  EmailOtpUserEmailKey = 'email_otp_user_email_key',
  /** unique or primary key constraint on columns "id" */
  EmailOtpUserPkey = 'email_otp_user_pkey'
}

/** input type for inserting data into table "email_otp_user" */
export type Email_Otp_User_Insert_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Email_Otp_User_Max_Fields = {
  __typename?: 'email_otp_user_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Email_Otp_User_Min_Fields = {
  __typename?: 'email_otp_user_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "email_otp_user" */
export type Email_Otp_User_Mutation_Response = {
  __typename?: 'email_otp_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Email_Otp_User>;
};

/** on_conflict condition type for table "email_otp_user" */
export type Email_Otp_User_On_Conflict = {
  constraint: Email_Otp_User_Constraint;
  update_columns?: Array<Email_Otp_User_Update_Column>;
  where?: InputMaybe<Email_Otp_User_Bool_Exp>;
};

/** Ordering options when selecting data from "email_otp_user". */
export type Email_Otp_User_Order_By = {
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: email_otp_user */
export type Email_Otp_User_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "email_otp_user" */
export enum Email_Otp_User_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "email_otp_user" */
export type Email_Otp_User_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "email_otp_user" */
export type Email_Otp_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Email_Otp_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Email_Otp_User_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "email_otp_user" */
export enum Email_Otp_User_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id'
}

export type Email_Otp_User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Email_Otp_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Email_Otp_User_Bool_Exp;
};

/** High level information on the embedded wallet for each user */
export type Embedded_Wallet = {
  __typename?: 'embedded_wallet';
  address: Scalars['String']['output'];
  chain: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  wallet_user: Wallet_User;
  wallet_user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "embedded_wallet" */
export type Embedded_Wallet_Aggregate = {
  __typename?: 'embedded_wallet_aggregate';
  aggregate?: Maybe<Embedded_Wallet_Aggregate_Fields>;
  nodes: Array<Embedded_Wallet>;
};

export type Embedded_Wallet_Aggregate_Bool_Exp = {
  count?: InputMaybe<Embedded_Wallet_Aggregate_Bool_Exp_Count>;
};

export type Embedded_Wallet_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Embedded_Wallet_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "embedded_wallet" */
export type Embedded_Wallet_Aggregate_Fields = {
  __typename?: 'embedded_wallet_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Embedded_Wallet_Max_Fields>;
  min?: Maybe<Embedded_Wallet_Min_Fields>;
};


/** aggregate fields of "embedded_wallet" */
export type Embedded_Wallet_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "embedded_wallet" */
export type Embedded_Wallet_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Embedded_Wallet_Max_Order_By>;
  min?: InputMaybe<Embedded_Wallet_Min_Order_By>;
};

/** input type for inserting array relation for remote table "embedded_wallet" */
export type Embedded_Wallet_Arr_Rel_Insert_Input = {
  data: Array<Embedded_Wallet_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Embedded_Wallet_On_Conflict>;
};

/** Boolean expression to filter rows from the table "embedded_wallet". All fields are combined with a logical 'AND'. */
export type Embedded_Wallet_Bool_Exp = {
  _and?: InputMaybe<Array<Embedded_Wallet_Bool_Exp>>;
  _not?: InputMaybe<Embedded_Wallet_Bool_Exp>;
  _or?: InputMaybe<Array<Embedded_Wallet_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  chain?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  wallet_user?: InputMaybe<Wallet_User_Bool_Exp>;
  wallet_user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "embedded_wallet" */
export enum Embedded_Wallet_Constraint {
  /** unique or primary key constraint on columns "id" */
  EmbeddedWalletPkey = 'embedded_wallet_pkey'
}

/** input type for inserting data into table "embedded_wallet" */
export type Embedded_Wallet_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  wallet_user?: InputMaybe<Wallet_User_Obj_Rel_Insert_Input>;
  wallet_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Embedded_Wallet_Max_Fields = {
  __typename?: 'embedded_wallet_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  wallet_user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "embedded_wallet" */
export type Embedded_Wallet_Max_Order_By = {
  address?: InputMaybe<Order_By>;
  chain?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  wallet_user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Embedded_Wallet_Min_Fields = {
  __typename?: 'embedded_wallet_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  chain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  wallet_user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "embedded_wallet" */
export type Embedded_Wallet_Min_Order_By = {
  address?: InputMaybe<Order_By>;
  chain?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  wallet_user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "embedded_wallet" */
export type Embedded_Wallet_Mutation_Response = {
  __typename?: 'embedded_wallet_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Embedded_Wallet>;
};

/** on_conflict condition type for table "embedded_wallet" */
export type Embedded_Wallet_On_Conflict = {
  constraint: Embedded_Wallet_Constraint;
  update_columns?: Array<Embedded_Wallet_Update_Column>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};

/** Ordering options when selecting data from "embedded_wallet". */
export type Embedded_Wallet_Order_By = {
  address?: InputMaybe<Order_By>;
  chain?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  wallet_user?: InputMaybe<Wallet_User_Order_By>;
  wallet_user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: embedded_wallet */
export type Embedded_Wallet_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "embedded_wallet" */
export enum Embedded_Wallet_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Chain = 'chain',
  /** column name */
  Id = 'id',
  /** column name */
  WalletUserId = 'wallet_user_id'
}

/** input type for updating data in table "embedded_wallet" */
export type Embedded_Wallet_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  wallet_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "embedded_wallet" */
export type Embedded_Wallet_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Embedded_Wallet_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Embedded_Wallet_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  wallet_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "embedded_wallet" */
export enum Embedded_Wallet_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Chain = 'chain',
  /** column name */
  Id = 'id',
  /** column name */
  WalletUserId = 'wallet_user_id'
}

export type Embedded_Wallet_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Embedded_Wallet_Set_Input>;
  /** filter the rows which have to be updated */
  where: Embedded_Wallet_Bool_Exp;
};

/** EWS User authentication details */
export type Ews_Authed_User = {
  __typename?: 'ews_authed_user';
  authed_user_id: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  /** An array relationship */
  wallet_user: Array<Wallet_User>;
  /** An aggregate relationship */
  wallet_user_aggregate: Wallet_User_Aggregate;
};


/** EWS User authentication details */
export type Ews_Authed_UserWallet_UserArgs = {
  distinct_on?: InputMaybe<Array<Wallet_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Wallet_User_Order_By>>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};


/** EWS User authentication details */
export type Ews_Authed_UserWallet_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Wallet_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Wallet_User_Order_By>>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};

/** aggregated selection of "ews_authed_user" */
export type Ews_Authed_User_Aggregate = {
  __typename?: 'ews_authed_user_aggregate';
  aggregate?: Maybe<Ews_Authed_User_Aggregate_Fields>;
  nodes: Array<Ews_Authed_User>;
};

export type Ews_Authed_User_Aggregate_Bool_Exp = {
  count?: InputMaybe<Ews_Authed_User_Aggregate_Bool_Exp_Count>;
};

export type Ews_Authed_User_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Ews_Authed_User_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "ews_authed_user" */
export type Ews_Authed_User_Aggregate_Fields = {
  __typename?: 'ews_authed_user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Ews_Authed_User_Max_Fields>;
  min?: Maybe<Ews_Authed_User_Min_Fields>;
};


/** aggregate fields of "ews_authed_user" */
export type Ews_Authed_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "ews_authed_user" */
export type Ews_Authed_User_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Ews_Authed_User_Max_Order_By>;
  min?: InputMaybe<Ews_Authed_User_Min_Order_By>;
};

/** input type for inserting array relation for remote table "ews_authed_user" */
export type Ews_Authed_User_Arr_Rel_Insert_Input = {
  data: Array<Ews_Authed_User_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Ews_Authed_User_On_Conflict>;
};

/** Boolean expression to filter rows from the table "ews_authed_user". All fields are combined with a logical 'AND'. */
export type Ews_Authed_User_Bool_Exp = {
  _and?: InputMaybe<Array<Ews_Authed_User_Bool_Exp>>;
  _not?: InputMaybe<Ews_Authed_User_Bool_Exp>;
  _or?: InputMaybe<Array<Ews_Authed_User_Bool_Exp>>;
  authed_user_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  wallet_user?: InputMaybe<Wallet_User_Bool_Exp>;
  wallet_user_aggregate?: InputMaybe<Wallet_User_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "ews_authed_user" */
export enum Ews_Authed_User_Constraint {
  /** unique or primary key constraint on columns "email" */
  EwsAuthedUserEmailKey = 'ews_authed_user_email_key',
  /** unique or primary key constraint on columns "id" */
  EwsAuthedUserPkey = 'ews_authed_user_pkey'
}

/** input type for inserting data into table "ews_authed_user" */
export type Ews_Authed_User_Insert_Input = {
  authed_user_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  wallet_user?: InputMaybe<Wallet_User_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Ews_Authed_User_Max_Fields = {
  __typename?: 'ews_authed_user_max_fields';
  authed_user_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "ews_authed_user" */
export type Ews_Authed_User_Max_Order_By = {
  authed_user_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Ews_Authed_User_Min_Fields = {
  __typename?: 'ews_authed_user_min_fields';
  authed_user_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "ews_authed_user" */
export type Ews_Authed_User_Min_Order_By = {
  authed_user_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "ews_authed_user" */
export type Ews_Authed_User_Mutation_Response = {
  __typename?: 'ews_authed_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Ews_Authed_User>;
};

/** on_conflict condition type for table "ews_authed_user" */
export type Ews_Authed_User_On_Conflict = {
  constraint: Ews_Authed_User_Constraint;
  update_columns?: Array<Ews_Authed_User_Update_Column>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};

/** Ordering options when selecting data from "ews_authed_user". */
export type Ews_Authed_User_Order_By = {
  authed_user_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  wallet_user_aggregate?: InputMaybe<Wallet_User_Aggregate_Order_By>;
};

/** primary key columns input for table: ews_authed_user */
export type Ews_Authed_User_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "ews_authed_user" */
export enum Ews_Authed_User_Select_Column {
  /** column name */
  AuthedUserId = 'authed_user_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "ews_authed_user" */
export type Ews_Authed_User_Set_Input = {
  authed_user_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "ews_authed_user" */
export type Ews_Authed_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Ews_Authed_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Ews_Authed_User_Stream_Cursor_Value_Input = {
  authed_user_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "ews_authed_user" */
export enum Ews_Authed_User_Update_Column {
  /** column name */
  AuthedUserId = 'authed_user_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id'
}

export type Ews_Authed_User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Ews_Authed_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Ews_Authed_User_Bool_Exp;
};

/** Track the fiat payouts for sellers */
export type Fiat_Payout = {
  __typename?: 'fiat_payout';
  amount_crypto: Scalars['String']['output'];
  amount_fiat_cents: Scalars['Int']['output'];
  contract_address: Scalars['String']['output'];
  contract_chain: Scalars['String']['output'];
  contract_payer_wallet_address: Scalars['String']['output'];
  created_at: Scalars['timestamp']['output'];
  currency_crypto: Scalars['String']['output'];
  currency_fiat: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  paid_out_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  seller: Seller;
  seller_id: Scalars['String']['output'];
  transaction_hash: Scalars['String']['output'];
};

/** aggregated selection of "fiat_payout" */
export type Fiat_Payout_Aggregate = {
  __typename?: 'fiat_payout_aggregate';
  aggregate?: Maybe<Fiat_Payout_Aggregate_Fields>;
  nodes: Array<Fiat_Payout>;
};

/** aggregate fields of "fiat_payout" */
export type Fiat_Payout_Aggregate_Fields = {
  __typename?: 'fiat_payout_aggregate_fields';
  avg?: Maybe<Fiat_Payout_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Fiat_Payout_Max_Fields>;
  min?: Maybe<Fiat_Payout_Min_Fields>;
  stddev?: Maybe<Fiat_Payout_Stddev_Fields>;
  stddev_pop?: Maybe<Fiat_Payout_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Fiat_Payout_Stddev_Samp_Fields>;
  sum?: Maybe<Fiat_Payout_Sum_Fields>;
  var_pop?: Maybe<Fiat_Payout_Var_Pop_Fields>;
  var_samp?: Maybe<Fiat_Payout_Var_Samp_Fields>;
  variance?: Maybe<Fiat_Payout_Variance_Fields>;
};


/** aggregate fields of "fiat_payout" */
export type Fiat_Payout_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fiat_Payout_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Fiat_Payout_Avg_Fields = {
  __typename?: 'fiat_payout_avg_fields';
  amount_fiat_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "fiat_payout". All fields are combined with a logical 'AND'. */
export type Fiat_Payout_Bool_Exp = {
  _and?: InputMaybe<Array<Fiat_Payout_Bool_Exp>>;
  _not?: InputMaybe<Fiat_Payout_Bool_Exp>;
  _or?: InputMaybe<Array<Fiat_Payout_Bool_Exp>>;
  amount_crypto?: InputMaybe<String_Comparison_Exp>;
  amount_fiat_cents?: InputMaybe<Int_Comparison_Exp>;
  contract_address?: InputMaybe<String_Comparison_Exp>;
  contract_chain?: InputMaybe<String_Comparison_Exp>;
  contract_payer_wallet_address?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  currency_crypto?: InputMaybe<String_Comparison_Exp>;
  currency_fiat?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  paid_out_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  seller?: InputMaybe<Seller_Bool_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "fiat_payout" */
export enum Fiat_Payout_Constraint {
  /** unique or primary key constraint on columns "id" */
  FiatPayoutPkey1 = 'fiat_payout_pkey1',
  /** unique or primary key constraint on columns "transaction_hash" */
  FiatPayoutTransactionHashKey = 'fiat_payout_transaction_hash_key'
}

/** input type for incrementing numeric columns in table "fiat_payout" */
export type Fiat_Payout_Inc_Input = {
  amount_fiat_cents?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "fiat_payout" */
export type Fiat_Payout_Insert_Input = {
  amount_crypto?: InputMaybe<Scalars['String']['input']>;
  amount_fiat_cents?: InputMaybe<Scalars['Int']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_chain?: InputMaybe<Scalars['String']['input']>;
  contract_payer_wallet_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  currency_crypto?: InputMaybe<Scalars['String']['input']>;
  currency_fiat?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  paid_out_at?: InputMaybe<Scalars['timestamptz']['input']>;
  seller?: InputMaybe<Seller_Obj_Rel_Insert_Input>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Fiat_Payout_Max_Fields = {
  __typename?: 'fiat_payout_max_fields';
  amount_crypto?: Maybe<Scalars['String']['output']>;
  amount_fiat_cents?: Maybe<Scalars['Int']['output']>;
  contract_address?: Maybe<Scalars['String']['output']>;
  contract_chain?: Maybe<Scalars['String']['output']>;
  contract_payer_wallet_address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  currency_crypto?: Maybe<Scalars['String']['output']>;
  currency_fiat?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  paid_out_at?: Maybe<Scalars['timestamptz']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Fiat_Payout_Min_Fields = {
  __typename?: 'fiat_payout_min_fields';
  amount_crypto?: Maybe<Scalars['String']['output']>;
  amount_fiat_cents?: Maybe<Scalars['Int']['output']>;
  contract_address?: Maybe<Scalars['String']['output']>;
  contract_chain?: Maybe<Scalars['String']['output']>;
  contract_payer_wallet_address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  currency_crypto?: Maybe<Scalars['String']['output']>;
  currency_fiat?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  paid_out_at?: Maybe<Scalars['timestamptz']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "fiat_payout" */
export type Fiat_Payout_Mutation_Response = {
  __typename?: 'fiat_payout_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Fiat_Payout>;
};

/** on_conflict condition type for table "fiat_payout" */
export type Fiat_Payout_On_Conflict = {
  constraint: Fiat_Payout_Constraint;
  update_columns?: Array<Fiat_Payout_Update_Column>;
  where?: InputMaybe<Fiat_Payout_Bool_Exp>;
};

/** Ordering options when selecting data from "fiat_payout". */
export type Fiat_Payout_Order_By = {
  amount_crypto?: InputMaybe<Order_By>;
  amount_fiat_cents?: InputMaybe<Order_By>;
  contract_address?: InputMaybe<Order_By>;
  contract_chain?: InputMaybe<Order_By>;
  contract_payer_wallet_address?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency_crypto?: InputMaybe<Order_By>;
  currency_fiat?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  paid_out_at?: InputMaybe<Order_By>;
  seller?: InputMaybe<Seller_Order_By>;
  seller_id?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fiat_payout */
export type Fiat_Payout_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "fiat_payout" */
export enum Fiat_Payout_Select_Column {
  /** column name */
  AmountCrypto = 'amount_crypto',
  /** column name */
  AmountFiatCents = 'amount_fiat_cents',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractChain = 'contract_chain',
  /** column name */
  ContractPayerWalletAddress = 'contract_payer_wallet_address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrencyCrypto = 'currency_crypto',
  /** column name */
  CurrencyFiat = 'currency_fiat',
  /** column name */
  Id = 'id',
  /** column name */
  PaidOutAt = 'paid_out_at',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  TransactionHash = 'transaction_hash'
}

/** input type for updating data in table "fiat_payout" */
export type Fiat_Payout_Set_Input = {
  amount_crypto?: InputMaybe<Scalars['String']['input']>;
  amount_fiat_cents?: InputMaybe<Scalars['Int']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_chain?: InputMaybe<Scalars['String']['input']>;
  contract_payer_wallet_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  currency_crypto?: InputMaybe<Scalars['String']['input']>;
  currency_fiat?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  paid_out_at?: InputMaybe<Scalars['timestamptz']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Fiat_Payout_Stddev_Fields = {
  __typename?: 'fiat_payout_stddev_fields';
  amount_fiat_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Fiat_Payout_Stddev_Pop_Fields = {
  __typename?: 'fiat_payout_stddev_pop_fields';
  amount_fiat_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Fiat_Payout_Stddev_Samp_Fields = {
  __typename?: 'fiat_payout_stddev_samp_fields';
  amount_fiat_cents?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "fiat_payout" */
export type Fiat_Payout_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Fiat_Payout_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Fiat_Payout_Stream_Cursor_Value_Input = {
  amount_crypto?: InputMaybe<Scalars['String']['input']>;
  amount_fiat_cents?: InputMaybe<Scalars['Int']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_chain?: InputMaybe<Scalars['String']['input']>;
  contract_payer_wallet_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  currency_crypto?: InputMaybe<Scalars['String']['input']>;
  currency_fiat?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  paid_out_at?: InputMaybe<Scalars['timestamptz']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Fiat_Payout_Sum_Fields = {
  __typename?: 'fiat_payout_sum_fields';
  amount_fiat_cents?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "fiat_payout" */
export enum Fiat_Payout_Update_Column {
  /** column name */
  AmountCrypto = 'amount_crypto',
  /** column name */
  AmountFiatCents = 'amount_fiat_cents',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractChain = 'contract_chain',
  /** column name */
  ContractPayerWalletAddress = 'contract_payer_wallet_address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrencyCrypto = 'currency_crypto',
  /** column name */
  CurrencyFiat = 'currency_fiat',
  /** column name */
  Id = 'id',
  /** column name */
  PaidOutAt = 'paid_out_at',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  TransactionHash = 'transaction_hash'
}

export type Fiat_Payout_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Fiat_Payout_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Fiat_Payout_Set_Input>;
  /** filter the rows which have to be updated */
  where: Fiat_Payout_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Fiat_Payout_Var_Pop_Fields = {
  __typename?: 'fiat_payout_var_pop_fields';
  amount_fiat_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Fiat_Payout_Var_Samp_Fields = {
  __typename?: 'fiat_payout_var_samp_fields';
  amount_fiat_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Fiat_Payout_Variance_Fields = {
  __typename?: 'fiat_payout_variance_fields';
  amount_fiat_cents?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "float_wallet" */
export type Float_Wallet = {
  __typename?: 'float_wallet';
  address: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  env_var_key?: Maybe<Scalars['String']['output']>;
  nickname: Scalars['String']['output'];
};

/** aggregated selection of "float_wallet" */
export type Float_Wallet_Aggregate = {
  __typename?: 'float_wallet_aggregate';
  aggregate?: Maybe<Float_Wallet_Aggregate_Fields>;
  nodes: Array<Float_Wallet>;
};

/** aggregate fields of "float_wallet" */
export type Float_Wallet_Aggregate_Fields = {
  __typename?: 'float_wallet_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Float_Wallet_Max_Fields>;
  min?: Maybe<Float_Wallet_Min_Fields>;
};


/** aggregate fields of "float_wallet" */
export type Float_Wallet_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Float_Wallet_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "float_wallet". All fields are combined with a logical 'AND'. */
export type Float_Wallet_Bool_Exp = {
  _and?: InputMaybe<Array<Float_Wallet_Bool_Exp>>;
  _not?: InputMaybe<Float_Wallet_Bool_Exp>;
  _or?: InputMaybe<Array<Float_Wallet_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  env_var_key?: InputMaybe<String_Comparison_Exp>;
  nickname?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "float_wallet" */
export enum Float_Wallet_Constraint {
  /** unique or primary key constraint on columns "env_var_key" */
  FloatWalletEnvVarKeyKey = 'float_wallet_env_var_key_key',
  /** unique or primary key constraint on columns "address" */
  FloatWalletsPkey = 'float_wallets_pkey'
}

/** input type for inserting data into table "float_wallet" */
export type Float_Wallet_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  env_var_key?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Float_Wallet_Max_Fields = {
  __typename?: 'float_wallet_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  env_var_key?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Float_Wallet_Min_Fields = {
  __typename?: 'float_wallet_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  env_var_key?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "float_wallet" */
export type Float_Wallet_Mutation_Response = {
  __typename?: 'float_wallet_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Float_Wallet>;
};

/** on_conflict condition type for table "float_wallet" */
export type Float_Wallet_On_Conflict = {
  constraint: Float_Wallet_Constraint;
  update_columns?: Array<Float_Wallet_Update_Column>;
  where?: InputMaybe<Float_Wallet_Bool_Exp>;
};

/** Ordering options when selecting data from "float_wallet". */
export type Float_Wallet_Order_By = {
  address?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  env_var_key?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
};

/** primary key columns input for table: float_wallet */
export type Float_Wallet_Pk_Columns_Input = {
  address: Scalars['String']['input'];
};

/** select columns of table "float_wallet" */
export enum Float_Wallet_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Description = 'description',
  /** column name */
  EnvVarKey = 'env_var_key',
  /** column name */
  Nickname = 'nickname'
}

/** input type for updating data in table "float_wallet" */
export type Float_Wallet_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  env_var_key?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "float_wallet" */
export type Float_Wallet_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Float_Wallet_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Float_Wallet_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  env_var_key?: InputMaybe<Scalars['String']['input']>;
  nickname?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "float_wallet" */
export enum Float_Wallet_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Description = 'description',
  /** column name */
  EnvVarKey = 'env_var_key',
  /** column name */
  Nickname = 'nickname'
}

export type Float_Wallet_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Float_Wallet_Set_Input>;
  /** filter the rows which have to be updated */
  where: Float_Wallet_Bool_Exp;
};

export type Get_Detailed_Analytics_Args = {
  checkout_id_to_fetch?: InputMaybe<Scalars['uuid']['input']>;
  period?: InputMaybe<Scalars['String']['input']>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "account" */
  delete_account?: Maybe<Account_Mutation_Response>;
  /** delete single row from the table: "account" */
  delete_account_by_pk?: Maybe<Account>;
  /** delete data from the table: "account_invite" */
  delete_account_invite?: Maybe<Account_Invite_Mutation_Response>;
  /** delete single row from the table: "account_invite" */
  delete_account_invite_by_pk?: Maybe<Account_Invite>;
  /** delete data from the table: "airdrop" */
  delete_airdrop?: Maybe<Airdrop_Mutation_Response>;
  /** delete single row from the table: "airdrop" */
  delete_airdrop_by_pk?: Maybe<Airdrop>;
  /** delete data from the table: "api_secret_key" */
  delete_api_secret_key?: Maybe<Api_Secret_Key_Mutation_Response>;
  /** delete single row from the table: "api_secret_key" */
  delete_api_secret_key_by_pk?: Maybe<Api_Secret_Key>;
  /** delete data from the table: "billing_history" */
  delete_billing_history?: Maybe<Billing_History_Mutation_Response>;
  /** delete single row from the table: "billing_history" */
  delete_billing_history_by_pk?: Maybe<Billing_History>;
  /** delete data from the table: "buyer" */
  delete_buyer?: Maybe<Buyer_Mutation_Response>;
  /** delete single row from the table: "buyer" */
  delete_buyer_by_pk?: Maybe<Buyer>;
  /** delete data from the table: "checkout" */
  delete_checkout?: Maybe<Checkout_Mutation_Response>;
  /** delete data from the table: "checkout_active_error" */
  delete_checkout_active_error?: Maybe<Checkout_Active_Error_Mutation_Response>;
  /** delete single row from the table: "checkout_active_error" */
  delete_checkout_active_error_by_pk?: Maybe<Checkout_Active_Error>;
  /** delete single row from the table: "checkout" */
  delete_checkout_by_pk?: Maybe<Checkout>;
  /** delete data from the table: "contract" */
  delete_contract?: Maybe<Contract_Mutation_Response>;
  /** delete data from the table: "contract_authorized_seller" */
  delete_contract_authorized_seller?: Maybe<Contract_Authorized_Seller_Mutation_Response>;
  /** delete single row from the table: "contract_authorized_seller" */
  delete_contract_authorized_seller_by_pk?: Maybe<Contract_Authorized_Seller>;
  /** delete single row from the table: "contract" */
  delete_contract_by_pk?: Maybe<Contract>;
  /** delete data from the table: "customer" */
  delete_customer?: Maybe<Customer_Mutation_Response>;
  /** delete single row from the table: "customer" */
  delete_customer_by_pk?: Maybe<Customer>;
  /** delete data from the table: "detailed_analytics" */
  delete_detailed_analytics?: Maybe<Detailed_Analytics_Mutation_Response>;
  /** delete single row from the table: "detailed_analytics" */
  delete_detailed_analytics_by_pk?: Maybe<Detailed_Analytics>;
  /** delete data from the table: "developer_auth_setting" */
  delete_developer_auth_setting?: Maybe<Developer_Auth_Setting_Mutation_Response>;
  /** delete single row from the table: "developer_auth_setting" */
  delete_developer_auth_setting_by_pk?: Maybe<Developer_Auth_Setting>;
  /** delete data from the table: "email_otp_user" */
  delete_email_otp_user?: Maybe<Email_Otp_User_Mutation_Response>;
  /** delete single row from the table: "email_otp_user" */
  delete_email_otp_user_by_pk?: Maybe<Email_Otp_User>;
  /** delete data from the table: "embedded_wallet" */
  delete_embedded_wallet?: Maybe<Embedded_Wallet_Mutation_Response>;
  /** delete single row from the table: "embedded_wallet" */
  delete_embedded_wallet_by_pk?: Maybe<Embedded_Wallet>;
  /** delete data from the table: "ews_authed_user" */
  delete_ews_authed_user?: Maybe<Ews_Authed_User_Mutation_Response>;
  /** delete single row from the table: "ews_authed_user" */
  delete_ews_authed_user_by_pk?: Maybe<Ews_Authed_User>;
  /** delete data from the table: "fiat_payout" */
  delete_fiat_payout?: Maybe<Fiat_Payout_Mutation_Response>;
  /** delete single row from the table: "fiat_payout" */
  delete_fiat_payout_by_pk?: Maybe<Fiat_Payout>;
  /** delete data from the table: "float_wallet" */
  delete_float_wallet?: Maybe<Float_Wallet_Mutation_Response>;
  /** delete single row from the table: "float_wallet" */
  delete_float_wallet_by_pk?: Maybe<Float_Wallet>;
  /** delete data from the table: "oauth" */
  delete_oauth?: Maybe<Oauth_Mutation_Response>;
  /** delete data from the table: "oauth_access_token" */
  delete_oauth_access_token?: Maybe<Oauth_Access_Token_Mutation_Response>;
  /** delete single row from the table: "oauth_access_token" */
  delete_oauth_access_token_by_pk?: Maybe<Oauth_Access_Token>;
  /** delete single row from the table: "oauth" */
  delete_oauth_by_pk?: Maybe<Oauth>;
  /** delete data from the table: "oauth_platform_mapping" */
  delete_oauth_platform_mapping?: Maybe<Oauth_Platform_Mapping_Mutation_Response>;
  /** delete single row from the table: "oauth_platform_mapping" */
  delete_oauth_platform_mapping_by_pk?: Maybe<Oauth_Platform_Mapping>;
  /** delete data from the table: "paper_access_key" */
  delete_paper_access_key?: Maybe<Paper_Access_Key_Mutation_Response>;
  /** delete single row from the table: "paper_access_key" */
  delete_paper_access_key_by_pk?: Maybe<Paper_Access_Key>;
  /** delete data from the table: "seller" */
  delete_seller?: Maybe<Seller_Mutation_Response>;
  /** delete data from the table: "seller_billing_plan" */
  delete_seller_billing_plan?: Maybe<Seller_Billing_Plan_Mutation_Response>;
  /** delete single row from the table: "seller_billing_plan" */
  delete_seller_billing_plan_by_pk?: Maybe<Seller_Billing_Plan>;
  /** delete single row from the table: "seller" */
  delete_seller_by_pk?: Maybe<Seller>;
  /** delete data from the table: "share" */
  delete_share?: Maybe<Share_Mutation_Response>;
  /** delete single row from the table: "share" */
  delete_share_by_pk?: Maybe<Share>;
  /** delete data from the table: "transaction" */
  delete_transaction?: Maybe<Transaction_Mutation_Response>;
  /** delete single row from the table: "transaction" */
  delete_transaction_by_pk?: Maybe<Transaction>;
  /** delete data from the table: "transaction_on_chain_attempt" */
  delete_transaction_on_chain_attempt?: Maybe<Transaction_On_Chain_Attempt_Mutation_Response>;
  /** delete single row from the table: "transaction_on_chain_attempt" */
  delete_transaction_on_chain_attempt_by_pk?: Maybe<Transaction_On_Chain_Attempt>;
  /** delete data from the table: "wallet_user" */
  delete_wallet_user?: Maybe<Wallet_User_Mutation_Response>;
  /** delete single row from the table: "wallet_user" */
  delete_wallet_user_by_pk?: Maybe<Wallet_User>;
  /** delete data from the table: "webhook" */
  delete_webhook?: Maybe<Webhook_Mutation_Response>;
  /** delete single row from the table: "webhook" */
  delete_webhook_by_pk?: Maybe<Webhook>;
  /** delete data from the table: "webhook_event" */
  delete_webhook_event?: Maybe<Webhook_Event_Mutation_Response>;
  /** delete single row from the table: "webhook_event" */
  delete_webhook_event_by_pk?: Maybe<Webhook_Event>;
  /** insert data into the table: "account" */
  insert_account?: Maybe<Account_Mutation_Response>;
  /** insert data into the table: "account_invite" */
  insert_account_invite?: Maybe<Account_Invite_Mutation_Response>;
  /** insert a single row into the table: "account_invite" */
  insert_account_invite_one?: Maybe<Account_Invite>;
  /** insert a single row into the table: "account" */
  insert_account_one?: Maybe<Account>;
  /** insert data into the table: "airdrop" */
  insert_airdrop?: Maybe<Airdrop_Mutation_Response>;
  /** insert a single row into the table: "airdrop" */
  insert_airdrop_one?: Maybe<Airdrop>;
  /** insert data into the table: "api_secret_key" */
  insert_api_secret_key?: Maybe<Api_Secret_Key_Mutation_Response>;
  /** insert a single row into the table: "api_secret_key" */
  insert_api_secret_key_one?: Maybe<Api_Secret_Key>;
  /** insert data into the table: "billing_history" */
  insert_billing_history?: Maybe<Billing_History_Mutation_Response>;
  /** insert a single row into the table: "billing_history" */
  insert_billing_history_one?: Maybe<Billing_History>;
  /** insert data into the table: "buyer" */
  insert_buyer?: Maybe<Buyer_Mutation_Response>;
  /** insert a single row into the table: "buyer" */
  insert_buyer_one?: Maybe<Buyer>;
  /** insert data into the table: "checkout" */
  insert_checkout?: Maybe<Checkout_Mutation_Response>;
  /** insert data into the table: "checkout_active_error" */
  insert_checkout_active_error?: Maybe<Checkout_Active_Error_Mutation_Response>;
  /** insert a single row into the table: "checkout_active_error" */
  insert_checkout_active_error_one?: Maybe<Checkout_Active_Error>;
  /** insert a single row into the table: "checkout" */
  insert_checkout_one?: Maybe<Checkout>;
  /** insert data into the table: "contract" */
  insert_contract?: Maybe<Contract_Mutation_Response>;
  /** insert data into the table: "contract_authorized_seller" */
  insert_contract_authorized_seller?: Maybe<Contract_Authorized_Seller_Mutation_Response>;
  /** insert a single row into the table: "contract_authorized_seller" */
  insert_contract_authorized_seller_one?: Maybe<Contract_Authorized_Seller>;
  /** insert a single row into the table: "contract" */
  insert_contract_one?: Maybe<Contract>;
  /** insert data into the table: "customer" */
  insert_customer?: Maybe<Customer_Mutation_Response>;
  /** insert a single row into the table: "customer" */
  insert_customer_one?: Maybe<Customer>;
  /** insert data into the table: "detailed_analytics" */
  insert_detailed_analytics?: Maybe<Detailed_Analytics_Mutation_Response>;
  /** insert a single row into the table: "detailed_analytics" */
  insert_detailed_analytics_one?: Maybe<Detailed_Analytics>;
  /** insert data into the table: "developer_auth_setting" */
  insert_developer_auth_setting?: Maybe<Developer_Auth_Setting_Mutation_Response>;
  /** insert a single row into the table: "developer_auth_setting" */
  insert_developer_auth_setting_one?: Maybe<Developer_Auth_Setting>;
  /** insert data into the table: "email_otp_user" */
  insert_email_otp_user?: Maybe<Email_Otp_User_Mutation_Response>;
  /** insert a single row into the table: "email_otp_user" */
  insert_email_otp_user_one?: Maybe<Email_Otp_User>;
  /** insert data into the table: "embedded_wallet" */
  insert_embedded_wallet?: Maybe<Embedded_Wallet_Mutation_Response>;
  /** insert a single row into the table: "embedded_wallet" */
  insert_embedded_wallet_one?: Maybe<Embedded_Wallet>;
  /** insert data into the table: "ews_authed_user" */
  insert_ews_authed_user?: Maybe<Ews_Authed_User_Mutation_Response>;
  /** insert a single row into the table: "ews_authed_user" */
  insert_ews_authed_user_one?: Maybe<Ews_Authed_User>;
  /** insert data into the table: "fiat_payout" */
  insert_fiat_payout?: Maybe<Fiat_Payout_Mutation_Response>;
  /** insert a single row into the table: "fiat_payout" */
  insert_fiat_payout_one?: Maybe<Fiat_Payout>;
  /** insert data into the table: "float_wallet" */
  insert_float_wallet?: Maybe<Float_Wallet_Mutation_Response>;
  /** insert a single row into the table: "float_wallet" */
  insert_float_wallet_one?: Maybe<Float_Wallet>;
  /** insert data into the table: "oauth" */
  insert_oauth?: Maybe<Oauth_Mutation_Response>;
  /** insert data into the table: "oauth_access_token" */
  insert_oauth_access_token?: Maybe<Oauth_Access_Token_Mutation_Response>;
  /** insert a single row into the table: "oauth_access_token" */
  insert_oauth_access_token_one?: Maybe<Oauth_Access_Token>;
  /** insert a single row into the table: "oauth" */
  insert_oauth_one?: Maybe<Oauth>;
  /** insert data into the table: "oauth_platform_mapping" */
  insert_oauth_platform_mapping?: Maybe<Oauth_Platform_Mapping_Mutation_Response>;
  /** insert a single row into the table: "oauth_platform_mapping" */
  insert_oauth_platform_mapping_one?: Maybe<Oauth_Platform_Mapping>;
  /** insert data into the table: "paper_access_key" */
  insert_paper_access_key?: Maybe<Paper_Access_Key_Mutation_Response>;
  /** insert a single row into the table: "paper_access_key" */
  insert_paper_access_key_one?: Maybe<Paper_Access_Key>;
  /** insert data into the table: "seller" */
  insert_seller?: Maybe<Seller_Mutation_Response>;
  /** insert data into the table: "seller_billing_plan" */
  insert_seller_billing_plan?: Maybe<Seller_Billing_Plan_Mutation_Response>;
  /** insert a single row into the table: "seller_billing_plan" */
  insert_seller_billing_plan_one?: Maybe<Seller_Billing_Plan>;
  /** insert a single row into the table: "seller" */
  insert_seller_one?: Maybe<Seller>;
  /** insert data into the table: "share" */
  insert_share?: Maybe<Share_Mutation_Response>;
  /** insert a single row into the table: "share" */
  insert_share_one?: Maybe<Share>;
  /** insert data into the table: "transaction" */
  insert_transaction?: Maybe<Transaction_Mutation_Response>;
  /** insert data into the table: "transaction_on_chain_attempt" */
  insert_transaction_on_chain_attempt?: Maybe<Transaction_On_Chain_Attempt_Mutation_Response>;
  /** insert a single row into the table: "transaction_on_chain_attempt" */
  insert_transaction_on_chain_attempt_one?: Maybe<Transaction_On_Chain_Attempt>;
  /** insert a single row into the table: "transaction" */
  insert_transaction_one?: Maybe<Transaction>;
  /** insert data into the table: "wallet_user" */
  insert_wallet_user?: Maybe<Wallet_User_Mutation_Response>;
  /** insert a single row into the table: "wallet_user" */
  insert_wallet_user_one?: Maybe<Wallet_User>;
  /** insert data into the table: "webhook" */
  insert_webhook?: Maybe<Webhook_Mutation_Response>;
  /** insert data into the table: "webhook_event" */
  insert_webhook_event?: Maybe<Webhook_Event_Mutation_Response>;
  /** insert a single row into the table: "webhook_event" */
  insert_webhook_event_one?: Maybe<Webhook_Event>;
  /** insert a single row into the table: "webhook" */
  insert_webhook_one?: Maybe<Webhook>;
  /** update data of the table: "account" */
  update_account?: Maybe<Account_Mutation_Response>;
  /** update single row of the table: "account" */
  update_account_by_pk?: Maybe<Account>;
  /** update data of the table: "account_invite" */
  update_account_invite?: Maybe<Account_Invite_Mutation_Response>;
  /** update single row of the table: "account_invite" */
  update_account_invite_by_pk?: Maybe<Account_Invite>;
  /** update multiples rows of table: "account_invite" */
  update_account_invite_many?: Maybe<Array<Maybe<Account_Invite_Mutation_Response>>>;
  /** update multiples rows of table: "account" */
  update_account_many?: Maybe<Array<Maybe<Account_Mutation_Response>>>;
  /** update data of the table: "airdrop" */
  update_airdrop?: Maybe<Airdrop_Mutation_Response>;
  /** update single row of the table: "airdrop" */
  update_airdrop_by_pk?: Maybe<Airdrop>;
  /** update multiples rows of table: "airdrop" */
  update_airdrop_many?: Maybe<Array<Maybe<Airdrop_Mutation_Response>>>;
  /** update data of the table: "api_secret_key" */
  update_api_secret_key?: Maybe<Api_Secret_Key_Mutation_Response>;
  /** update single row of the table: "api_secret_key" */
  update_api_secret_key_by_pk?: Maybe<Api_Secret_Key>;
  /** update multiples rows of table: "api_secret_key" */
  update_api_secret_key_many?: Maybe<Array<Maybe<Api_Secret_Key_Mutation_Response>>>;
  /** update data of the table: "billing_history" */
  update_billing_history?: Maybe<Billing_History_Mutation_Response>;
  /** update single row of the table: "billing_history" */
  update_billing_history_by_pk?: Maybe<Billing_History>;
  /** update multiples rows of table: "billing_history" */
  update_billing_history_many?: Maybe<Array<Maybe<Billing_History_Mutation_Response>>>;
  /** update data of the table: "buyer" */
  update_buyer?: Maybe<Buyer_Mutation_Response>;
  /** update single row of the table: "buyer" */
  update_buyer_by_pk?: Maybe<Buyer>;
  /** update multiples rows of table: "buyer" */
  update_buyer_many?: Maybe<Array<Maybe<Buyer_Mutation_Response>>>;
  /** update data of the table: "checkout" */
  update_checkout?: Maybe<Checkout_Mutation_Response>;
  /** update data of the table: "checkout_active_error" */
  update_checkout_active_error?: Maybe<Checkout_Active_Error_Mutation_Response>;
  /** update single row of the table: "checkout_active_error" */
  update_checkout_active_error_by_pk?: Maybe<Checkout_Active_Error>;
  /** update multiples rows of table: "checkout_active_error" */
  update_checkout_active_error_many?: Maybe<Array<Maybe<Checkout_Active_Error_Mutation_Response>>>;
  /** update single row of the table: "checkout" */
  update_checkout_by_pk?: Maybe<Checkout>;
  /** update multiples rows of table: "checkout" */
  update_checkout_many?: Maybe<Array<Maybe<Checkout_Mutation_Response>>>;
  /** update data of the table: "contract" */
  update_contract?: Maybe<Contract_Mutation_Response>;
  /** update data of the table: "contract_authorized_seller" */
  update_contract_authorized_seller?: Maybe<Contract_Authorized_Seller_Mutation_Response>;
  /** update single row of the table: "contract_authorized_seller" */
  update_contract_authorized_seller_by_pk?: Maybe<Contract_Authorized_Seller>;
  /** update multiples rows of table: "contract_authorized_seller" */
  update_contract_authorized_seller_many?: Maybe<Array<Maybe<Contract_Authorized_Seller_Mutation_Response>>>;
  /** update single row of the table: "contract" */
  update_contract_by_pk?: Maybe<Contract>;
  /** update multiples rows of table: "contract" */
  update_contract_many?: Maybe<Array<Maybe<Contract_Mutation_Response>>>;
  /** update data of the table: "customer" */
  update_customer?: Maybe<Customer_Mutation_Response>;
  /** update single row of the table: "customer" */
  update_customer_by_pk?: Maybe<Customer>;
  /** update multiples rows of table: "customer" */
  update_customer_many?: Maybe<Array<Maybe<Customer_Mutation_Response>>>;
  /** update data of the table: "detailed_analytics" */
  update_detailed_analytics?: Maybe<Detailed_Analytics_Mutation_Response>;
  /** update single row of the table: "detailed_analytics" */
  update_detailed_analytics_by_pk?: Maybe<Detailed_Analytics>;
  /** update multiples rows of table: "detailed_analytics" */
  update_detailed_analytics_many?: Maybe<Array<Maybe<Detailed_Analytics_Mutation_Response>>>;
  /** update data of the table: "developer_auth_setting" */
  update_developer_auth_setting?: Maybe<Developer_Auth_Setting_Mutation_Response>;
  /** update single row of the table: "developer_auth_setting" */
  update_developer_auth_setting_by_pk?: Maybe<Developer_Auth_Setting>;
  /** update multiples rows of table: "developer_auth_setting" */
  update_developer_auth_setting_many?: Maybe<Array<Maybe<Developer_Auth_Setting_Mutation_Response>>>;
  /** update data of the table: "email_otp_user" */
  update_email_otp_user?: Maybe<Email_Otp_User_Mutation_Response>;
  /** update single row of the table: "email_otp_user" */
  update_email_otp_user_by_pk?: Maybe<Email_Otp_User>;
  /** update multiples rows of table: "email_otp_user" */
  update_email_otp_user_many?: Maybe<Array<Maybe<Email_Otp_User_Mutation_Response>>>;
  /** update data of the table: "embedded_wallet" */
  update_embedded_wallet?: Maybe<Embedded_Wallet_Mutation_Response>;
  /** update single row of the table: "embedded_wallet" */
  update_embedded_wallet_by_pk?: Maybe<Embedded_Wallet>;
  /** update multiples rows of table: "embedded_wallet" */
  update_embedded_wallet_many?: Maybe<Array<Maybe<Embedded_Wallet_Mutation_Response>>>;
  /** update data of the table: "ews_authed_user" */
  update_ews_authed_user?: Maybe<Ews_Authed_User_Mutation_Response>;
  /** update single row of the table: "ews_authed_user" */
  update_ews_authed_user_by_pk?: Maybe<Ews_Authed_User>;
  /** update multiples rows of table: "ews_authed_user" */
  update_ews_authed_user_many?: Maybe<Array<Maybe<Ews_Authed_User_Mutation_Response>>>;
  /** update data of the table: "fiat_payout" */
  update_fiat_payout?: Maybe<Fiat_Payout_Mutation_Response>;
  /** update single row of the table: "fiat_payout" */
  update_fiat_payout_by_pk?: Maybe<Fiat_Payout>;
  /** update multiples rows of table: "fiat_payout" */
  update_fiat_payout_many?: Maybe<Array<Maybe<Fiat_Payout_Mutation_Response>>>;
  /** update data of the table: "float_wallet" */
  update_float_wallet?: Maybe<Float_Wallet_Mutation_Response>;
  /** update single row of the table: "float_wallet" */
  update_float_wallet_by_pk?: Maybe<Float_Wallet>;
  /** update multiples rows of table: "float_wallet" */
  update_float_wallet_many?: Maybe<Array<Maybe<Float_Wallet_Mutation_Response>>>;
  /** update data of the table: "oauth" */
  update_oauth?: Maybe<Oauth_Mutation_Response>;
  /** update data of the table: "oauth_access_token" */
  update_oauth_access_token?: Maybe<Oauth_Access_Token_Mutation_Response>;
  /** update single row of the table: "oauth_access_token" */
  update_oauth_access_token_by_pk?: Maybe<Oauth_Access_Token>;
  /** update multiples rows of table: "oauth_access_token" */
  update_oauth_access_token_many?: Maybe<Array<Maybe<Oauth_Access_Token_Mutation_Response>>>;
  /** update single row of the table: "oauth" */
  update_oauth_by_pk?: Maybe<Oauth>;
  /** update multiples rows of table: "oauth" */
  update_oauth_many?: Maybe<Array<Maybe<Oauth_Mutation_Response>>>;
  /** update data of the table: "oauth_platform_mapping" */
  update_oauth_platform_mapping?: Maybe<Oauth_Platform_Mapping_Mutation_Response>;
  /** update single row of the table: "oauth_platform_mapping" */
  update_oauth_platform_mapping_by_pk?: Maybe<Oauth_Platform_Mapping>;
  /** update multiples rows of table: "oauth_platform_mapping" */
  update_oauth_platform_mapping_many?: Maybe<Array<Maybe<Oauth_Platform_Mapping_Mutation_Response>>>;
  /** update data of the table: "paper_access_key" */
  update_paper_access_key?: Maybe<Paper_Access_Key_Mutation_Response>;
  /** update single row of the table: "paper_access_key" */
  update_paper_access_key_by_pk?: Maybe<Paper_Access_Key>;
  /** update multiples rows of table: "paper_access_key" */
  update_paper_access_key_many?: Maybe<Array<Maybe<Paper_Access_Key_Mutation_Response>>>;
  /** update data of the table: "seller" */
  update_seller?: Maybe<Seller_Mutation_Response>;
  /** update data of the table: "seller_billing_plan" */
  update_seller_billing_plan?: Maybe<Seller_Billing_Plan_Mutation_Response>;
  /** update single row of the table: "seller_billing_plan" */
  update_seller_billing_plan_by_pk?: Maybe<Seller_Billing_Plan>;
  /** update multiples rows of table: "seller_billing_plan" */
  update_seller_billing_plan_many?: Maybe<Array<Maybe<Seller_Billing_Plan_Mutation_Response>>>;
  /** update single row of the table: "seller" */
  update_seller_by_pk?: Maybe<Seller>;
  /** update multiples rows of table: "seller" */
  update_seller_many?: Maybe<Array<Maybe<Seller_Mutation_Response>>>;
  /** update data of the table: "share" */
  update_share?: Maybe<Share_Mutation_Response>;
  /** update single row of the table: "share" */
  update_share_by_pk?: Maybe<Share>;
  /** update multiples rows of table: "share" */
  update_share_many?: Maybe<Array<Maybe<Share_Mutation_Response>>>;
  /** update data of the table: "transaction" */
  update_transaction?: Maybe<Transaction_Mutation_Response>;
  /** update single row of the table: "transaction" */
  update_transaction_by_pk?: Maybe<Transaction>;
  /** update multiples rows of table: "transaction" */
  update_transaction_many?: Maybe<Array<Maybe<Transaction_Mutation_Response>>>;
  /** update data of the table: "transaction_on_chain_attempt" */
  update_transaction_on_chain_attempt?: Maybe<Transaction_On_Chain_Attempt_Mutation_Response>;
  /** update single row of the table: "transaction_on_chain_attempt" */
  update_transaction_on_chain_attempt_by_pk?: Maybe<Transaction_On_Chain_Attempt>;
  /** update multiples rows of table: "transaction_on_chain_attempt" */
  update_transaction_on_chain_attempt_many?: Maybe<Array<Maybe<Transaction_On_Chain_Attempt_Mutation_Response>>>;
  /** update data of the table: "wallet_user" */
  update_wallet_user?: Maybe<Wallet_User_Mutation_Response>;
  /** update single row of the table: "wallet_user" */
  update_wallet_user_by_pk?: Maybe<Wallet_User>;
  /** update multiples rows of table: "wallet_user" */
  update_wallet_user_many?: Maybe<Array<Maybe<Wallet_User_Mutation_Response>>>;
  /** update data of the table: "webhook" */
  update_webhook?: Maybe<Webhook_Mutation_Response>;
  /** update single row of the table: "webhook" */
  update_webhook_by_pk?: Maybe<Webhook>;
  /** update data of the table: "webhook_event" */
  update_webhook_event?: Maybe<Webhook_Event_Mutation_Response>;
  /** update single row of the table: "webhook_event" */
  update_webhook_event_by_pk?: Maybe<Webhook_Event>;
  /** update multiples rows of table: "webhook_event" */
  update_webhook_event_many?: Maybe<Array<Maybe<Webhook_Event_Mutation_Response>>>;
  /** update multiples rows of table: "webhook" */
  update_webhook_many?: Maybe<Array<Maybe<Webhook_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_AccountArgs = {
  where: Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Account_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Account_InviteArgs = {
  where: Account_Invite_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Account_Invite_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_AirdropArgs = {
  where: Airdrop_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Airdrop_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Api_Secret_KeyArgs = {
  where: Api_Secret_Key_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Api_Secret_Key_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Billing_HistoryArgs = {
  where: Billing_History_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Billing_History_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_BuyerArgs = {
  where: Buyer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Buyer_By_PkArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CheckoutArgs = {
  where: Checkout_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Checkout_Active_ErrorArgs = {
  where: Checkout_Active_Error_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Checkout_Active_Error_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Checkout_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ContractArgs = {
  where: Contract_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Contract_Authorized_SellerArgs = {
  where: Contract_Authorized_Seller_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Contract_Authorized_Seller_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Contract_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CustomerArgs = {
  where: Customer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Customer_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Detailed_AnalyticsArgs = {
  where: Detailed_Analytics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Detailed_Analytics_By_PkArgs = {
  checkout_id: Scalars['uuid']['input'];
  transaction_created_at: Scalars['timestamptz']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Developer_Auth_SettingArgs = {
  where: Developer_Auth_Setting_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Developer_Auth_Setting_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Email_Otp_UserArgs = {
  where: Email_Otp_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Email_Otp_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Embedded_WalletArgs = {
  where: Embedded_Wallet_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Embedded_Wallet_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Ews_Authed_UserArgs = {
  where: Ews_Authed_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Ews_Authed_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Fiat_PayoutArgs = {
  where: Fiat_Payout_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fiat_Payout_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Float_WalletArgs = {
  where: Float_Wallet_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Float_Wallet_By_PkArgs = {
  address: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_OauthArgs = {
  where: Oauth_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Oauth_Access_TokenArgs = {
  where: Oauth_Access_Token_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Oauth_Access_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Oauth_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Oauth_Platform_MappingArgs = {
  where: Oauth_Platform_Mapping_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Oauth_Platform_Mapping_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Paper_Access_KeyArgs = {
  where: Paper_Access_Key_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Paper_Access_Key_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_SellerArgs = {
  where: Seller_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Seller_Billing_PlanArgs = {
  where: Seller_Billing_Plan_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Seller_Billing_Plan_By_PkArgs = {
  seller_id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Seller_By_PkArgs = {
  id: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ShareArgs = {
  where: Share_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Share_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_TransactionArgs = {
  where: Transaction_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Transaction_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Transaction_On_Chain_AttemptArgs = {
  where: Transaction_On_Chain_Attempt_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Transaction_On_Chain_Attempt_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Wallet_UserArgs = {
  where: Wallet_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Wallet_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_WebhookArgs = {
  where: Webhook_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Webhook_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Webhook_EventArgs = {
  where: Webhook_Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Webhook_Event_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsert_AccountArgs = {
  objects: Array<Account_Insert_Input>;
  on_conflict?: InputMaybe<Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Account_InviteArgs = {
  objects: Array<Account_Invite_Insert_Input>;
  on_conflict?: InputMaybe<Account_Invite_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Account_Invite_OneArgs = {
  object: Account_Invite_Insert_Input;
  on_conflict?: InputMaybe<Account_Invite_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Account_OneArgs = {
  object: Account_Insert_Input;
  on_conflict?: InputMaybe<Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_AirdropArgs = {
  objects: Array<Airdrop_Insert_Input>;
  on_conflict?: InputMaybe<Airdrop_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Airdrop_OneArgs = {
  object: Airdrop_Insert_Input;
  on_conflict?: InputMaybe<Airdrop_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Api_Secret_KeyArgs = {
  objects: Array<Api_Secret_Key_Insert_Input>;
  on_conflict?: InputMaybe<Api_Secret_Key_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Api_Secret_Key_OneArgs = {
  object: Api_Secret_Key_Insert_Input;
  on_conflict?: InputMaybe<Api_Secret_Key_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Billing_HistoryArgs = {
  objects: Array<Billing_History_Insert_Input>;
  on_conflict?: InputMaybe<Billing_History_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Billing_History_OneArgs = {
  object: Billing_History_Insert_Input;
  on_conflict?: InputMaybe<Billing_History_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_BuyerArgs = {
  objects: Array<Buyer_Insert_Input>;
  on_conflict?: InputMaybe<Buyer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Buyer_OneArgs = {
  object: Buyer_Insert_Input;
  on_conflict?: InputMaybe<Buyer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CheckoutArgs = {
  objects: Array<Checkout_Insert_Input>;
  on_conflict?: InputMaybe<Checkout_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Checkout_Active_ErrorArgs = {
  objects: Array<Checkout_Active_Error_Insert_Input>;
  on_conflict?: InputMaybe<Checkout_Active_Error_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Checkout_Active_Error_OneArgs = {
  object: Checkout_Active_Error_Insert_Input;
  on_conflict?: InputMaybe<Checkout_Active_Error_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Checkout_OneArgs = {
  object: Checkout_Insert_Input;
  on_conflict?: InputMaybe<Checkout_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ContractArgs = {
  objects: Array<Contract_Insert_Input>;
  on_conflict?: InputMaybe<Contract_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Contract_Authorized_SellerArgs = {
  objects: Array<Contract_Authorized_Seller_Insert_Input>;
  on_conflict?: InputMaybe<Contract_Authorized_Seller_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Contract_Authorized_Seller_OneArgs = {
  object: Contract_Authorized_Seller_Insert_Input;
  on_conflict?: InputMaybe<Contract_Authorized_Seller_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Contract_OneArgs = {
  object: Contract_Insert_Input;
  on_conflict?: InputMaybe<Contract_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CustomerArgs = {
  objects: Array<Customer_Insert_Input>;
  on_conflict?: InputMaybe<Customer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Customer_OneArgs = {
  object: Customer_Insert_Input;
  on_conflict?: InputMaybe<Customer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Detailed_AnalyticsArgs = {
  objects: Array<Detailed_Analytics_Insert_Input>;
  on_conflict?: InputMaybe<Detailed_Analytics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Detailed_Analytics_OneArgs = {
  object: Detailed_Analytics_Insert_Input;
  on_conflict?: InputMaybe<Detailed_Analytics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Developer_Auth_SettingArgs = {
  objects: Array<Developer_Auth_Setting_Insert_Input>;
  on_conflict?: InputMaybe<Developer_Auth_Setting_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Developer_Auth_Setting_OneArgs = {
  object: Developer_Auth_Setting_Insert_Input;
  on_conflict?: InputMaybe<Developer_Auth_Setting_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Email_Otp_UserArgs = {
  objects: Array<Email_Otp_User_Insert_Input>;
  on_conflict?: InputMaybe<Email_Otp_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Email_Otp_User_OneArgs = {
  object: Email_Otp_User_Insert_Input;
  on_conflict?: InputMaybe<Email_Otp_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Embedded_WalletArgs = {
  objects: Array<Embedded_Wallet_Insert_Input>;
  on_conflict?: InputMaybe<Embedded_Wallet_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Embedded_Wallet_OneArgs = {
  object: Embedded_Wallet_Insert_Input;
  on_conflict?: InputMaybe<Embedded_Wallet_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Ews_Authed_UserArgs = {
  objects: Array<Ews_Authed_User_Insert_Input>;
  on_conflict?: InputMaybe<Ews_Authed_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Ews_Authed_User_OneArgs = {
  object: Ews_Authed_User_Insert_Input;
  on_conflict?: InputMaybe<Ews_Authed_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fiat_PayoutArgs = {
  objects: Array<Fiat_Payout_Insert_Input>;
  on_conflict?: InputMaybe<Fiat_Payout_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fiat_Payout_OneArgs = {
  object: Fiat_Payout_Insert_Input;
  on_conflict?: InputMaybe<Fiat_Payout_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Float_WalletArgs = {
  objects: Array<Float_Wallet_Insert_Input>;
  on_conflict?: InputMaybe<Float_Wallet_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Float_Wallet_OneArgs = {
  object: Float_Wallet_Insert_Input;
  on_conflict?: InputMaybe<Float_Wallet_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_OauthArgs = {
  objects: Array<Oauth_Insert_Input>;
  on_conflict?: InputMaybe<Oauth_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_Access_TokenArgs = {
  objects: Array<Oauth_Access_Token_Insert_Input>;
  on_conflict?: InputMaybe<Oauth_Access_Token_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_Access_Token_OneArgs = {
  object: Oauth_Access_Token_Insert_Input;
  on_conflict?: InputMaybe<Oauth_Access_Token_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_OneArgs = {
  object: Oauth_Insert_Input;
  on_conflict?: InputMaybe<Oauth_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_Platform_MappingArgs = {
  objects: Array<Oauth_Platform_Mapping_Insert_Input>;
  on_conflict?: InputMaybe<Oauth_Platform_Mapping_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_Platform_Mapping_OneArgs = {
  object: Oauth_Platform_Mapping_Insert_Input;
  on_conflict?: InputMaybe<Oauth_Platform_Mapping_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Paper_Access_KeyArgs = {
  objects: Array<Paper_Access_Key_Insert_Input>;
  on_conflict?: InputMaybe<Paper_Access_Key_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Paper_Access_Key_OneArgs = {
  object: Paper_Access_Key_Insert_Input;
  on_conflict?: InputMaybe<Paper_Access_Key_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_SellerArgs = {
  objects: Array<Seller_Insert_Input>;
  on_conflict?: InputMaybe<Seller_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Seller_Billing_PlanArgs = {
  objects: Array<Seller_Billing_Plan_Insert_Input>;
  on_conflict?: InputMaybe<Seller_Billing_Plan_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Seller_Billing_Plan_OneArgs = {
  object: Seller_Billing_Plan_Insert_Input;
  on_conflict?: InputMaybe<Seller_Billing_Plan_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Seller_OneArgs = {
  object: Seller_Insert_Input;
  on_conflict?: InputMaybe<Seller_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ShareArgs = {
  objects: Array<Share_Insert_Input>;
  on_conflict?: InputMaybe<Share_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Share_OneArgs = {
  object: Share_Insert_Input;
  on_conflict?: InputMaybe<Share_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TransactionArgs = {
  objects: Array<Transaction_Insert_Input>;
  on_conflict?: InputMaybe<Transaction_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transaction_On_Chain_AttemptArgs = {
  objects: Array<Transaction_On_Chain_Attempt_Insert_Input>;
  on_conflict?: InputMaybe<Transaction_On_Chain_Attempt_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transaction_On_Chain_Attempt_OneArgs = {
  object: Transaction_On_Chain_Attempt_Insert_Input;
  on_conflict?: InputMaybe<Transaction_On_Chain_Attempt_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transaction_OneArgs = {
  object: Transaction_Insert_Input;
  on_conflict?: InputMaybe<Transaction_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Wallet_UserArgs = {
  objects: Array<Wallet_User_Insert_Input>;
  on_conflict?: InputMaybe<Wallet_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Wallet_User_OneArgs = {
  object: Wallet_User_Insert_Input;
  on_conflict?: InputMaybe<Wallet_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_WebhookArgs = {
  objects: Array<Webhook_Insert_Input>;
  on_conflict?: InputMaybe<Webhook_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Webhook_EventArgs = {
  objects: Array<Webhook_Event_Insert_Input>;
  on_conflict?: InputMaybe<Webhook_Event_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Webhook_Event_OneArgs = {
  object: Webhook_Event_Insert_Input;
  on_conflict?: InputMaybe<Webhook_Event_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Webhook_OneArgs = {
  object: Webhook_Insert_Input;
  on_conflict?: InputMaybe<Webhook_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AccountArgs = {
  _inc?: InputMaybe<Account_Inc_Input>;
  _set?: InputMaybe<Account_Set_Input>;
  where: Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Account_By_PkArgs = {
  _inc?: InputMaybe<Account_Inc_Input>;
  _set?: InputMaybe<Account_Set_Input>;
  pk_columns: Account_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Account_InviteArgs = {
  _set?: InputMaybe<Account_Invite_Set_Input>;
  where: Account_Invite_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Account_Invite_By_PkArgs = {
  _set?: InputMaybe<Account_Invite_Set_Input>;
  pk_columns: Account_Invite_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Account_Invite_ManyArgs = {
  updates: Array<Account_Invite_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Account_ManyArgs = {
  updates: Array<Account_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AirdropArgs = {
  _set?: InputMaybe<Airdrop_Set_Input>;
  where: Airdrop_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Airdrop_By_PkArgs = {
  _set?: InputMaybe<Airdrop_Set_Input>;
  pk_columns: Airdrop_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Airdrop_ManyArgs = {
  updates: Array<Airdrop_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Api_Secret_KeyArgs = {
  _set?: InputMaybe<Api_Secret_Key_Set_Input>;
  where: Api_Secret_Key_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Api_Secret_Key_By_PkArgs = {
  _set?: InputMaybe<Api_Secret_Key_Set_Input>;
  pk_columns: Api_Secret_Key_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Api_Secret_Key_ManyArgs = {
  updates: Array<Api_Secret_Key_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Billing_HistoryArgs = {
  _inc?: InputMaybe<Billing_History_Inc_Input>;
  _set?: InputMaybe<Billing_History_Set_Input>;
  where: Billing_History_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Billing_History_By_PkArgs = {
  _inc?: InputMaybe<Billing_History_Inc_Input>;
  _set?: InputMaybe<Billing_History_Set_Input>;
  pk_columns: Billing_History_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Billing_History_ManyArgs = {
  updates: Array<Billing_History_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_BuyerArgs = {
  _set?: InputMaybe<Buyer_Set_Input>;
  where: Buyer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Buyer_By_PkArgs = {
  _set?: InputMaybe<Buyer_Set_Input>;
  pk_columns: Buyer_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Buyer_ManyArgs = {
  updates: Array<Buyer_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CheckoutArgs = {
  _append?: InputMaybe<Checkout_Append_Input>;
  _delete_at_path?: InputMaybe<Checkout_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Checkout_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Checkout_Delete_Key_Input>;
  _inc?: InputMaybe<Checkout_Inc_Input>;
  _prepend?: InputMaybe<Checkout_Prepend_Input>;
  _set?: InputMaybe<Checkout_Set_Input>;
  where: Checkout_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Checkout_Active_ErrorArgs = {
  _append?: InputMaybe<Checkout_Active_Error_Append_Input>;
  _delete_at_path?: InputMaybe<Checkout_Active_Error_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Checkout_Active_Error_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Checkout_Active_Error_Delete_Key_Input>;
  _prepend?: InputMaybe<Checkout_Active_Error_Prepend_Input>;
  _set?: InputMaybe<Checkout_Active_Error_Set_Input>;
  where: Checkout_Active_Error_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Checkout_Active_Error_By_PkArgs = {
  _append?: InputMaybe<Checkout_Active_Error_Append_Input>;
  _delete_at_path?: InputMaybe<Checkout_Active_Error_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Checkout_Active_Error_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Checkout_Active_Error_Delete_Key_Input>;
  _prepend?: InputMaybe<Checkout_Active_Error_Prepend_Input>;
  _set?: InputMaybe<Checkout_Active_Error_Set_Input>;
  pk_columns: Checkout_Active_Error_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Checkout_Active_Error_ManyArgs = {
  updates: Array<Checkout_Active_Error_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Checkout_By_PkArgs = {
  _append?: InputMaybe<Checkout_Append_Input>;
  _delete_at_path?: InputMaybe<Checkout_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Checkout_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Checkout_Delete_Key_Input>;
  _inc?: InputMaybe<Checkout_Inc_Input>;
  _prepend?: InputMaybe<Checkout_Prepend_Input>;
  _set?: InputMaybe<Checkout_Set_Input>;
  pk_columns: Checkout_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Checkout_ManyArgs = {
  updates: Array<Checkout_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ContractArgs = {
  _append?: InputMaybe<Contract_Append_Input>;
  _delete_at_path?: InputMaybe<Contract_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Contract_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Contract_Delete_Key_Input>;
  _prepend?: InputMaybe<Contract_Prepend_Input>;
  _set?: InputMaybe<Contract_Set_Input>;
  where: Contract_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Contract_Authorized_SellerArgs = {
  _set?: InputMaybe<Contract_Authorized_Seller_Set_Input>;
  where: Contract_Authorized_Seller_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Contract_Authorized_Seller_By_PkArgs = {
  _set?: InputMaybe<Contract_Authorized_Seller_Set_Input>;
  pk_columns: Contract_Authorized_Seller_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Contract_Authorized_Seller_ManyArgs = {
  updates: Array<Contract_Authorized_Seller_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Contract_By_PkArgs = {
  _append?: InputMaybe<Contract_Append_Input>;
  _delete_at_path?: InputMaybe<Contract_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Contract_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Contract_Delete_Key_Input>;
  _prepend?: InputMaybe<Contract_Prepend_Input>;
  _set?: InputMaybe<Contract_Set_Input>;
  pk_columns: Contract_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Contract_ManyArgs = {
  updates: Array<Contract_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CustomerArgs = {
  _set?: InputMaybe<Customer_Set_Input>;
  where: Customer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Customer_By_PkArgs = {
  _set?: InputMaybe<Customer_Set_Input>;
  pk_columns: Customer_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Customer_ManyArgs = {
  updates: Array<Customer_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Detailed_AnalyticsArgs = {
  _inc?: InputMaybe<Detailed_Analytics_Inc_Input>;
  _set?: InputMaybe<Detailed_Analytics_Set_Input>;
  where: Detailed_Analytics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Detailed_Analytics_By_PkArgs = {
  _inc?: InputMaybe<Detailed_Analytics_Inc_Input>;
  _set?: InputMaybe<Detailed_Analytics_Set_Input>;
  pk_columns: Detailed_Analytics_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Detailed_Analytics_ManyArgs = {
  updates: Array<Detailed_Analytics_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Developer_Auth_SettingArgs = {
  _append?: InputMaybe<Developer_Auth_Setting_Append_Input>;
  _delete_at_path?: InputMaybe<Developer_Auth_Setting_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Developer_Auth_Setting_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Developer_Auth_Setting_Delete_Key_Input>;
  _prepend?: InputMaybe<Developer_Auth_Setting_Prepend_Input>;
  _set?: InputMaybe<Developer_Auth_Setting_Set_Input>;
  where: Developer_Auth_Setting_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Developer_Auth_Setting_By_PkArgs = {
  _append?: InputMaybe<Developer_Auth_Setting_Append_Input>;
  _delete_at_path?: InputMaybe<Developer_Auth_Setting_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Developer_Auth_Setting_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Developer_Auth_Setting_Delete_Key_Input>;
  _prepend?: InputMaybe<Developer_Auth_Setting_Prepend_Input>;
  _set?: InputMaybe<Developer_Auth_Setting_Set_Input>;
  pk_columns: Developer_Auth_Setting_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Developer_Auth_Setting_ManyArgs = {
  updates: Array<Developer_Auth_Setting_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Email_Otp_UserArgs = {
  _set?: InputMaybe<Email_Otp_User_Set_Input>;
  where: Email_Otp_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Email_Otp_User_By_PkArgs = {
  _set?: InputMaybe<Email_Otp_User_Set_Input>;
  pk_columns: Email_Otp_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Email_Otp_User_ManyArgs = {
  updates: Array<Email_Otp_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Embedded_WalletArgs = {
  _set?: InputMaybe<Embedded_Wallet_Set_Input>;
  where: Embedded_Wallet_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Embedded_Wallet_By_PkArgs = {
  _set?: InputMaybe<Embedded_Wallet_Set_Input>;
  pk_columns: Embedded_Wallet_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Embedded_Wallet_ManyArgs = {
  updates: Array<Embedded_Wallet_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Ews_Authed_UserArgs = {
  _set?: InputMaybe<Ews_Authed_User_Set_Input>;
  where: Ews_Authed_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Ews_Authed_User_By_PkArgs = {
  _set?: InputMaybe<Ews_Authed_User_Set_Input>;
  pk_columns: Ews_Authed_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Ews_Authed_User_ManyArgs = {
  updates: Array<Ews_Authed_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Fiat_PayoutArgs = {
  _inc?: InputMaybe<Fiat_Payout_Inc_Input>;
  _set?: InputMaybe<Fiat_Payout_Set_Input>;
  where: Fiat_Payout_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fiat_Payout_By_PkArgs = {
  _inc?: InputMaybe<Fiat_Payout_Inc_Input>;
  _set?: InputMaybe<Fiat_Payout_Set_Input>;
  pk_columns: Fiat_Payout_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fiat_Payout_ManyArgs = {
  updates: Array<Fiat_Payout_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Float_WalletArgs = {
  _set?: InputMaybe<Float_Wallet_Set_Input>;
  where: Float_Wallet_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Float_Wallet_By_PkArgs = {
  _set?: InputMaybe<Float_Wallet_Set_Input>;
  pk_columns: Float_Wallet_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Float_Wallet_ManyArgs = {
  updates: Array<Float_Wallet_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_OauthArgs = {
  _append?: InputMaybe<Oauth_Append_Input>;
  _delete_at_path?: InputMaybe<Oauth_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Oauth_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Oauth_Delete_Key_Input>;
  _prepend?: InputMaybe<Oauth_Prepend_Input>;
  _set?: InputMaybe<Oauth_Set_Input>;
  where: Oauth_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Access_TokenArgs = {
  _set?: InputMaybe<Oauth_Access_Token_Set_Input>;
  where: Oauth_Access_Token_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Access_Token_By_PkArgs = {
  _set?: InputMaybe<Oauth_Access_Token_Set_Input>;
  pk_columns: Oauth_Access_Token_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Access_Token_ManyArgs = {
  updates: Array<Oauth_Access_Token_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_By_PkArgs = {
  _append?: InputMaybe<Oauth_Append_Input>;
  _delete_at_path?: InputMaybe<Oauth_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Oauth_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Oauth_Delete_Key_Input>;
  _prepend?: InputMaybe<Oauth_Prepend_Input>;
  _set?: InputMaybe<Oauth_Set_Input>;
  pk_columns: Oauth_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_ManyArgs = {
  updates: Array<Oauth_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Platform_MappingArgs = {
  _set?: InputMaybe<Oauth_Platform_Mapping_Set_Input>;
  where: Oauth_Platform_Mapping_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Platform_Mapping_By_PkArgs = {
  _set?: InputMaybe<Oauth_Platform_Mapping_Set_Input>;
  pk_columns: Oauth_Platform_Mapping_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Platform_Mapping_ManyArgs = {
  updates: Array<Oauth_Platform_Mapping_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Paper_Access_KeyArgs = {
  _set?: InputMaybe<Paper_Access_Key_Set_Input>;
  where: Paper_Access_Key_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Paper_Access_Key_By_PkArgs = {
  _set?: InputMaybe<Paper_Access_Key_Set_Input>;
  pk_columns: Paper_Access_Key_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Paper_Access_Key_ManyArgs = {
  updates: Array<Paper_Access_Key_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_SellerArgs = {
  _append?: InputMaybe<Seller_Append_Input>;
  _delete_at_path?: InputMaybe<Seller_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Seller_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Seller_Delete_Key_Input>;
  _inc?: InputMaybe<Seller_Inc_Input>;
  _prepend?: InputMaybe<Seller_Prepend_Input>;
  _set?: InputMaybe<Seller_Set_Input>;
  where: Seller_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Seller_Billing_PlanArgs = {
  _inc?: InputMaybe<Seller_Billing_Plan_Inc_Input>;
  _set?: InputMaybe<Seller_Billing_Plan_Set_Input>;
  where: Seller_Billing_Plan_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Seller_Billing_Plan_By_PkArgs = {
  _inc?: InputMaybe<Seller_Billing_Plan_Inc_Input>;
  _set?: InputMaybe<Seller_Billing_Plan_Set_Input>;
  pk_columns: Seller_Billing_Plan_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Seller_Billing_Plan_ManyArgs = {
  updates: Array<Seller_Billing_Plan_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Seller_By_PkArgs = {
  _append?: InputMaybe<Seller_Append_Input>;
  _delete_at_path?: InputMaybe<Seller_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Seller_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Seller_Delete_Key_Input>;
  _inc?: InputMaybe<Seller_Inc_Input>;
  _prepend?: InputMaybe<Seller_Prepend_Input>;
  _set?: InputMaybe<Seller_Set_Input>;
  pk_columns: Seller_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Seller_ManyArgs = {
  updates: Array<Seller_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ShareArgs = {
  _set?: InputMaybe<Share_Set_Input>;
  where: Share_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Share_By_PkArgs = {
  _set?: InputMaybe<Share_Set_Input>;
  pk_columns: Share_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Share_ManyArgs = {
  updates: Array<Share_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_TransactionArgs = {
  _append?: InputMaybe<Transaction_Append_Input>;
  _delete_at_path?: InputMaybe<Transaction_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Transaction_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Transaction_Delete_Key_Input>;
  _inc?: InputMaybe<Transaction_Inc_Input>;
  _prepend?: InputMaybe<Transaction_Prepend_Input>;
  _set?: InputMaybe<Transaction_Set_Input>;
  where: Transaction_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Transaction_By_PkArgs = {
  _append?: InputMaybe<Transaction_Append_Input>;
  _delete_at_path?: InputMaybe<Transaction_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Transaction_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Transaction_Delete_Key_Input>;
  _inc?: InputMaybe<Transaction_Inc_Input>;
  _prepend?: InputMaybe<Transaction_Prepend_Input>;
  _set?: InputMaybe<Transaction_Set_Input>;
  pk_columns: Transaction_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Transaction_ManyArgs = {
  updates: Array<Transaction_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Transaction_On_Chain_AttemptArgs = {
  _set?: InputMaybe<Transaction_On_Chain_Attempt_Set_Input>;
  where: Transaction_On_Chain_Attempt_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Transaction_On_Chain_Attempt_By_PkArgs = {
  _set?: InputMaybe<Transaction_On_Chain_Attempt_Set_Input>;
  pk_columns: Transaction_On_Chain_Attempt_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Transaction_On_Chain_Attempt_ManyArgs = {
  updates: Array<Transaction_On_Chain_Attempt_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Wallet_UserArgs = {
  _set?: InputMaybe<Wallet_User_Set_Input>;
  where: Wallet_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Wallet_User_By_PkArgs = {
  _set?: InputMaybe<Wallet_User_Set_Input>;
  pk_columns: Wallet_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Wallet_User_ManyArgs = {
  updates: Array<Wallet_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_WebhookArgs = {
  _set?: InputMaybe<Webhook_Set_Input>;
  where: Webhook_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Webhook_By_PkArgs = {
  _set?: InputMaybe<Webhook_Set_Input>;
  pk_columns: Webhook_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Webhook_EventArgs = {
  _inc?: InputMaybe<Webhook_Event_Inc_Input>;
  _set?: InputMaybe<Webhook_Event_Set_Input>;
  where: Webhook_Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Webhook_Event_By_PkArgs = {
  _inc?: InputMaybe<Webhook_Event_Inc_Input>;
  _set?: InputMaybe<Webhook_Event_Set_Input>;
  pk_columns: Webhook_Event_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Webhook_Event_ManyArgs = {
  updates: Array<Webhook_Event_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Webhook_ManyArgs = {
  updates: Array<Webhook_Updates>;
};

/** columns and relationships of "nft_checkouts_overview" */
export type Nft_Checkouts_Overview = {
  __typename?: 'nft_checkouts_overview';
  contract_chain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
};

/** aggregated selection of "nft_checkouts_overview" */
export type Nft_Checkouts_Overview_Aggregate = {
  __typename?: 'nft_checkouts_overview_aggregate';
  aggregate?: Maybe<Nft_Checkouts_Overview_Aggregate_Fields>;
  nodes: Array<Nft_Checkouts_Overview>;
};

/** aggregate fields of "nft_checkouts_overview" */
export type Nft_Checkouts_Overview_Aggregate_Fields = {
  __typename?: 'nft_checkouts_overview_aggregate_fields';
  avg?: Maybe<Nft_Checkouts_Overview_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Nft_Checkouts_Overview_Max_Fields>;
  min?: Maybe<Nft_Checkouts_Overview_Min_Fields>;
  stddev?: Maybe<Nft_Checkouts_Overview_Stddev_Fields>;
  stddev_pop?: Maybe<Nft_Checkouts_Overview_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Nft_Checkouts_Overview_Stddev_Samp_Fields>;
  sum?: Maybe<Nft_Checkouts_Overview_Sum_Fields>;
  var_pop?: Maybe<Nft_Checkouts_Overview_Var_Pop_Fields>;
  var_samp?: Maybe<Nft_Checkouts_Overview_Var_Samp_Fields>;
  variance?: Maybe<Nft_Checkouts_Overview_Variance_Fields>;
};


/** aggregate fields of "nft_checkouts_overview" */
export type Nft_Checkouts_Overview_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Nft_Checkouts_Overview_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Nft_Checkouts_Overview_Avg_Fields = {
  __typename?: 'nft_checkouts_overview_avg_fields';
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "nft_checkouts_overview". All fields are combined with a logical 'AND'. */
export type Nft_Checkouts_Overview_Bool_Exp = {
  _and?: InputMaybe<Array<Nft_Checkouts_Overview_Bool_Exp>>;
  _not?: InputMaybe<Nft_Checkouts_Overview_Bool_Exp>;
  _or?: InputMaybe<Array<Nft_Checkouts_Overview_Bool_Exp>>;
  contract_chain?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  locked_price_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  total_price_usd_cents?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Nft_Checkouts_Overview_Max_Fields = {
  __typename?: 'nft_checkouts_overview_max_fields';
  contract_chain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Nft_Checkouts_Overview_Min_Fields = {
  __typename?: 'nft_checkouts_overview_min_fields';
  contract_chain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
};

/** Ordering options when selecting data from "nft_checkouts_overview". */
export type Nft_Checkouts_Overview_Order_By = {
  contract_chain?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  locked_price_usd_cents?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  total_price_usd_cents?: InputMaybe<Order_By>;
};

/** select columns of table "nft_checkouts_overview" */
export enum Nft_Checkouts_Overview_Select_Column {
  /** column name */
  ContractChain = 'contract_chain',
  /** column name */
  Id = 'id',
  /** column name */
  LockedPriceUsdCents = 'locked_price_usd_cents',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  TotalPriceUsdCents = 'total_price_usd_cents'
}

/** aggregate stddev on columns */
export type Nft_Checkouts_Overview_Stddev_Fields = {
  __typename?: 'nft_checkouts_overview_stddev_fields';
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Nft_Checkouts_Overview_Stddev_Pop_Fields = {
  __typename?: 'nft_checkouts_overview_stddev_pop_fields';
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Nft_Checkouts_Overview_Stddev_Samp_Fields = {
  __typename?: 'nft_checkouts_overview_stddev_samp_fields';
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "nft_checkouts_overview" */
export type Nft_Checkouts_Overview_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Nft_Checkouts_Overview_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Nft_Checkouts_Overview_Stream_Cursor_Value_Input = {
  contract_chain?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  locked_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  total_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Nft_Checkouts_Overview_Sum_Fields = {
  __typename?: 'nft_checkouts_overview_sum_fields';
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Nft_Checkouts_Overview_Var_Pop_Fields = {
  __typename?: 'nft_checkouts_overview_var_pop_fields';
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Nft_Checkouts_Overview_Var_Samp_Fields = {
  __typename?: 'nft_checkouts_overview_var_samp_fields';
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Nft_Checkouts_Overview_Variance_Fields = {
  __typename?: 'nft_checkouts_overview_variance_fields';
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** OAuth client keys and Wallet client Keys details */
export type Oauth = {
  __typename?: 'oauth';
  allowlisted_domains: Scalars['jsonb']['output'];
  application_image_url?: Maybe<Scalars['String']['output']>;
  application_name: Scalars['String']['output'];
  client_id: Scalars['uuid']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  owner_id: Scalars['String']['output'];
  recovery_share_management: Scalars['String']['output'];
  revoked_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  seller?: Maybe<Seller>;
  type: Scalars['String']['output'];
};


/** OAuth client keys and Wallet client Keys details */
export type OauthAllowlisted_DomainsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "oauth_access_token" */
export type Oauth_Access_Token = {
  __typename?: 'oauth_access_token';
  access_token: Scalars['String']['output'];
  client_id: Scalars['uuid']['output'];
  created_at: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  revoked_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "oauth_access_token" */
export type Oauth_Access_Token_Aggregate = {
  __typename?: 'oauth_access_token_aggregate';
  aggregate?: Maybe<Oauth_Access_Token_Aggregate_Fields>;
  nodes: Array<Oauth_Access_Token>;
};

/** aggregate fields of "oauth_access_token" */
export type Oauth_Access_Token_Aggregate_Fields = {
  __typename?: 'oauth_access_token_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Oauth_Access_Token_Max_Fields>;
  min?: Maybe<Oauth_Access_Token_Min_Fields>;
};


/** aggregate fields of "oauth_access_token" */
export type Oauth_Access_Token_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Oauth_Access_Token_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "oauth_access_token". All fields are combined with a logical 'AND'. */
export type Oauth_Access_Token_Bool_Exp = {
  _and?: InputMaybe<Array<Oauth_Access_Token_Bool_Exp>>;
  _not?: InputMaybe<Oauth_Access_Token_Bool_Exp>;
  _or?: InputMaybe<Array<Oauth_Access_Token_Bool_Exp>>;
  access_token?: InputMaybe<String_Comparison_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "oauth_access_token" */
export enum Oauth_Access_Token_Constraint {
  /** unique or primary key constraint on columns "access_token" */
  OauthAccessTokenAccessTokenKey = 'oauth_access_token_access_token_key',
  /** unique or primary key constraint on columns "client_id", "email", "access_token" */
  OauthAccessTokenClientIdEmailAccessTokenKey = 'oauth_access_token_client_id_email_access_token_key',
  /** unique or primary key constraint on columns "id" */
  OauthAccessTokenPkey = 'oauth_access_token_pkey'
}

/** input type for inserting data into table "oauth_access_token" */
export type Oauth_Access_Token_Insert_Input = {
  access_token?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Oauth_Access_Token_Max_Fields = {
  __typename?: 'oauth_access_token_max_fields';
  access_token?: Maybe<Scalars['String']['output']>;
  client_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Oauth_Access_Token_Min_Fields = {
  __typename?: 'oauth_access_token_min_fields';
  access_token?: Maybe<Scalars['String']['output']>;
  client_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "oauth_access_token" */
export type Oauth_Access_Token_Mutation_Response = {
  __typename?: 'oauth_access_token_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Oauth_Access_Token>;
};

/** on_conflict condition type for table "oauth_access_token" */
export type Oauth_Access_Token_On_Conflict = {
  constraint: Oauth_Access_Token_Constraint;
  update_columns?: Array<Oauth_Access_Token_Update_Column>;
  where?: InputMaybe<Oauth_Access_Token_Bool_Exp>;
};

/** Ordering options when selecting data from "oauth_access_token". */
export type Oauth_Access_Token_Order_By = {
  access_token?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  revoked_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: oauth_access_token */
export type Oauth_Access_Token_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "oauth_access_token" */
export enum Oauth_Access_Token_Select_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  RevokedAt = 'revoked_at'
}

/** input type for updating data in table "oauth_access_token" */
export type Oauth_Access_Token_Set_Input = {
  access_token?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "oauth_access_token" */
export type Oauth_Access_Token_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Oauth_Access_Token_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Oauth_Access_Token_Stream_Cursor_Value_Input = {
  access_token?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "oauth_access_token" */
export enum Oauth_Access_Token_Update_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  RevokedAt = 'revoked_at'
}

export type Oauth_Access_Token_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Oauth_Access_Token_Set_Input>;
  /** filter the rows which have to be updated */
  where: Oauth_Access_Token_Bool_Exp;
};

/** aggregated selection of "oauth" */
export type Oauth_Aggregate = {
  __typename?: 'oauth_aggregate';
  aggregate?: Maybe<Oauth_Aggregate_Fields>;
  nodes: Array<Oauth>;
};

/** aggregate fields of "oauth" */
export type Oauth_Aggregate_Fields = {
  __typename?: 'oauth_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Oauth_Max_Fields>;
  min?: Maybe<Oauth_Min_Fields>;
};


/** aggregate fields of "oauth" */
export type Oauth_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Oauth_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Oauth_Append_Input = {
  allowlisted_domains?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "oauth". All fields are combined with a logical 'AND'. */
export type Oauth_Bool_Exp = {
  _and?: InputMaybe<Array<Oauth_Bool_Exp>>;
  _not?: InputMaybe<Oauth_Bool_Exp>;
  _or?: InputMaybe<Array<Oauth_Bool_Exp>>;
  allowlisted_domains?: InputMaybe<Jsonb_Comparison_Exp>;
  application_image_url?: InputMaybe<String_Comparison_Exp>;
  application_name?: InputMaybe<String_Comparison_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  recovery_share_management?: InputMaybe<String_Comparison_Exp>;
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  seller?: InputMaybe<Seller_Bool_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "oauth" */
export enum Oauth_Constraint {
  /** unique or primary key constraint on columns "client_id" */
  OAuthClientIdKey = 'OAuth_client_id_key',
  /** unique or primary key constraint on columns "id" */
  OAuthPkey = 'OAuth_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Oauth_Delete_At_Path_Input = {
  allowlisted_domains?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Oauth_Delete_Elem_Input = {
  allowlisted_domains?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Oauth_Delete_Key_Input = {
  allowlisted_domains?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "oauth" */
export type Oauth_Insert_Input = {
  allowlisted_domains?: InputMaybe<Scalars['jsonb']['input']>;
  application_image_url?: InputMaybe<Scalars['String']['input']>;
  application_name?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  recovery_share_management?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  seller?: InputMaybe<Seller_Obj_Rel_Insert_Input>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Oauth_Max_Fields = {
  __typename?: 'oauth_max_fields';
  application_image_url?: Maybe<Scalars['String']['output']>;
  application_name?: Maybe<Scalars['String']['output']>;
  client_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  recovery_share_management?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Oauth_Min_Fields = {
  __typename?: 'oauth_min_fields';
  application_image_url?: Maybe<Scalars['String']['output']>;
  application_name?: Maybe<Scalars['String']['output']>;
  client_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  recovery_share_management?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "oauth" */
export type Oauth_Mutation_Response = {
  __typename?: 'oauth_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Oauth>;
};

/** input type for inserting object relation for remote table "oauth" */
export type Oauth_Obj_Rel_Insert_Input = {
  data: Oauth_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Oauth_On_Conflict>;
};

/** on_conflict condition type for table "oauth" */
export type Oauth_On_Conflict = {
  constraint: Oauth_Constraint;
  update_columns?: Array<Oauth_Update_Column>;
  where?: InputMaybe<Oauth_Bool_Exp>;
};

/** Ordering options when selecting data from "oauth". */
export type Oauth_Order_By = {
  allowlisted_domains?: InputMaybe<Order_By>;
  application_image_url?: InputMaybe<Order_By>;
  application_name?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  recovery_share_management?: InputMaybe<Order_By>;
  revoked_at?: InputMaybe<Order_By>;
  seller?: InputMaybe<Seller_Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: oauth */
export type Oauth_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** Maps an owner ID and their own unique customer ID to a oauth client ID */
export type Oauth_Platform_Mapping = {
  __typename?: 'oauth_platform_mapping';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  oauth: Oauth;
  oauth_id: Scalars['uuid']['output'];
  owner_id: Scalars['String']['output'];
  platform_user_id: Scalars['String']['output'];
  revoked_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_Aggregate = {
  __typename?: 'oauth_platform_mapping_aggregate';
  aggregate?: Maybe<Oauth_Platform_Mapping_Aggregate_Fields>;
  nodes: Array<Oauth_Platform_Mapping>;
};

/** aggregate fields of "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_Aggregate_Fields = {
  __typename?: 'oauth_platform_mapping_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Oauth_Platform_Mapping_Max_Fields>;
  min?: Maybe<Oauth_Platform_Mapping_Min_Fields>;
};


/** aggregate fields of "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Oauth_Platform_Mapping_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "oauth_platform_mapping". All fields are combined with a logical 'AND'. */
export type Oauth_Platform_Mapping_Bool_Exp = {
  _and?: InputMaybe<Array<Oauth_Platform_Mapping_Bool_Exp>>;
  _not?: InputMaybe<Oauth_Platform_Mapping_Bool_Exp>;
  _or?: InputMaybe<Array<Oauth_Platform_Mapping_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  oauth?: InputMaybe<Oauth_Bool_Exp>;
  oauth_id?: InputMaybe<Uuid_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  platform_user_id?: InputMaybe<String_Comparison_Exp>;
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "oauth_platform_mapping" */
export enum Oauth_Platform_Mapping_Constraint {
  /** unique or primary key constraint on columns "id" */
  OauthPlatformMappingPkey = 'oauth_platform_mapping_pkey'
}

/** input type for inserting data into table "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  oauth?: InputMaybe<Oauth_Obj_Rel_Insert_Input>;
  oauth_id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  platform_user_id?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Oauth_Platform_Mapping_Max_Fields = {
  __typename?: 'oauth_platform_mapping_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  oauth_id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  platform_user_id?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Oauth_Platform_Mapping_Min_Fields = {
  __typename?: 'oauth_platform_mapping_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  oauth_id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  platform_user_id?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_Mutation_Response = {
  __typename?: 'oauth_platform_mapping_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Oauth_Platform_Mapping>;
};

/** on_conflict condition type for table "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_On_Conflict = {
  constraint: Oauth_Platform_Mapping_Constraint;
  update_columns?: Array<Oauth_Platform_Mapping_Update_Column>;
  where?: InputMaybe<Oauth_Platform_Mapping_Bool_Exp>;
};

/** Ordering options when selecting data from "oauth_platform_mapping". */
export type Oauth_Platform_Mapping_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  oauth?: InputMaybe<Oauth_Order_By>;
  oauth_id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  platform_user_id?: InputMaybe<Order_By>;
  revoked_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: oauth_platform_mapping */
export type Oauth_Platform_Mapping_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "oauth_platform_mapping" */
export enum Oauth_Platform_Mapping_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OauthId = 'oauth_id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PlatformUserId = 'platform_user_id',
  /** column name */
  RevokedAt = 'revoked_at'
}

/** input type for updating data in table "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  oauth_id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  platform_user_id?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "oauth_platform_mapping" */
export type Oauth_Platform_Mapping_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Oauth_Platform_Mapping_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Oauth_Platform_Mapping_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  oauth_id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  platform_user_id?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "oauth_platform_mapping" */
export enum Oauth_Platform_Mapping_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OauthId = 'oauth_id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PlatformUserId = 'platform_user_id',
  /** column name */
  RevokedAt = 'revoked_at'
}

export type Oauth_Platform_Mapping_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Oauth_Platform_Mapping_Set_Input>;
  /** filter the rows which have to be updated */
  where: Oauth_Platform_Mapping_Bool_Exp;
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Oauth_Prepend_Input = {
  allowlisted_domains?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "oauth" */
export enum Oauth_Select_Column {
  /** column name */
  AllowlistedDomains = 'allowlisted_domains',
  /** column name */
  ApplicationImageUrl = 'application_image_url',
  /** column name */
  ApplicationName = 'application_name',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  RecoveryShareManagement = 'recovery_share_management',
  /** column name */
  RevokedAt = 'revoked_at',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "oauth" */
export type Oauth_Set_Input = {
  allowlisted_domains?: InputMaybe<Scalars['jsonb']['input']>;
  application_image_url?: InputMaybe<Scalars['String']['input']>;
  application_name?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  recovery_share_management?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "oauth" */
export type Oauth_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Oauth_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Oauth_Stream_Cursor_Value_Input = {
  allowlisted_domains?: InputMaybe<Scalars['jsonb']['input']>;
  application_image_url?: InputMaybe<Scalars['String']['input']>;
  application_name?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  recovery_share_management?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "oauth" */
export enum Oauth_Update_Column {
  /** column name */
  AllowlistedDomains = 'allowlisted_domains',
  /** column name */
  ApplicationImageUrl = 'application_image_url',
  /** column name */
  ApplicationName = 'application_name',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  RecoveryShareManagement = 'recovery_share_management',
  /** column name */
  RevokedAt = 'revoked_at',
  /** column name */
  Type = 'type'
}

export type Oauth_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Oauth_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Oauth_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Oauth_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Oauth_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Oauth_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Oauth_Set_Input>;
  /** filter the rows which have to be updated */
  where: Oauth_Bool_Exp;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** Public key customer's whitelist in order for them to restrict function access to us */
export type Paper_Access_Key = {
  __typename?: 'paper_access_key';
  /** An object relationship */
  checkout?: Maybe<Checkout>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  contract_address: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  hashed_private_key: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  owner_id: Scalars['String']['output'];
  public_key: Scalars['String']['output'];
  revoked_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "paper_access_key" */
export type Paper_Access_Key_Aggregate = {
  __typename?: 'paper_access_key_aggregate';
  aggregate?: Maybe<Paper_Access_Key_Aggregate_Fields>;
  nodes: Array<Paper_Access_Key>;
};

/** aggregate fields of "paper_access_key" */
export type Paper_Access_Key_Aggregate_Fields = {
  __typename?: 'paper_access_key_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Paper_Access_Key_Max_Fields>;
  min?: Maybe<Paper_Access_Key_Min_Fields>;
};


/** aggregate fields of "paper_access_key" */
export type Paper_Access_Key_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Paper_Access_Key_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "paper_access_key". All fields are combined with a logical 'AND'. */
export type Paper_Access_Key_Bool_Exp = {
  _and?: InputMaybe<Array<Paper_Access_Key_Bool_Exp>>;
  _not?: InputMaybe<Paper_Access_Key_Bool_Exp>;
  _or?: InputMaybe<Array<Paper_Access_Key_Bool_Exp>>;
  checkout?: InputMaybe<Checkout_Bool_Exp>;
  checkout_id?: InputMaybe<Uuid_Comparison_Exp>;
  contract_address?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  hashed_private_key?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  owner_id?: InputMaybe<String_Comparison_Exp>;
  public_key?: InputMaybe<String_Comparison_Exp>;
  revoked_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "paper_access_key" */
export enum Paper_Access_Key_Constraint {
  /** unique or primary key constraint on columns "id" */
  PaperAccessKeyPkey = 'paper_access_key_pkey'
}

/** input type for inserting data into table "paper_access_key" */
export type Paper_Access_Key_Insert_Input = {
  checkout?: InputMaybe<Checkout_Obj_Rel_Insert_Input>;
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  hashed_private_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  public_key?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Paper_Access_Key_Max_Fields = {
  __typename?: 'paper_access_key_max_fields';
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  contract_address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  hashed_private_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  public_key?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Paper_Access_Key_Min_Fields = {
  __typename?: 'paper_access_key_min_fields';
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  contract_address?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  hashed_private_key?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  public_key?: Maybe<Scalars['String']['output']>;
  revoked_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "paper_access_key" */
export type Paper_Access_Key_Mutation_Response = {
  __typename?: 'paper_access_key_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Paper_Access_Key>;
};

/** on_conflict condition type for table "paper_access_key" */
export type Paper_Access_Key_On_Conflict = {
  constraint: Paper_Access_Key_Constraint;
  update_columns?: Array<Paper_Access_Key_Update_Column>;
  where?: InputMaybe<Paper_Access_Key_Bool_Exp>;
};

/** Ordering options when selecting data from "paper_access_key". */
export type Paper_Access_Key_Order_By = {
  checkout?: InputMaybe<Checkout_Order_By>;
  checkout_id?: InputMaybe<Order_By>;
  contract_address?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hashed_private_key?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  owner_id?: InputMaybe<Order_By>;
  public_key?: InputMaybe<Order_By>;
  revoked_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: paper_access_key */
export type Paper_Access_Key_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "paper_access_key" */
export enum Paper_Access_Key_Select_Column {
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HashedPrivateKey = 'hashed_private_key',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PublicKey = 'public_key',
  /** column name */
  RevokedAt = 'revoked_at'
}

/** input type for updating data in table "paper_access_key" */
export type Paper_Access_Key_Set_Input = {
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  hashed_private_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  public_key?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "paper_access_key" */
export type Paper_Access_Key_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Paper_Access_Key_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Paper_Access_Key_Stream_Cursor_Value_Input = {
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  hashed_private_key?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  public_key?: InputMaybe<Scalars['String']['input']>;
  revoked_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "paper_access_key" */
export enum Paper_Access_Key_Update_Column {
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HashedPrivateKey = 'hashed_private_key',
  /** column name */
  Id = 'id',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  PublicKey = 'public_key',
  /** column name */
  RevokedAt = 'revoked_at'
}

export type Paper_Access_Key_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Paper_Access_Key_Set_Input>;
  /** filter the rows which have to be updated */
  where: Paper_Access_Key_Bool_Exp;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "account_invite" */
  account_invite: Array<Account_Invite>;
  /** fetch aggregated fields from the table: "account_invite" */
  account_invite_aggregate: Account_Invite_Aggregate;
  /** fetch data from the table: "account_invite" using primary key columns */
  account_invite_by_pk?: Maybe<Account_Invite>;
  /** fetch data from the table: "airdrop" */
  airdrop: Array<Airdrop>;
  /** fetch aggregated fields from the table: "airdrop" */
  airdrop_aggregate: Airdrop_Aggregate;
  /** fetch data from the table: "airdrop" using primary key columns */
  airdrop_by_pk?: Maybe<Airdrop>;
  /** fetch data from the table: "analytics_overview" */
  analytics_overview: Array<Analytics_Overview>;
  /** fetch data from the table: "analytics_overview_2" */
  analytics_overview_2: Array<Analytics_Overview_2>;
  /** fetch aggregated fields from the table: "analytics_overview_2" */
  analytics_overview_2_aggregate: Analytics_Overview_2_Aggregate;
  /** fetch aggregated fields from the table: "analytics_overview" */
  analytics_overview_aggregate: Analytics_Overview_Aggregate;
  /** fetch data from the table: "api_secret_key" */
  api_secret_key: Array<Api_Secret_Key>;
  /** fetch aggregated fields from the table: "api_secret_key" */
  api_secret_key_aggregate: Api_Secret_Key_Aggregate;
  /** fetch data from the table: "api_secret_key" using primary key columns */
  api_secret_key_by_pk?: Maybe<Api_Secret_Key>;
  /** fetch data from the table: "billing_history" */
  billing_history: Array<Billing_History>;
  /** fetch aggregated fields from the table: "billing_history" */
  billing_history_aggregate: Billing_History_Aggregate;
  /** fetch data from the table: "billing_history" using primary key columns */
  billing_history_by_pk?: Maybe<Billing_History>;
  /** fetch data from the table: "buyer" */
  buyer: Array<Buyer>;
  /** fetch aggregated fields from the table: "buyer" */
  buyer_aggregate: Buyer_Aggregate;
  /** fetch data from the table: "buyer" using primary key columns */
  buyer_by_pk?: Maybe<Buyer>;
  /** fetch data from the table: "checkout" */
  checkout: Array<Checkout>;
  /** fetch data from the table: "checkout_active_error" */
  checkout_active_error: Array<Checkout_Active_Error>;
  /** fetch aggregated fields from the table: "checkout_active_error" */
  checkout_active_error_aggregate: Checkout_Active_Error_Aggregate;
  /** fetch data from the table: "checkout_active_error" using primary key columns */
  checkout_active_error_by_pk?: Maybe<Checkout_Active_Error>;
  /** fetch aggregated fields from the table: "checkout" */
  checkout_aggregate: Checkout_Aggregate;
  /** fetch data from the table: "checkout" using primary key columns */
  checkout_by_pk?: Maybe<Checkout>;
  /** fetch data from the table: "contract" */
  contract: Array<Contract>;
  /** fetch aggregated fields from the table: "contract" */
  contract_aggregate: Contract_Aggregate;
  /** fetch data from the table: "contract_authorized_seller" */
  contract_authorized_seller: Array<Contract_Authorized_Seller>;
  /** fetch aggregated fields from the table: "contract_authorized_seller" */
  contract_authorized_seller_aggregate: Contract_Authorized_Seller_Aggregate;
  /** fetch data from the table: "contract_authorized_seller" using primary key columns */
  contract_authorized_seller_by_pk?: Maybe<Contract_Authorized_Seller>;
  /** fetch data from the table: "contract" using primary key columns */
  contract_by_pk?: Maybe<Contract>;
  /** fetch data from the table: "customer" */
  customer: Array<Customer>;
  /** fetch aggregated fields from the table: "customer" */
  customer_aggregate: Customer_Aggregate;
  /** fetch data from the table: "customer" using primary key columns */
  customer_by_pk?: Maybe<Customer>;
  /** fetch data from the table: "detailed_analytics" */
  detailed_analytics: Array<Detailed_Analytics>;
  /** fetch aggregated fields from the table: "detailed_analytics" */
  detailed_analytics_aggregate: Detailed_Analytics_Aggregate;
  /** fetch data from the table: "detailed_analytics" using primary key columns */
  detailed_analytics_by_pk?: Maybe<Detailed_Analytics>;
  /** fetch data from the table: "developer_auth_setting" */
  developer_auth_setting: Array<Developer_Auth_Setting>;
  /** fetch aggregated fields from the table: "developer_auth_setting" */
  developer_auth_setting_aggregate: Developer_Auth_Setting_Aggregate;
  /** fetch data from the table: "developer_auth_setting" using primary key columns */
  developer_auth_setting_by_pk?: Maybe<Developer_Auth_Setting>;
  /** fetch data from the table: "email_otp_user" */
  email_otp_user: Array<Email_Otp_User>;
  /** fetch aggregated fields from the table: "email_otp_user" */
  email_otp_user_aggregate: Email_Otp_User_Aggregate;
  /** fetch data from the table: "email_otp_user" using primary key columns */
  email_otp_user_by_pk?: Maybe<Email_Otp_User>;
  /** An array relationship */
  embedded_wallet: Array<Embedded_Wallet>;
  /** An aggregate relationship */
  embedded_wallet_aggregate: Embedded_Wallet_Aggregate;
  /** fetch data from the table: "embedded_wallet" using primary key columns */
  embedded_wallet_by_pk?: Maybe<Embedded_Wallet>;
  /** An array relationship */
  ews_authed_user: Array<Ews_Authed_User>;
  /** An aggregate relationship */
  ews_authed_user_aggregate: Ews_Authed_User_Aggregate;
  /** fetch data from the table: "ews_authed_user" using primary key columns */
  ews_authed_user_by_pk?: Maybe<Ews_Authed_User>;
  /** fetch data from the table: "fiat_payout" */
  fiat_payout: Array<Fiat_Payout>;
  /** fetch aggregated fields from the table: "fiat_payout" */
  fiat_payout_aggregate: Fiat_Payout_Aggregate;
  /** fetch data from the table: "fiat_payout" using primary key columns */
  fiat_payout_by_pk?: Maybe<Fiat_Payout>;
  /** fetch data from the table: "float_wallet" */
  float_wallet: Array<Float_Wallet>;
  /** fetch aggregated fields from the table: "float_wallet" */
  float_wallet_aggregate: Float_Wallet_Aggregate;
  /** fetch data from the table: "float_wallet" using primary key columns */
  float_wallet_by_pk?: Maybe<Float_Wallet>;
  /** execute function "get_detailed_analytics" which returns "detailed_analytics" */
  get_detailed_analytics: Array<Detailed_Analytics>;
  /** execute function "get_detailed_analytics" and query aggregates on result of table type "detailed_analytics" */
  get_detailed_analytics_aggregate: Detailed_Analytics_Aggregate;
  /** fetch data from the table: "nft_checkouts_overview" */
  nft_checkouts_overview: Array<Nft_Checkouts_Overview>;
  /** fetch aggregated fields from the table: "nft_checkouts_overview" */
  nft_checkouts_overview_aggregate: Nft_Checkouts_Overview_Aggregate;
  /** fetch data from the table: "oauth" */
  oauth: Array<Oauth>;
  /** fetch data from the table: "oauth_access_token" */
  oauth_access_token: Array<Oauth_Access_Token>;
  /** fetch aggregated fields from the table: "oauth_access_token" */
  oauth_access_token_aggregate: Oauth_Access_Token_Aggregate;
  /** fetch data from the table: "oauth_access_token" using primary key columns */
  oauth_access_token_by_pk?: Maybe<Oauth_Access_Token>;
  /** fetch aggregated fields from the table: "oauth" */
  oauth_aggregate: Oauth_Aggregate;
  /** fetch data from the table: "oauth" using primary key columns */
  oauth_by_pk?: Maybe<Oauth>;
  /** fetch data from the table: "oauth_platform_mapping" */
  oauth_platform_mapping: Array<Oauth_Platform_Mapping>;
  /** fetch aggregated fields from the table: "oauth_platform_mapping" */
  oauth_platform_mapping_aggregate: Oauth_Platform_Mapping_Aggregate;
  /** fetch data from the table: "oauth_platform_mapping" using primary key columns */
  oauth_platform_mapping_by_pk?: Maybe<Oauth_Platform_Mapping>;
  /** fetch data from the table: "paper_access_key" */
  paper_access_key: Array<Paper_Access_Key>;
  /** fetch aggregated fields from the table: "paper_access_key" */
  paper_access_key_aggregate: Paper_Access_Key_Aggregate;
  /** fetch data from the table: "paper_access_key" using primary key columns */
  paper_access_key_by_pk?: Maybe<Paper_Access_Key>;
  /** fetch data from the table: "seller" */
  seller: Array<Seller>;
  /** fetch aggregated fields from the table: "seller" */
  seller_aggregate: Seller_Aggregate;
  /** fetch data from the table: "seller_billing_plan" */
  seller_billing_plan: Array<Seller_Billing_Plan>;
  /** fetch aggregated fields from the table: "seller_billing_plan" */
  seller_billing_plan_aggregate: Seller_Billing_Plan_Aggregate;
  /** fetch data from the table: "seller_billing_plan" using primary key columns */
  seller_billing_plan_by_pk?: Maybe<Seller_Billing_Plan>;
  /** fetch data from the table: "seller" using primary key columns */
  seller_by_pk?: Maybe<Seller>;
  /** fetch data from the table: "share" */
  share: Array<Share>;
  /** fetch aggregated fields from the table: "share" */
  share_aggregate: Share_Aggregate;
  /** fetch data from the table: "share" using primary key columns */
  share_by_pk?: Maybe<Share>;
  /** fetch data from the table: "transaction" */
  transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "transaction" */
  transaction_aggregate: Transaction_Aggregate;
  /** fetch data from the table: "transaction" using primary key columns */
  transaction_by_pk?: Maybe<Transaction>;
  /** fetch data from the table: "transaction_on_chain_attempt" */
  transaction_on_chain_attempt: Array<Transaction_On_Chain_Attempt>;
  /** fetch aggregated fields from the table: "transaction_on_chain_attempt" */
  transaction_on_chain_attempt_aggregate: Transaction_On_Chain_Attempt_Aggregate;
  /** fetch data from the table: "transaction_on_chain_attempt" using primary key columns */
  transaction_on_chain_attempt_by_pk?: Maybe<Transaction_On_Chain_Attempt>;
  /** An array relationship */
  wallet_user: Array<Wallet_User>;
  /** An aggregate relationship */
  wallet_user_aggregate: Wallet_User_Aggregate;
  /** fetch data from the table: "wallet_user" using primary key columns */
  wallet_user_by_pk?: Maybe<Wallet_User>;
  /** fetch data from the table: "webhook" */
  webhook: Array<Webhook>;
  /** fetch aggregated fields from the table: "webhook" */
  webhook_aggregate: Webhook_Aggregate;
  /** fetch data from the table: "webhook" using primary key columns */
  webhook_by_pk?: Maybe<Webhook>;
  /** fetch data from the table: "webhook_event" */
  webhook_event: Array<Webhook_Event>;
  /** fetch aggregated fields from the table: "webhook_event" */
  webhook_event_aggregate: Webhook_Event_Aggregate;
  /** fetch data from the table: "webhook_event" using primary key columns */
  webhook_event_by_pk?: Maybe<Webhook_Event>;
};


export type Query_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Query_RootAccount_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Query_RootAccount_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAccount_InviteArgs = {
  distinct_on?: InputMaybe<Array<Account_Invite_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Invite_Order_By>>;
  where?: InputMaybe<Account_Invite_Bool_Exp>;
};


export type Query_RootAccount_Invite_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Invite_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Invite_Order_By>>;
  where?: InputMaybe<Account_Invite_Bool_Exp>;
};


export type Query_RootAccount_Invite_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAirdropArgs = {
  distinct_on?: InputMaybe<Array<Airdrop_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Airdrop_Order_By>>;
  where?: InputMaybe<Airdrop_Bool_Exp>;
};


export type Query_RootAirdrop_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Airdrop_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Airdrop_Order_By>>;
  where?: InputMaybe<Airdrop_Bool_Exp>;
};


export type Query_RootAirdrop_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootAnalytics_OverviewArgs = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_Order_By>>;
  where?: InputMaybe<Analytics_Overview_Bool_Exp>;
};


export type Query_RootAnalytics_Overview_2Args = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_2_Order_By>>;
  where?: InputMaybe<Analytics_Overview_2_Bool_Exp>;
};


export type Query_RootAnalytics_Overview_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_2_Order_By>>;
  where?: InputMaybe<Analytics_Overview_2_Bool_Exp>;
};


export type Query_RootAnalytics_Overview_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_Order_By>>;
  where?: InputMaybe<Analytics_Overview_Bool_Exp>;
};


export type Query_RootApi_Secret_KeyArgs = {
  distinct_on?: InputMaybe<Array<Api_Secret_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Secret_Key_Order_By>>;
  where?: InputMaybe<Api_Secret_Key_Bool_Exp>;
};


export type Query_RootApi_Secret_Key_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Api_Secret_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Secret_Key_Order_By>>;
  where?: InputMaybe<Api_Secret_Key_Bool_Exp>;
};


export type Query_RootApi_Secret_Key_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBilling_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Billing_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Billing_History_Order_By>>;
  where?: InputMaybe<Billing_History_Bool_Exp>;
};


export type Query_RootBilling_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Billing_History_Order_By>>;
  where?: InputMaybe<Billing_History_Bool_Exp>;
};


export type Query_RootBilling_History_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBuyerArgs = {
  distinct_on?: InputMaybe<Array<Buyer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buyer_Order_By>>;
  where?: InputMaybe<Buyer_Bool_Exp>;
};


export type Query_RootBuyer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Buyer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buyer_Order_By>>;
  where?: InputMaybe<Buyer_Bool_Exp>;
};


export type Query_RootBuyer_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootCheckoutArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Order_By>>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};


export type Query_RootCheckout_Active_ErrorArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Active_Error_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Active_Error_Order_By>>;
  where?: InputMaybe<Checkout_Active_Error_Bool_Exp>;
};


export type Query_RootCheckout_Active_Error_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Active_Error_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Active_Error_Order_By>>;
  where?: InputMaybe<Checkout_Active_Error_Bool_Exp>;
};


export type Query_RootCheckout_Active_Error_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootCheckout_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Order_By>>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};


export type Query_RootCheckout_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootContractArgs = {
  distinct_on?: InputMaybe<Array<Contract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Order_By>>;
  where?: InputMaybe<Contract_Bool_Exp>;
};


export type Query_RootContract_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Order_By>>;
  where?: InputMaybe<Contract_Bool_Exp>;
};


export type Query_RootContract_Authorized_SellerArgs = {
  distinct_on?: InputMaybe<Array<Contract_Authorized_Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Authorized_Seller_Order_By>>;
  where?: InputMaybe<Contract_Authorized_Seller_Bool_Exp>;
};


export type Query_RootContract_Authorized_Seller_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Authorized_Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Authorized_Seller_Order_By>>;
  where?: InputMaybe<Contract_Authorized_Seller_Bool_Exp>;
};


export type Query_RootContract_Authorized_Seller_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootContract_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootCustomerArgs = {
  distinct_on?: InputMaybe<Array<Customer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Customer_Order_By>>;
  where?: InputMaybe<Customer_Bool_Exp>;
};


export type Query_RootCustomer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Customer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Customer_Order_By>>;
  where?: InputMaybe<Customer_Bool_Exp>;
};


export type Query_RootCustomer_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootDetailed_AnalyticsArgs = {
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Query_RootDetailed_Analytics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Query_RootDetailed_Analytics_By_PkArgs = {
  checkout_id: Scalars['uuid']['input'];
  transaction_created_at: Scalars['timestamptz']['input'];
};


export type Query_RootDeveloper_Auth_SettingArgs = {
  distinct_on?: InputMaybe<Array<Developer_Auth_Setting_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Developer_Auth_Setting_Order_By>>;
  where?: InputMaybe<Developer_Auth_Setting_Bool_Exp>;
};


export type Query_RootDeveloper_Auth_Setting_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Developer_Auth_Setting_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Developer_Auth_Setting_Order_By>>;
  where?: InputMaybe<Developer_Auth_Setting_Bool_Exp>;
};


export type Query_RootDeveloper_Auth_Setting_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootEmail_Otp_UserArgs = {
  distinct_on?: InputMaybe<Array<Email_Otp_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Otp_User_Order_By>>;
  where?: InputMaybe<Email_Otp_User_Bool_Exp>;
};


export type Query_RootEmail_Otp_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Email_Otp_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Otp_User_Order_By>>;
  where?: InputMaybe<Email_Otp_User_Bool_Exp>;
};


export type Query_RootEmail_Otp_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootEmbedded_WalletArgs = {
  distinct_on?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Embedded_Wallet_Order_By>>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};


export type Query_RootEmbedded_Wallet_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Embedded_Wallet_Order_By>>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};


export type Query_RootEmbedded_Wallet_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootEws_Authed_UserArgs = {
  distinct_on?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ews_Authed_User_Order_By>>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};


export type Query_RootEws_Authed_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ews_Authed_User_Order_By>>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};


export type Query_RootEws_Authed_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFiat_PayoutArgs = {
  distinct_on?: InputMaybe<Array<Fiat_Payout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fiat_Payout_Order_By>>;
  where?: InputMaybe<Fiat_Payout_Bool_Exp>;
};


export type Query_RootFiat_Payout_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fiat_Payout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fiat_Payout_Order_By>>;
  where?: InputMaybe<Fiat_Payout_Bool_Exp>;
};


export type Query_RootFiat_Payout_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootFloat_WalletArgs = {
  distinct_on?: InputMaybe<Array<Float_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Float_Wallet_Order_By>>;
  where?: InputMaybe<Float_Wallet_Bool_Exp>;
};


export type Query_RootFloat_Wallet_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Float_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Float_Wallet_Order_By>>;
  where?: InputMaybe<Float_Wallet_Bool_Exp>;
};


export type Query_RootFloat_Wallet_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Query_RootGet_Detailed_AnalyticsArgs = {
  args: Get_Detailed_Analytics_Args;
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Query_RootGet_Detailed_Analytics_AggregateArgs = {
  args: Get_Detailed_Analytics_Args;
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Query_RootNft_Checkouts_OverviewArgs = {
  distinct_on?: InputMaybe<Array<Nft_Checkouts_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nft_Checkouts_Overview_Order_By>>;
  where?: InputMaybe<Nft_Checkouts_Overview_Bool_Exp>;
};


export type Query_RootNft_Checkouts_Overview_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nft_Checkouts_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nft_Checkouts_Overview_Order_By>>;
  where?: InputMaybe<Nft_Checkouts_Overview_Bool_Exp>;
};


export type Query_RootOauthArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Order_By>>;
  where?: InputMaybe<Oauth_Bool_Exp>;
};


export type Query_RootOauth_Access_TokenArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Access_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Access_Token_Order_By>>;
  where?: InputMaybe<Oauth_Access_Token_Bool_Exp>;
};


export type Query_RootOauth_Access_Token_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Access_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Access_Token_Order_By>>;
  where?: InputMaybe<Oauth_Access_Token_Bool_Exp>;
};


export type Query_RootOauth_Access_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOauth_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Order_By>>;
  where?: InputMaybe<Oauth_Bool_Exp>;
};


export type Query_RootOauth_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootOauth_Platform_MappingArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Platform_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Platform_Mapping_Order_By>>;
  where?: InputMaybe<Oauth_Platform_Mapping_Bool_Exp>;
};


export type Query_RootOauth_Platform_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Platform_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Platform_Mapping_Order_By>>;
  where?: InputMaybe<Oauth_Platform_Mapping_Bool_Exp>;
};


export type Query_RootOauth_Platform_Mapping_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootPaper_Access_KeyArgs = {
  distinct_on?: InputMaybe<Array<Paper_Access_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Paper_Access_Key_Order_By>>;
  where?: InputMaybe<Paper_Access_Key_Bool_Exp>;
};


export type Query_RootPaper_Access_Key_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Paper_Access_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Paper_Access_Key_Order_By>>;
  where?: InputMaybe<Paper_Access_Key_Bool_Exp>;
};


export type Query_RootPaper_Access_Key_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootSellerArgs = {
  distinct_on?: InputMaybe<Array<Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Order_By>>;
  where?: InputMaybe<Seller_Bool_Exp>;
};


export type Query_RootSeller_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Order_By>>;
  where?: InputMaybe<Seller_Bool_Exp>;
};


export type Query_RootSeller_Billing_PlanArgs = {
  distinct_on?: InputMaybe<Array<Seller_Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Billing_Plan_Order_By>>;
  where?: InputMaybe<Seller_Billing_Plan_Bool_Exp>;
};


export type Query_RootSeller_Billing_Plan_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Seller_Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Billing_Plan_Order_By>>;
  where?: InputMaybe<Seller_Billing_Plan_Bool_Exp>;
};


export type Query_RootSeller_Billing_Plan_By_PkArgs = {
  seller_id: Scalars['String']['input'];
};


export type Query_RootSeller_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootShareArgs = {
  distinct_on?: InputMaybe<Array<Share_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Share_Order_By>>;
  where?: InputMaybe<Share_Bool_Exp>;
};


export type Query_RootShare_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Share_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Share_Order_By>>;
  where?: InputMaybe<Share_Bool_Exp>;
};


export type Query_RootShare_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootTransactionArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Query_RootTransaction_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Query_RootTransaction_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootTransaction_On_Chain_AttemptArgs = {
  distinct_on?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_On_Chain_Attempt_Order_By>>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};


export type Query_RootTransaction_On_Chain_Attempt_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_On_Chain_Attempt_Order_By>>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};


export type Query_RootTransaction_On_Chain_Attempt_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootWallet_UserArgs = {
  distinct_on?: InputMaybe<Array<Wallet_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Wallet_User_Order_By>>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};


export type Query_RootWallet_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Wallet_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Wallet_User_Order_By>>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};


export type Query_RootWallet_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootWebhookArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Order_By>>;
  where?: InputMaybe<Webhook_Bool_Exp>;
};


export type Query_RootWebhook_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Order_By>>;
  where?: InputMaybe<Webhook_Bool_Exp>;
};


export type Query_RootWebhook_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootWebhook_EventArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Event_Order_By>>;
  where?: InputMaybe<Webhook_Event_Bool_Exp>;
};


export type Query_RootWebhook_Event_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Event_Order_By>>;
  where?: InputMaybe<Webhook_Event_Bool_Exp>;
};


export type Query_RootWebhook_Event_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** The top level "organization". */
export type Seller = {
  __typename?: 'seller';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  auto_topup_enabled: Scalars['Boolean']['output'];
  company_logo_url?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  crypto_service_fee_bps: Scalars['Int']['output'];
  date_business_documents_verified?: Maybe<Scalars['timestamptz']['output']>;
  date_personal_documents_verified?: Maybe<Scalars['timestamptz']['output']>;
  default_float_wallets?: Maybe<Scalars['jsonb']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  discord_username?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_display_name?: Maybe<Scalars['String']['output']>;
  estimated_launch_date?: Maybe<Scalars['timestamp']['output']>;
  fee_bearer: Scalars['String']['output'];
  /** A computed field that shows whether a seller has production access or not */
  has_production_access?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  implementation_status: Scalars['String']['output'];
  is_archived: Scalars['Boolean']['output'];
  is_branding_disabled?: Maybe<Scalars['Boolean']['output']>;
  is_enterprise: Scalars['Boolean']['output'];
  is_sole_proprietor?: Maybe<Scalars['Boolean']['output']>;
  is_trusted?: Maybe<Scalars['Boolean']['output']>;
  native_mint_payout_wallet_address?: Maybe<Scalars['String']['output']>;
  paper_private_notes?: Maybe<Scalars['String']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Int']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  risk_level: Scalars['String']['output'];
  role_in_company?: Maybe<Scalars['String']['output']>;
  service_fee_bps: Scalars['Int']['output'];
  source?: Maybe<Scalars['String']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_default_payment_method_id?: Maybe<Scalars['String']['output']>;
  support_email?: Maybe<Scalars['String']['output']>;
  thirdweb_account_id?: Maybe<Scalars['String']['output']>;
  twitter_handle?: Maybe<Scalars['String']['output']>;
};


/** The top level "organization". */
export type SellerDefault_Float_WalletsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "seller" */
export type Seller_Aggregate = {
  __typename?: 'seller_aggregate';
  aggregate?: Maybe<Seller_Aggregate_Fields>;
  nodes: Array<Seller>;
};

/** aggregate fields of "seller" */
export type Seller_Aggregate_Fields = {
  __typename?: 'seller_aggregate_fields';
  avg?: Maybe<Seller_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Seller_Max_Fields>;
  min?: Maybe<Seller_Min_Fields>;
  stddev?: Maybe<Seller_Stddev_Fields>;
  stddev_pop?: Maybe<Seller_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Seller_Stddev_Samp_Fields>;
  sum?: Maybe<Seller_Sum_Fields>;
  var_pop?: Maybe<Seller_Var_Pop_Fields>;
  var_samp?: Maybe<Seller_Var_Samp_Fields>;
  variance?: Maybe<Seller_Variance_Fields>;
};


/** aggregate fields of "seller" */
export type Seller_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Seller_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Seller_Append_Input = {
  default_float_wallets?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Seller_Avg_Fields = {
  __typename?: 'seller_avg_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Float']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Float']['output']>;
  service_fee_bps?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "seller_billing_plan" */
export type Seller_Billing_Plan = {
  __typename?: 'seller_billing_plan';
  cancelled_at?: Maybe<Scalars['timestamptz']['output']>;
  created_at: Scalars['timestamptz']['output'];
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  last_billed_at?: Maybe<Scalars['timestamptz']['output']>;
  plan_price_usd_cents: Scalars['Int']['output'];
  seller_id: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

/** aggregated selection of "seller_billing_plan" */
export type Seller_Billing_Plan_Aggregate = {
  __typename?: 'seller_billing_plan_aggregate';
  aggregate?: Maybe<Seller_Billing_Plan_Aggregate_Fields>;
  nodes: Array<Seller_Billing_Plan>;
};

/** aggregate fields of "seller_billing_plan" */
export type Seller_Billing_Plan_Aggregate_Fields = {
  __typename?: 'seller_billing_plan_aggregate_fields';
  avg?: Maybe<Seller_Billing_Plan_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Seller_Billing_Plan_Max_Fields>;
  min?: Maybe<Seller_Billing_Plan_Min_Fields>;
  stddev?: Maybe<Seller_Billing_Plan_Stddev_Fields>;
  stddev_pop?: Maybe<Seller_Billing_Plan_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Seller_Billing_Plan_Stddev_Samp_Fields>;
  sum?: Maybe<Seller_Billing_Plan_Sum_Fields>;
  var_pop?: Maybe<Seller_Billing_Plan_Var_Pop_Fields>;
  var_samp?: Maybe<Seller_Billing_Plan_Var_Samp_Fields>;
  variance?: Maybe<Seller_Billing_Plan_Variance_Fields>;
};


/** aggregate fields of "seller_billing_plan" */
export type Seller_Billing_Plan_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Seller_Billing_Plan_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Seller_Billing_Plan_Avg_Fields = {
  __typename?: 'seller_billing_plan_avg_fields';
  plan_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "seller_billing_plan". All fields are combined with a logical 'AND'. */
export type Seller_Billing_Plan_Bool_Exp = {
  _and?: InputMaybe<Array<Seller_Billing_Plan_Bool_Exp>>;
  _not?: InputMaybe<Seller_Billing_Plan_Bool_Exp>;
  _or?: InputMaybe<Array<Seller_Billing_Plan_Bool_Exp>>;
  cancelled_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  last_billed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  plan_price_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "seller_billing_plan" */
export enum Seller_Billing_Plan_Constraint {
  /** unique or primary key constraint on columns "seller_id" */
  SellerBillingPlanPkey = 'seller_billing_plan_pkey'
}

/** input type for incrementing numeric columns in table "seller_billing_plan" */
export type Seller_Billing_Plan_Inc_Input = {
  plan_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "seller_billing_plan" */
export type Seller_Billing_Plan_Insert_Input = {
  cancelled_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  last_billed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  plan_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Seller_Billing_Plan_Max_Fields = {
  __typename?: 'seller_billing_plan_max_fields';
  cancelled_at?: Maybe<Scalars['timestamptz']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  last_billed_at?: Maybe<Scalars['timestamptz']['output']>;
  plan_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Seller_Billing_Plan_Min_Fields = {
  __typename?: 'seller_billing_plan_min_fields';
  cancelled_at?: Maybe<Scalars['timestamptz']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  last_billed_at?: Maybe<Scalars['timestamptz']['output']>;
  plan_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "seller_billing_plan" */
export type Seller_Billing_Plan_Mutation_Response = {
  __typename?: 'seller_billing_plan_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Seller_Billing_Plan>;
};

/** on_conflict condition type for table "seller_billing_plan" */
export type Seller_Billing_Plan_On_Conflict = {
  constraint: Seller_Billing_Plan_Constraint;
  update_columns?: Array<Seller_Billing_Plan_Update_Column>;
  where?: InputMaybe<Seller_Billing_Plan_Bool_Exp>;
};

/** Ordering options when selecting data from "seller_billing_plan". */
export type Seller_Billing_Plan_Order_By = {
  cancelled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  last_billed_at?: InputMaybe<Order_By>;
  plan_price_usd_cents?: InputMaybe<Order_By>;
  seller_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: seller_billing_plan */
export type Seller_Billing_Plan_Pk_Columns_Input = {
  seller_id: Scalars['String']['input'];
};

/** select columns of table "seller_billing_plan" */
export enum Seller_Billing_Plan_Select_Column {
  /** column name */
  CancelledAt = 'cancelled_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  LastBilledAt = 'last_billed_at',
  /** column name */
  PlanPriceUsdCents = 'plan_price_usd_cents',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "seller_billing_plan" */
export type Seller_Billing_Plan_Set_Input = {
  cancelled_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  last_billed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  plan_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Seller_Billing_Plan_Stddev_Fields = {
  __typename?: 'seller_billing_plan_stddev_fields';
  plan_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Seller_Billing_Plan_Stddev_Pop_Fields = {
  __typename?: 'seller_billing_plan_stddev_pop_fields';
  plan_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Seller_Billing_Plan_Stddev_Samp_Fields = {
  __typename?: 'seller_billing_plan_stddev_samp_fields';
  plan_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "seller_billing_plan" */
export type Seller_Billing_Plan_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Seller_Billing_Plan_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Seller_Billing_Plan_Stream_Cursor_Value_Input = {
  cancelled_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  last_billed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  plan_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Seller_Billing_Plan_Sum_Fields = {
  __typename?: 'seller_billing_plan_sum_fields';
  plan_price_usd_cents?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "seller_billing_plan" */
export enum Seller_Billing_Plan_Update_Column {
  /** column name */
  CancelledAt = 'cancelled_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  LastBilledAt = 'last_billed_at',
  /** column name */
  PlanPriceUsdCents = 'plan_price_usd_cents',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Type = 'type'
}

export type Seller_Billing_Plan_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Seller_Billing_Plan_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Seller_Billing_Plan_Set_Input>;
  /** filter the rows which have to be updated */
  where: Seller_Billing_Plan_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Seller_Billing_Plan_Var_Pop_Fields = {
  __typename?: 'seller_billing_plan_var_pop_fields';
  plan_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Seller_Billing_Plan_Var_Samp_Fields = {
  __typename?: 'seller_billing_plan_var_samp_fields';
  plan_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Seller_Billing_Plan_Variance_Fields = {
  __typename?: 'seller_billing_plan_variance_fields';
  plan_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "seller". All fields are combined with a logical 'AND'. */
export type Seller_Bool_Exp = {
  _and?: InputMaybe<Array<Seller_Bool_Exp>>;
  _not?: InputMaybe<Seller_Bool_Exp>;
  _or?: InputMaybe<Array<Seller_Bool_Exp>>;
  auto_topup_amount_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  auto_topup_enabled?: InputMaybe<Boolean_Comparison_Exp>;
  company_logo_url?: InputMaybe<String_Comparison_Exp>;
  company_name?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  crypto_service_fee_bps?: InputMaybe<Int_Comparison_Exp>;
  date_business_documents_verified?: InputMaybe<Timestamptz_Comparison_Exp>;
  date_personal_documents_verified?: InputMaybe<Timestamptz_Comparison_Exp>;
  default_float_wallets?: InputMaybe<Jsonb_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deposit_amount_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  discord_username?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  email_display_name?: InputMaybe<String_Comparison_Exp>;
  estimated_launch_date?: InputMaybe<Timestamp_Comparison_Exp>;
  fee_bearer?: InputMaybe<String_Comparison_Exp>;
  has_production_access?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  implementation_status?: InputMaybe<String_Comparison_Exp>;
  is_archived?: InputMaybe<Boolean_Comparison_Exp>;
  is_branding_disabled?: InputMaybe<Boolean_Comparison_Exp>;
  is_enterprise?: InputMaybe<Boolean_Comparison_Exp>;
  is_sole_proprietor?: InputMaybe<Boolean_Comparison_Exp>;
  is_trusted?: InputMaybe<Boolean_Comparison_Exp>;
  native_mint_payout_wallet_address?: InputMaybe<String_Comparison_Exp>;
  paper_private_notes?: InputMaybe<String_Comparison_Exp>;
  production_checkout_purchase_limit_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  referrer?: InputMaybe<String_Comparison_Exp>;
  risk_level?: InputMaybe<String_Comparison_Exp>;
  role_in_company?: InputMaybe<String_Comparison_Exp>;
  service_fee_bps?: InputMaybe<Int_Comparison_Exp>;
  source?: InputMaybe<String_Comparison_Exp>;
  stripe_customer_id?: InputMaybe<String_Comparison_Exp>;
  stripe_default_payment_method_id?: InputMaybe<String_Comparison_Exp>;
  support_email?: InputMaybe<String_Comparison_Exp>;
  thirdweb_account_id?: InputMaybe<String_Comparison_Exp>;
  twitter_handle?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "seller" */
export enum Seller_Constraint {
  /** unique or primary key constraint on columns "email" */
  SellerEmail = 'seller_email',
  /** unique or primary key constraint on columns "id" */
  SellerPkey = 'seller_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Seller_Delete_At_Path_Input = {
  default_float_wallets?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Seller_Delete_Elem_Input = {
  default_float_wallets?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Seller_Delete_Key_Input = {
  default_float_wallets?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "seller" */
export type Seller_Inc_Input = {
  auto_topup_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  crypto_service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
  deposit_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  production_checkout_purchase_limit_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "seller" */
export type Seller_Insert_Input = {
  auto_topup_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  auto_topup_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  company_logo_url?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  crypto_service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
  date_business_documents_verified?: InputMaybe<Scalars['timestamptz']['input']>;
  date_personal_documents_verified?: InputMaybe<Scalars['timestamptz']['input']>;
  default_float_wallets?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deposit_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  discord_username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_display_name?: InputMaybe<Scalars['String']['input']>;
  estimated_launch_date?: InputMaybe<Scalars['timestamp']['input']>;
  fee_bearer?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  implementation_status?: InputMaybe<Scalars['String']['input']>;
  is_archived?: InputMaybe<Scalars['Boolean']['input']>;
  is_branding_disabled?: InputMaybe<Scalars['Boolean']['input']>;
  is_enterprise?: InputMaybe<Scalars['Boolean']['input']>;
  is_sole_proprietor?: InputMaybe<Scalars['Boolean']['input']>;
  is_trusted?: InputMaybe<Scalars['Boolean']['input']>;
  native_mint_payout_wallet_address?: InputMaybe<Scalars['String']['input']>;
  paper_private_notes?: InputMaybe<Scalars['String']['input']>;
  production_checkout_purchase_limit_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  risk_level?: InputMaybe<Scalars['String']['input']>;
  role_in_company?: InputMaybe<Scalars['String']['input']>;
  service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_default_payment_method_id?: InputMaybe<Scalars['String']['input']>;
  support_email?: InputMaybe<Scalars['String']['input']>;
  thirdweb_account_id?: InputMaybe<Scalars['String']['input']>;
  twitter_handle?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Seller_Max_Fields = {
  __typename?: 'seller_max_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  company_logo_url?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Int']['output']>;
  date_business_documents_verified?: Maybe<Scalars['timestamptz']['output']>;
  date_personal_documents_verified?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  discord_username?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_display_name?: Maybe<Scalars['String']['output']>;
  estimated_launch_date?: Maybe<Scalars['timestamp']['output']>;
  fee_bearer?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  implementation_status?: Maybe<Scalars['String']['output']>;
  native_mint_payout_wallet_address?: Maybe<Scalars['String']['output']>;
  paper_private_notes?: Maybe<Scalars['String']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Int']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  risk_level?: Maybe<Scalars['String']['output']>;
  role_in_company?: Maybe<Scalars['String']['output']>;
  service_fee_bps?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_default_payment_method_id?: Maybe<Scalars['String']['output']>;
  support_email?: Maybe<Scalars['String']['output']>;
  thirdweb_account_id?: Maybe<Scalars['String']['output']>;
  twitter_handle?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Seller_Min_Fields = {
  __typename?: 'seller_min_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  company_logo_url?: Maybe<Scalars['String']['output']>;
  company_name?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Int']['output']>;
  date_business_documents_verified?: Maybe<Scalars['timestamptz']['output']>;
  date_personal_documents_verified?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  discord_username?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_display_name?: Maybe<Scalars['String']['output']>;
  estimated_launch_date?: Maybe<Scalars['timestamp']['output']>;
  fee_bearer?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  implementation_status?: Maybe<Scalars['String']['output']>;
  native_mint_payout_wallet_address?: Maybe<Scalars['String']['output']>;
  paper_private_notes?: Maybe<Scalars['String']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Int']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  risk_level?: Maybe<Scalars['String']['output']>;
  role_in_company?: Maybe<Scalars['String']['output']>;
  service_fee_bps?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  stripe_customer_id?: Maybe<Scalars['String']['output']>;
  stripe_default_payment_method_id?: Maybe<Scalars['String']['output']>;
  support_email?: Maybe<Scalars['String']['output']>;
  thirdweb_account_id?: Maybe<Scalars['String']['output']>;
  twitter_handle?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "seller" */
export type Seller_Mutation_Response = {
  __typename?: 'seller_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Seller>;
};

/** input type for inserting object relation for remote table "seller" */
export type Seller_Obj_Rel_Insert_Input = {
  data: Seller_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Seller_On_Conflict>;
};

/** on_conflict condition type for table "seller" */
export type Seller_On_Conflict = {
  constraint: Seller_Constraint;
  update_columns?: Array<Seller_Update_Column>;
  where?: InputMaybe<Seller_Bool_Exp>;
};

/** Ordering options when selecting data from "seller". */
export type Seller_Order_By = {
  auto_topup_amount_usd_cents?: InputMaybe<Order_By>;
  auto_topup_enabled?: InputMaybe<Order_By>;
  company_logo_url?: InputMaybe<Order_By>;
  company_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  crypto_service_fee_bps?: InputMaybe<Order_By>;
  date_business_documents_verified?: InputMaybe<Order_By>;
  date_personal_documents_verified?: InputMaybe<Order_By>;
  default_float_wallets?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  deposit_amount_usd_cents?: InputMaybe<Order_By>;
  discord_username?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  email_display_name?: InputMaybe<Order_By>;
  estimated_launch_date?: InputMaybe<Order_By>;
  fee_bearer?: InputMaybe<Order_By>;
  has_production_access?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  implementation_status?: InputMaybe<Order_By>;
  is_archived?: InputMaybe<Order_By>;
  is_branding_disabled?: InputMaybe<Order_By>;
  is_enterprise?: InputMaybe<Order_By>;
  is_sole_proprietor?: InputMaybe<Order_By>;
  is_trusted?: InputMaybe<Order_By>;
  native_mint_payout_wallet_address?: InputMaybe<Order_By>;
  paper_private_notes?: InputMaybe<Order_By>;
  production_checkout_purchase_limit_usd_cents?: InputMaybe<Order_By>;
  referrer?: InputMaybe<Order_By>;
  risk_level?: InputMaybe<Order_By>;
  role_in_company?: InputMaybe<Order_By>;
  service_fee_bps?: InputMaybe<Order_By>;
  source?: InputMaybe<Order_By>;
  stripe_customer_id?: InputMaybe<Order_By>;
  stripe_default_payment_method_id?: InputMaybe<Order_By>;
  support_email?: InputMaybe<Order_By>;
  thirdweb_account_id?: InputMaybe<Order_By>;
  twitter_handle?: InputMaybe<Order_By>;
};

/** primary key columns input for table: seller */
export type Seller_Pk_Columns_Input = {
  id: Scalars['String']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Seller_Prepend_Input = {
  default_float_wallets?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "seller" */
export enum Seller_Select_Column {
  /** column name */
  AutoTopupAmountUsdCents = 'auto_topup_amount_usd_cents',
  /** column name */
  AutoTopupEnabled = 'auto_topup_enabled',
  /** column name */
  CompanyLogoUrl = 'company_logo_url',
  /** column name */
  CompanyName = 'company_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CryptoServiceFeeBps = 'crypto_service_fee_bps',
  /** column name */
  DateBusinessDocumentsVerified = 'date_business_documents_verified',
  /** column name */
  DatePersonalDocumentsVerified = 'date_personal_documents_verified',
  /** column name */
  DefaultFloatWallets = 'default_float_wallets',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DepositAmountUsdCents = 'deposit_amount_usd_cents',
  /** column name */
  DiscordUsername = 'discord_username',
  /** column name */
  Email = 'email',
  /** column name */
  EmailDisplayName = 'email_display_name',
  /** column name */
  EstimatedLaunchDate = 'estimated_launch_date',
  /** column name */
  FeeBearer = 'fee_bearer',
  /** column name */
  Id = 'id',
  /** column name */
  ImplementationStatus = 'implementation_status',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  IsBrandingDisabled = 'is_branding_disabled',
  /** column name */
  IsEnterprise = 'is_enterprise',
  /** column name */
  IsSoleProprietor = 'is_sole_proprietor',
  /** column name */
  IsTrusted = 'is_trusted',
  /** column name */
  NativeMintPayoutWalletAddress = 'native_mint_payout_wallet_address',
  /** column name */
  PaperPrivateNotes = 'paper_private_notes',
  /** column name */
  ProductionCheckoutPurchaseLimitUsdCents = 'production_checkout_purchase_limit_usd_cents',
  /** column name */
  Referrer = 'referrer',
  /** column name */
  RiskLevel = 'risk_level',
  /** column name */
  RoleInCompany = 'role_in_company',
  /** column name */
  ServiceFeeBps = 'service_fee_bps',
  /** column name */
  Source = 'source',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  StripeDefaultPaymentMethodId = 'stripe_default_payment_method_id',
  /** column name */
  SupportEmail = 'support_email',
  /** column name */
  ThirdwebAccountId = 'thirdweb_account_id',
  /** column name */
  TwitterHandle = 'twitter_handle'
}

/** input type for updating data in table "seller" */
export type Seller_Set_Input = {
  auto_topup_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  auto_topup_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  company_logo_url?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  crypto_service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
  date_business_documents_verified?: InputMaybe<Scalars['timestamptz']['input']>;
  date_personal_documents_verified?: InputMaybe<Scalars['timestamptz']['input']>;
  default_float_wallets?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deposit_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  discord_username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_display_name?: InputMaybe<Scalars['String']['input']>;
  estimated_launch_date?: InputMaybe<Scalars['timestamp']['input']>;
  fee_bearer?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  implementation_status?: InputMaybe<Scalars['String']['input']>;
  is_archived?: InputMaybe<Scalars['Boolean']['input']>;
  is_branding_disabled?: InputMaybe<Scalars['Boolean']['input']>;
  is_enterprise?: InputMaybe<Scalars['Boolean']['input']>;
  is_sole_proprietor?: InputMaybe<Scalars['Boolean']['input']>;
  is_trusted?: InputMaybe<Scalars['Boolean']['input']>;
  native_mint_payout_wallet_address?: InputMaybe<Scalars['String']['input']>;
  paper_private_notes?: InputMaybe<Scalars['String']['input']>;
  production_checkout_purchase_limit_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  risk_level?: InputMaybe<Scalars['String']['input']>;
  role_in_company?: InputMaybe<Scalars['String']['input']>;
  service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_default_payment_method_id?: InputMaybe<Scalars['String']['input']>;
  support_email?: InputMaybe<Scalars['String']['input']>;
  thirdweb_account_id?: InputMaybe<Scalars['String']['input']>;
  twitter_handle?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Seller_Stddev_Fields = {
  __typename?: 'seller_stddev_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Float']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Float']['output']>;
  service_fee_bps?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Seller_Stddev_Pop_Fields = {
  __typename?: 'seller_stddev_pop_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Float']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Float']['output']>;
  service_fee_bps?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Seller_Stddev_Samp_Fields = {
  __typename?: 'seller_stddev_samp_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Float']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Float']['output']>;
  service_fee_bps?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "seller" */
export type Seller_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Seller_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Seller_Stream_Cursor_Value_Input = {
  auto_topup_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  auto_topup_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  company_logo_url?: InputMaybe<Scalars['String']['input']>;
  company_name?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  crypto_service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
  date_business_documents_verified?: InputMaybe<Scalars['timestamptz']['input']>;
  date_personal_documents_verified?: InputMaybe<Scalars['timestamptz']['input']>;
  default_float_wallets?: InputMaybe<Scalars['jsonb']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deposit_amount_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  discord_username?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_display_name?: InputMaybe<Scalars['String']['input']>;
  estimated_launch_date?: InputMaybe<Scalars['timestamp']['input']>;
  fee_bearer?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  implementation_status?: InputMaybe<Scalars['String']['input']>;
  is_archived?: InputMaybe<Scalars['Boolean']['input']>;
  is_branding_disabled?: InputMaybe<Scalars['Boolean']['input']>;
  is_enterprise?: InputMaybe<Scalars['Boolean']['input']>;
  is_sole_proprietor?: InputMaybe<Scalars['Boolean']['input']>;
  is_trusted?: InputMaybe<Scalars['Boolean']['input']>;
  native_mint_payout_wallet_address?: InputMaybe<Scalars['String']['input']>;
  paper_private_notes?: InputMaybe<Scalars['String']['input']>;
  production_checkout_purchase_limit_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  risk_level?: InputMaybe<Scalars['String']['input']>;
  role_in_company?: InputMaybe<Scalars['String']['input']>;
  service_fee_bps?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  stripe_customer_id?: InputMaybe<Scalars['String']['input']>;
  stripe_default_payment_method_id?: InputMaybe<Scalars['String']['input']>;
  support_email?: InputMaybe<Scalars['String']['input']>;
  thirdweb_account_id?: InputMaybe<Scalars['String']['input']>;
  twitter_handle?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Seller_Sum_Fields = {
  __typename?: 'seller_sum_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Int']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Int']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Int']['output']>;
  service_fee_bps?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "seller" */
export enum Seller_Update_Column {
  /** column name */
  AutoTopupAmountUsdCents = 'auto_topup_amount_usd_cents',
  /** column name */
  AutoTopupEnabled = 'auto_topup_enabled',
  /** column name */
  CompanyLogoUrl = 'company_logo_url',
  /** column name */
  CompanyName = 'company_name',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CryptoServiceFeeBps = 'crypto_service_fee_bps',
  /** column name */
  DateBusinessDocumentsVerified = 'date_business_documents_verified',
  /** column name */
  DatePersonalDocumentsVerified = 'date_personal_documents_verified',
  /** column name */
  DefaultFloatWallets = 'default_float_wallets',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DepositAmountUsdCents = 'deposit_amount_usd_cents',
  /** column name */
  DiscordUsername = 'discord_username',
  /** column name */
  Email = 'email',
  /** column name */
  EmailDisplayName = 'email_display_name',
  /** column name */
  EstimatedLaunchDate = 'estimated_launch_date',
  /** column name */
  FeeBearer = 'fee_bearer',
  /** column name */
  Id = 'id',
  /** column name */
  ImplementationStatus = 'implementation_status',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  IsBrandingDisabled = 'is_branding_disabled',
  /** column name */
  IsEnterprise = 'is_enterprise',
  /** column name */
  IsSoleProprietor = 'is_sole_proprietor',
  /** column name */
  IsTrusted = 'is_trusted',
  /** column name */
  NativeMintPayoutWalletAddress = 'native_mint_payout_wallet_address',
  /** column name */
  PaperPrivateNotes = 'paper_private_notes',
  /** column name */
  ProductionCheckoutPurchaseLimitUsdCents = 'production_checkout_purchase_limit_usd_cents',
  /** column name */
  Referrer = 'referrer',
  /** column name */
  RiskLevel = 'risk_level',
  /** column name */
  RoleInCompany = 'role_in_company',
  /** column name */
  ServiceFeeBps = 'service_fee_bps',
  /** column name */
  Source = 'source',
  /** column name */
  StripeCustomerId = 'stripe_customer_id',
  /** column name */
  StripeDefaultPaymentMethodId = 'stripe_default_payment_method_id',
  /** column name */
  SupportEmail = 'support_email',
  /** column name */
  ThirdwebAccountId = 'thirdweb_account_id',
  /** column name */
  TwitterHandle = 'twitter_handle'
}

export type Seller_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Seller_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Seller_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Seller_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Seller_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Seller_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Seller_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Seller_Set_Input>;
  /** filter the rows which have to be updated */
  where: Seller_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Seller_Var_Pop_Fields = {
  __typename?: 'seller_var_pop_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Float']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Float']['output']>;
  service_fee_bps?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Seller_Var_Samp_Fields = {
  __typename?: 'seller_var_samp_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Float']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Float']['output']>;
  service_fee_bps?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Seller_Variance_Fields = {
  __typename?: 'seller_variance_fields';
  auto_topup_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  crypto_service_fee_bps?: Maybe<Scalars['Float']['output']>;
  deposit_amount_usd_cents?: Maybe<Scalars['Float']['output']>;
  production_checkout_purchase_limit_usd_cents?: Maybe<Scalars['Float']['output']>;
  service_fee_bps?: Maybe<Scalars['Float']['output']>;
};

/** Contains the various different shares for a user's wallet */
export type Share = {
  __typename?: 'share';
  embedded_wallet_id: Scalars['uuid']['output'];
  encrypted_value?: Maybe<Scalars['String']['output']>;
  encryption_password?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  type: Scalars['String']['output'];
  /** An object relationship */
  wallet_user: Wallet_User;
  wallet_user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "share" */
export type Share_Aggregate = {
  __typename?: 'share_aggregate';
  aggregate?: Maybe<Share_Aggregate_Fields>;
  nodes: Array<Share>;
};

export type Share_Aggregate_Bool_Exp = {
  count?: InputMaybe<Share_Aggregate_Bool_Exp_Count>;
};

export type Share_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Share_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Share_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "share" */
export type Share_Aggregate_Fields = {
  __typename?: 'share_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Share_Max_Fields>;
  min?: Maybe<Share_Min_Fields>;
};


/** aggregate fields of "share" */
export type Share_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Share_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "share" */
export type Share_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Share_Max_Order_By>;
  min?: InputMaybe<Share_Min_Order_By>;
};

/** input type for inserting array relation for remote table "share" */
export type Share_Arr_Rel_Insert_Input = {
  data: Array<Share_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Share_On_Conflict>;
};

/** Boolean expression to filter rows from the table "share". All fields are combined with a logical 'AND'. */
export type Share_Bool_Exp = {
  _and?: InputMaybe<Array<Share_Bool_Exp>>;
  _not?: InputMaybe<Share_Bool_Exp>;
  _or?: InputMaybe<Array<Share_Bool_Exp>>;
  embedded_wallet_id?: InputMaybe<Uuid_Comparison_Exp>;
  encrypted_value?: InputMaybe<String_Comparison_Exp>;
  encryption_password?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  wallet_user?: InputMaybe<Wallet_User_Bool_Exp>;
  wallet_user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "share" */
export enum Share_Constraint {
  /** unique or primary key constraint on columns "id" */
  SharePkey = 'share_pkey'
}

/** input type for inserting data into table "share" */
export type Share_Insert_Input = {
  embedded_wallet_id?: InputMaybe<Scalars['uuid']['input']>;
  encrypted_value?: InputMaybe<Scalars['String']['input']>;
  encryption_password?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  wallet_user?: InputMaybe<Wallet_User_Obj_Rel_Insert_Input>;
  wallet_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Share_Max_Fields = {
  __typename?: 'share_max_fields';
  embedded_wallet_id?: Maybe<Scalars['uuid']['output']>;
  encrypted_value?: Maybe<Scalars['String']['output']>;
  encryption_password?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  wallet_user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "share" */
export type Share_Max_Order_By = {
  embedded_wallet_id?: InputMaybe<Order_By>;
  encrypted_value?: InputMaybe<Order_By>;
  encryption_password?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  wallet_user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Share_Min_Fields = {
  __typename?: 'share_min_fields';
  embedded_wallet_id?: Maybe<Scalars['uuid']['output']>;
  encrypted_value?: Maybe<Scalars['String']['output']>;
  encryption_password?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  wallet_user_id?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "share" */
export type Share_Min_Order_By = {
  embedded_wallet_id?: InputMaybe<Order_By>;
  encrypted_value?: InputMaybe<Order_By>;
  encryption_password?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  wallet_user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "share" */
export type Share_Mutation_Response = {
  __typename?: 'share_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Share>;
};

/** on_conflict condition type for table "share" */
export type Share_On_Conflict = {
  constraint: Share_Constraint;
  update_columns?: Array<Share_Update_Column>;
  where?: InputMaybe<Share_Bool_Exp>;
};

/** Ordering options when selecting data from "share". */
export type Share_Order_By = {
  embedded_wallet_id?: InputMaybe<Order_By>;
  encrypted_value?: InputMaybe<Order_By>;
  encryption_password?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  wallet_user?: InputMaybe<Wallet_User_Order_By>;
  wallet_user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: share */
export type Share_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "share" */
export enum Share_Select_Column {
  /** column name */
  EmbeddedWalletId = 'embedded_wallet_id',
  /** column name */
  EncryptedValue = 'encrypted_value',
  /** column name */
  EncryptionPassword = 'encryption_password',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type',
  /** column name */
  WalletUserId = 'wallet_user_id'
}

/** input type for updating data in table "share" */
export type Share_Set_Input = {
  embedded_wallet_id?: InputMaybe<Scalars['uuid']['input']>;
  encrypted_value?: InputMaybe<Scalars['String']['input']>;
  encryption_password?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  wallet_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "share" */
export type Share_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Share_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Share_Stream_Cursor_Value_Input = {
  embedded_wallet_id?: InputMaybe<Scalars['uuid']['input']>;
  encrypted_value?: InputMaybe<Scalars['String']['input']>;
  encryption_password?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  wallet_user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "share" */
export enum Share_Update_Column {
  /** column name */
  EmbeddedWalletId = 'embedded_wallet_id',
  /** column name */
  EncryptedValue = 'encrypted_value',
  /** column name */
  EncryptionPassword = 'encryption_password',
  /** column name */
  Id = 'id',
  /** column name */
  Type = 'type',
  /** column name */
  WalletUserId = 'wallet_user_id'
}

export type Share_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Share_Set_Input>;
  /** filter the rows which have to be updated */
  where: Share_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "account_invite" */
  account_invite: Array<Account_Invite>;
  /** fetch aggregated fields from the table: "account_invite" */
  account_invite_aggregate: Account_Invite_Aggregate;
  /** fetch data from the table: "account_invite" using primary key columns */
  account_invite_by_pk?: Maybe<Account_Invite>;
  /** fetch data from the table in a streaming manner: "account_invite" */
  account_invite_stream: Array<Account_Invite>;
  /** fetch data from the table in a streaming manner: "account" */
  account_stream: Array<Account>;
  /** fetch data from the table: "airdrop" */
  airdrop: Array<Airdrop>;
  /** fetch aggregated fields from the table: "airdrop" */
  airdrop_aggregate: Airdrop_Aggregate;
  /** fetch data from the table: "airdrop" using primary key columns */
  airdrop_by_pk?: Maybe<Airdrop>;
  /** fetch data from the table in a streaming manner: "airdrop" */
  airdrop_stream: Array<Airdrop>;
  /** fetch data from the table: "analytics_overview" */
  analytics_overview: Array<Analytics_Overview>;
  /** fetch data from the table: "analytics_overview_2" */
  analytics_overview_2: Array<Analytics_Overview_2>;
  /** fetch aggregated fields from the table: "analytics_overview_2" */
  analytics_overview_2_aggregate: Analytics_Overview_2_Aggregate;
  /** fetch data from the table in a streaming manner: "analytics_overview_2" */
  analytics_overview_2_stream: Array<Analytics_Overview_2>;
  /** fetch aggregated fields from the table: "analytics_overview" */
  analytics_overview_aggregate: Analytics_Overview_Aggregate;
  /** fetch data from the table in a streaming manner: "analytics_overview" */
  analytics_overview_stream: Array<Analytics_Overview>;
  /** fetch data from the table: "api_secret_key" */
  api_secret_key: Array<Api_Secret_Key>;
  /** fetch aggregated fields from the table: "api_secret_key" */
  api_secret_key_aggregate: Api_Secret_Key_Aggregate;
  /** fetch data from the table: "api_secret_key" using primary key columns */
  api_secret_key_by_pk?: Maybe<Api_Secret_Key>;
  /** fetch data from the table in a streaming manner: "api_secret_key" */
  api_secret_key_stream: Array<Api_Secret_Key>;
  /** fetch data from the table: "billing_history" */
  billing_history: Array<Billing_History>;
  /** fetch aggregated fields from the table: "billing_history" */
  billing_history_aggregate: Billing_History_Aggregate;
  /** fetch data from the table: "billing_history" using primary key columns */
  billing_history_by_pk?: Maybe<Billing_History>;
  /** fetch data from the table in a streaming manner: "billing_history" */
  billing_history_stream: Array<Billing_History>;
  /** fetch data from the table: "buyer" */
  buyer: Array<Buyer>;
  /** fetch aggregated fields from the table: "buyer" */
  buyer_aggregate: Buyer_Aggregate;
  /** fetch data from the table: "buyer" using primary key columns */
  buyer_by_pk?: Maybe<Buyer>;
  /** fetch data from the table in a streaming manner: "buyer" */
  buyer_stream: Array<Buyer>;
  /** fetch data from the table: "checkout" */
  checkout: Array<Checkout>;
  /** fetch data from the table: "checkout_active_error" */
  checkout_active_error: Array<Checkout_Active_Error>;
  /** fetch aggregated fields from the table: "checkout_active_error" */
  checkout_active_error_aggregate: Checkout_Active_Error_Aggregate;
  /** fetch data from the table: "checkout_active_error" using primary key columns */
  checkout_active_error_by_pk?: Maybe<Checkout_Active_Error>;
  /** fetch data from the table in a streaming manner: "checkout_active_error" */
  checkout_active_error_stream: Array<Checkout_Active_Error>;
  /** fetch aggregated fields from the table: "checkout" */
  checkout_aggregate: Checkout_Aggregate;
  /** fetch data from the table: "checkout" using primary key columns */
  checkout_by_pk?: Maybe<Checkout>;
  /** fetch data from the table in a streaming manner: "checkout" */
  checkout_stream: Array<Checkout>;
  /** fetch data from the table: "contract" */
  contract: Array<Contract>;
  /** fetch aggregated fields from the table: "contract" */
  contract_aggregate: Contract_Aggregate;
  /** fetch data from the table: "contract_authorized_seller" */
  contract_authorized_seller: Array<Contract_Authorized_Seller>;
  /** fetch aggregated fields from the table: "contract_authorized_seller" */
  contract_authorized_seller_aggregate: Contract_Authorized_Seller_Aggregate;
  /** fetch data from the table: "contract_authorized_seller" using primary key columns */
  contract_authorized_seller_by_pk?: Maybe<Contract_Authorized_Seller>;
  /** fetch data from the table in a streaming manner: "contract_authorized_seller" */
  contract_authorized_seller_stream: Array<Contract_Authorized_Seller>;
  /** fetch data from the table: "contract" using primary key columns */
  contract_by_pk?: Maybe<Contract>;
  /** fetch data from the table in a streaming manner: "contract" */
  contract_stream: Array<Contract>;
  /** fetch data from the table: "customer" */
  customer: Array<Customer>;
  /** fetch aggregated fields from the table: "customer" */
  customer_aggregate: Customer_Aggregate;
  /** fetch data from the table: "customer" using primary key columns */
  customer_by_pk?: Maybe<Customer>;
  /** fetch data from the table in a streaming manner: "customer" */
  customer_stream: Array<Customer>;
  /** fetch data from the table: "detailed_analytics" */
  detailed_analytics: Array<Detailed_Analytics>;
  /** fetch aggregated fields from the table: "detailed_analytics" */
  detailed_analytics_aggregate: Detailed_Analytics_Aggregate;
  /** fetch data from the table: "detailed_analytics" using primary key columns */
  detailed_analytics_by_pk?: Maybe<Detailed_Analytics>;
  /** fetch data from the table in a streaming manner: "detailed_analytics" */
  detailed_analytics_stream: Array<Detailed_Analytics>;
  /** fetch data from the table: "developer_auth_setting" */
  developer_auth_setting: Array<Developer_Auth_Setting>;
  /** fetch aggregated fields from the table: "developer_auth_setting" */
  developer_auth_setting_aggregate: Developer_Auth_Setting_Aggregate;
  /** fetch data from the table: "developer_auth_setting" using primary key columns */
  developer_auth_setting_by_pk?: Maybe<Developer_Auth_Setting>;
  /** fetch data from the table in a streaming manner: "developer_auth_setting" */
  developer_auth_setting_stream: Array<Developer_Auth_Setting>;
  /** fetch data from the table: "email_otp_user" */
  email_otp_user: Array<Email_Otp_User>;
  /** fetch aggregated fields from the table: "email_otp_user" */
  email_otp_user_aggregate: Email_Otp_User_Aggregate;
  /** fetch data from the table: "email_otp_user" using primary key columns */
  email_otp_user_by_pk?: Maybe<Email_Otp_User>;
  /** fetch data from the table in a streaming manner: "email_otp_user" */
  email_otp_user_stream: Array<Email_Otp_User>;
  /** An array relationship */
  embedded_wallet: Array<Embedded_Wallet>;
  /** An aggregate relationship */
  embedded_wallet_aggregate: Embedded_Wallet_Aggregate;
  /** fetch data from the table: "embedded_wallet" using primary key columns */
  embedded_wallet_by_pk?: Maybe<Embedded_Wallet>;
  /** fetch data from the table in a streaming manner: "embedded_wallet" */
  embedded_wallet_stream: Array<Embedded_Wallet>;
  /** An array relationship */
  ews_authed_user: Array<Ews_Authed_User>;
  /** An aggregate relationship */
  ews_authed_user_aggregate: Ews_Authed_User_Aggregate;
  /** fetch data from the table: "ews_authed_user" using primary key columns */
  ews_authed_user_by_pk?: Maybe<Ews_Authed_User>;
  /** fetch data from the table in a streaming manner: "ews_authed_user" */
  ews_authed_user_stream: Array<Ews_Authed_User>;
  /** fetch data from the table: "fiat_payout" */
  fiat_payout: Array<Fiat_Payout>;
  /** fetch aggregated fields from the table: "fiat_payout" */
  fiat_payout_aggregate: Fiat_Payout_Aggregate;
  /** fetch data from the table: "fiat_payout" using primary key columns */
  fiat_payout_by_pk?: Maybe<Fiat_Payout>;
  /** fetch data from the table in a streaming manner: "fiat_payout" */
  fiat_payout_stream: Array<Fiat_Payout>;
  /** fetch data from the table: "float_wallet" */
  float_wallet: Array<Float_Wallet>;
  /** fetch aggregated fields from the table: "float_wallet" */
  float_wallet_aggregate: Float_Wallet_Aggregate;
  /** fetch data from the table: "float_wallet" using primary key columns */
  float_wallet_by_pk?: Maybe<Float_Wallet>;
  /** fetch data from the table in a streaming manner: "float_wallet" */
  float_wallet_stream: Array<Float_Wallet>;
  /** execute function "get_detailed_analytics" which returns "detailed_analytics" */
  get_detailed_analytics: Array<Detailed_Analytics>;
  /** execute function "get_detailed_analytics" and query aggregates on result of table type "detailed_analytics" */
  get_detailed_analytics_aggregate: Detailed_Analytics_Aggregate;
  /** fetch data from the table: "nft_checkouts_overview" */
  nft_checkouts_overview: Array<Nft_Checkouts_Overview>;
  /** fetch aggregated fields from the table: "nft_checkouts_overview" */
  nft_checkouts_overview_aggregate: Nft_Checkouts_Overview_Aggregate;
  /** fetch data from the table in a streaming manner: "nft_checkouts_overview" */
  nft_checkouts_overview_stream: Array<Nft_Checkouts_Overview>;
  /** fetch data from the table: "oauth" */
  oauth: Array<Oauth>;
  /** fetch data from the table: "oauth_access_token" */
  oauth_access_token: Array<Oauth_Access_Token>;
  /** fetch aggregated fields from the table: "oauth_access_token" */
  oauth_access_token_aggregate: Oauth_Access_Token_Aggregate;
  /** fetch data from the table: "oauth_access_token" using primary key columns */
  oauth_access_token_by_pk?: Maybe<Oauth_Access_Token>;
  /** fetch data from the table in a streaming manner: "oauth_access_token" */
  oauth_access_token_stream: Array<Oauth_Access_Token>;
  /** fetch aggregated fields from the table: "oauth" */
  oauth_aggregate: Oauth_Aggregate;
  /** fetch data from the table: "oauth" using primary key columns */
  oauth_by_pk?: Maybe<Oauth>;
  /** fetch data from the table: "oauth_platform_mapping" */
  oauth_platform_mapping: Array<Oauth_Platform_Mapping>;
  /** fetch aggregated fields from the table: "oauth_platform_mapping" */
  oauth_platform_mapping_aggregate: Oauth_Platform_Mapping_Aggregate;
  /** fetch data from the table: "oauth_platform_mapping" using primary key columns */
  oauth_platform_mapping_by_pk?: Maybe<Oauth_Platform_Mapping>;
  /** fetch data from the table in a streaming manner: "oauth_platform_mapping" */
  oauth_platform_mapping_stream: Array<Oauth_Platform_Mapping>;
  /** fetch data from the table in a streaming manner: "oauth" */
  oauth_stream: Array<Oauth>;
  /** fetch data from the table: "paper_access_key" */
  paper_access_key: Array<Paper_Access_Key>;
  /** fetch aggregated fields from the table: "paper_access_key" */
  paper_access_key_aggregate: Paper_Access_Key_Aggregate;
  /** fetch data from the table: "paper_access_key" using primary key columns */
  paper_access_key_by_pk?: Maybe<Paper_Access_Key>;
  /** fetch data from the table in a streaming manner: "paper_access_key" */
  paper_access_key_stream: Array<Paper_Access_Key>;
  /** fetch data from the table: "seller" */
  seller: Array<Seller>;
  /** fetch aggregated fields from the table: "seller" */
  seller_aggregate: Seller_Aggregate;
  /** fetch data from the table: "seller_billing_plan" */
  seller_billing_plan: Array<Seller_Billing_Plan>;
  /** fetch aggregated fields from the table: "seller_billing_plan" */
  seller_billing_plan_aggregate: Seller_Billing_Plan_Aggregate;
  /** fetch data from the table: "seller_billing_plan" using primary key columns */
  seller_billing_plan_by_pk?: Maybe<Seller_Billing_Plan>;
  /** fetch data from the table in a streaming manner: "seller_billing_plan" */
  seller_billing_plan_stream: Array<Seller_Billing_Plan>;
  /** fetch data from the table: "seller" using primary key columns */
  seller_by_pk?: Maybe<Seller>;
  /** fetch data from the table in a streaming manner: "seller" */
  seller_stream: Array<Seller>;
  /** fetch data from the table: "share" */
  share: Array<Share>;
  /** fetch aggregated fields from the table: "share" */
  share_aggregate: Share_Aggregate;
  /** fetch data from the table: "share" using primary key columns */
  share_by_pk?: Maybe<Share>;
  /** fetch data from the table in a streaming manner: "share" */
  share_stream: Array<Share>;
  /** fetch data from the table: "transaction" */
  transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "transaction" */
  transaction_aggregate: Transaction_Aggregate;
  /** fetch data from the table: "transaction" using primary key columns */
  transaction_by_pk?: Maybe<Transaction>;
  /** fetch data from the table: "transaction_on_chain_attempt" */
  transaction_on_chain_attempt: Array<Transaction_On_Chain_Attempt>;
  /** fetch aggregated fields from the table: "transaction_on_chain_attempt" */
  transaction_on_chain_attempt_aggregate: Transaction_On_Chain_Attempt_Aggregate;
  /** fetch data from the table: "transaction_on_chain_attempt" using primary key columns */
  transaction_on_chain_attempt_by_pk?: Maybe<Transaction_On_Chain_Attempt>;
  /** fetch data from the table in a streaming manner: "transaction_on_chain_attempt" */
  transaction_on_chain_attempt_stream: Array<Transaction_On_Chain_Attempt>;
  /** fetch data from the table in a streaming manner: "transaction" */
  transaction_stream: Array<Transaction>;
  /** An array relationship */
  wallet_user: Array<Wallet_User>;
  /** An aggregate relationship */
  wallet_user_aggregate: Wallet_User_Aggregate;
  /** fetch data from the table: "wallet_user" using primary key columns */
  wallet_user_by_pk?: Maybe<Wallet_User>;
  /** fetch data from the table in a streaming manner: "wallet_user" */
  wallet_user_stream: Array<Wallet_User>;
  /** fetch data from the table: "webhook" */
  webhook: Array<Webhook>;
  /** fetch aggregated fields from the table: "webhook" */
  webhook_aggregate: Webhook_Aggregate;
  /** fetch data from the table: "webhook" using primary key columns */
  webhook_by_pk?: Maybe<Webhook>;
  /** fetch data from the table: "webhook_event" */
  webhook_event: Array<Webhook_Event>;
  /** fetch aggregated fields from the table: "webhook_event" */
  webhook_event_aggregate: Webhook_Event_Aggregate;
  /** fetch data from the table: "webhook_event" using primary key columns */
  webhook_event_by_pk?: Maybe<Webhook_Event>;
  /** fetch data from the table in a streaming manner: "webhook_event" */
  webhook_event_stream: Array<Webhook_Event>;
  /** fetch data from the table in a streaming manner: "webhook" */
  webhook_stream: Array<Webhook>;
};


export type Subscription_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAccount_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAccount_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAccount_InviteArgs = {
  distinct_on?: InputMaybe<Array<Account_Invite_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Invite_Order_By>>;
  where?: InputMaybe<Account_Invite_Bool_Exp>;
};


export type Subscription_RootAccount_Invite_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Invite_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Invite_Order_By>>;
  where?: InputMaybe<Account_Invite_Bool_Exp>;
};


export type Subscription_RootAccount_Invite_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAccount_Invite_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Account_Invite_Stream_Cursor_Input>>;
  where?: InputMaybe<Account_Invite_Bool_Exp>;
};


export type Subscription_RootAccount_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Account_Stream_Cursor_Input>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAirdropArgs = {
  distinct_on?: InputMaybe<Array<Airdrop_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Airdrop_Order_By>>;
  where?: InputMaybe<Airdrop_Bool_Exp>;
};


export type Subscription_RootAirdrop_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Airdrop_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Airdrop_Order_By>>;
  where?: InputMaybe<Airdrop_Bool_Exp>;
};


export type Subscription_RootAirdrop_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootAirdrop_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Airdrop_Stream_Cursor_Input>>;
  where?: InputMaybe<Airdrop_Bool_Exp>;
};


export type Subscription_RootAnalytics_OverviewArgs = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_Order_By>>;
  where?: InputMaybe<Analytics_Overview_Bool_Exp>;
};


export type Subscription_RootAnalytics_Overview_2Args = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_2_Order_By>>;
  where?: InputMaybe<Analytics_Overview_2_Bool_Exp>;
};


export type Subscription_RootAnalytics_Overview_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_2_Order_By>>;
  where?: InputMaybe<Analytics_Overview_2_Bool_Exp>;
};


export type Subscription_RootAnalytics_Overview_2_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Analytics_Overview_2_Stream_Cursor_Input>>;
  where?: InputMaybe<Analytics_Overview_2_Bool_Exp>;
};


export type Subscription_RootAnalytics_Overview_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Analytics_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Analytics_Overview_Order_By>>;
  where?: InputMaybe<Analytics_Overview_Bool_Exp>;
};


export type Subscription_RootAnalytics_Overview_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Analytics_Overview_Stream_Cursor_Input>>;
  where?: InputMaybe<Analytics_Overview_Bool_Exp>;
};


export type Subscription_RootApi_Secret_KeyArgs = {
  distinct_on?: InputMaybe<Array<Api_Secret_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Secret_Key_Order_By>>;
  where?: InputMaybe<Api_Secret_Key_Bool_Exp>;
};


export type Subscription_RootApi_Secret_Key_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Api_Secret_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Api_Secret_Key_Order_By>>;
  where?: InputMaybe<Api_Secret_Key_Bool_Exp>;
};


export type Subscription_RootApi_Secret_Key_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootApi_Secret_Key_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Api_Secret_Key_Stream_Cursor_Input>>;
  where?: InputMaybe<Api_Secret_Key_Bool_Exp>;
};


export type Subscription_RootBilling_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Billing_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Billing_History_Order_By>>;
  where?: InputMaybe<Billing_History_Bool_Exp>;
};


export type Subscription_RootBilling_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Billing_History_Order_By>>;
  where?: InputMaybe<Billing_History_Bool_Exp>;
};


export type Subscription_RootBilling_History_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBilling_History_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Billing_History_Stream_Cursor_Input>>;
  where?: InputMaybe<Billing_History_Bool_Exp>;
};


export type Subscription_RootBuyerArgs = {
  distinct_on?: InputMaybe<Array<Buyer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buyer_Order_By>>;
  where?: InputMaybe<Buyer_Bool_Exp>;
};


export type Subscription_RootBuyer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Buyer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buyer_Order_By>>;
  where?: InputMaybe<Buyer_Bool_Exp>;
};


export type Subscription_RootBuyer_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootBuyer_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Buyer_Stream_Cursor_Input>>;
  where?: InputMaybe<Buyer_Bool_Exp>;
};


export type Subscription_RootCheckoutArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Order_By>>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};


export type Subscription_RootCheckout_Active_ErrorArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Active_Error_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Active_Error_Order_By>>;
  where?: InputMaybe<Checkout_Active_Error_Bool_Exp>;
};


export type Subscription_RootCheckout_Active_Error_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Active_Error_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Active_Error_Order_By>>;
  where?: InputMaybe<Checkout_Active_Error_Bool_Exp>;
};


export type Subscription_RootCheckout_Active_Error_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootCheckout_Active_Error_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Checkout_Active_Error_Stream_Cursor_Input>>;
  where?: InputMaybe<Checkout_Active_Error_Bool_Exp>;
};


export type Subscription_RootCheckout_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Checkout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Checkout_Order_By>>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};


export type Subscription_RootCheckout_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootCheckout_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Checkout_Stream_Cursor_Input>>;
  where?: InputMaybe<Checkout_Bool_Exp>;
};


export type Subscription_RootContractArgs = {
  distinct_on?: InputMaybe<Array<Contract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Order_By>>;
  where?: InputMaybe<Contract_Bool_Exp>;
};


export type Subscription_RootContract_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Order_By>>;
  where?: InputMaybe<Contract_Bool_Exp>;
};


export type Subscription_RootContract_Authorized_SellerArgs = {
  distinct_on?: InputMaybe<Array<Contract_Authorized_Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Authorized_Seller_Order_By>>;
  where?: InputMaybe<Contract_Authorized_Seller_Bool_Exp>;
};


export type Subscription_RootContract_Authorized_Seller_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contract_Authorized_Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contract_Authorized_Seller_Order_By>>;
  where?: InputMaybe<Contract_Authorized_Seller_Bool_Exp>;
};


export type Subscription_RootContract_Authorized_Seller_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootContract_Authorized_Seller_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Contract_Authorized_Seller_Stream_Cursor_Input>>;
  where?: InputMaybe<Contract_Authorized_Seller_Bool_Exp>;
};


export type Subscription_RootContract_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootContract_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Contract_Stream_Cursor_Input>>;
  where?: InputMaybe<Contract_Bool_Exp>;
};


export type Subscription_RootCustomerArgs = {
  distinct_on?: InputMaybe<Array<Customer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Customer_Order_By>>;
  where?: InputMaybe<Customer_Bool_Exp>;
};


export type Subscription_RootCustomer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Customer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Customer_Order_By>>;
  where?: InputMaybe<Customer_Bool_Exp>;
};


export type Subscription_RootCustomer_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootCustomer_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Customer_Stream_Cursor_Input>>;
  where?: InputMaybe<Customer_Bool_Exp>;
};


export type Subscription_RootDetailed_AnalyticsArgs = {
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Subscription_RootDetailed_Analytics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Subscription_RootDetailed_Analytics_By_PkArgs = {
  checkout_id: Scalars['uuid']['input'];
  transaction_created_at: Scalars['timestamptz']['input'];
};


export type Subscription_RootDetailed_Analytics_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Detailed_Analytics_Stream_Cursor_Input>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Subscription_RootDeveloper_Auth_SettingArgs = {
  distinct_on?: InputMaybe<Array<Developer_Auth_Setting_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Developer_Auth_Setting_Order_By>>;
  where?: InputMaybe<Developer_Auth_Setting_Bool_Exp>;
};


export type Subscription_RootDeveloper_Auth_Setting_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Developer_Auth_Setting_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Developer_Auth_Setting_Order_By>>;
  where?: InputMaybe<Developer_Auth_Setting_Bool_Exp>;
};


export type Subscription_RootDeveloper_Auth_Setting_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootDeveloper_Auth_Setting_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Developer_Auth_Setting_Stream_Cursor_Input>>;
  where?: InputMaybe<Developer_Auth_Setting_Bool_Exp>;
};


export type Subscription_RootEmail_Otp_UserArgs = {
  distinct_on?: InputMaybe<Array<Email_Otp_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Otp_User_Order_By>>;
  where?: InputMaybe<Email_Otp_User_Bool_Exp>;
};


export type Subscription_RootEmail_Otp_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Email_Otp_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Email_Otp_User_Order_By>>;
  where?: InputMaybe<Email_Otp_User_Bool_Exp>;
};


export type Subscription_RootEmail_Otp_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootEmail_Otp_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Email_Otp_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Email_Otp_User_Bool_Exp>;
};


export type Subscription_RootEmbedded_WalletArgs = {
  distinct_on?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Embedded_Wallet_Order_By>>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};


export type Subscription_RootEmbedded_Wallet_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Embedded_Wallet_Order_By>>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};


export type Subscription_RootEmbedded_Wallet_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootEmbedded_Wallet_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Embedded_Wallet_Stream_Cursor_Input>>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};


export type Subscription_RootEws_Authed_UserArgs = {
  distinct_on?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ews_Authed_User_Order_By>>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};


export type Subscription_RootEws_Authed_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ews_Authed_User_Order_By>>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};


export type Subscription_RootEws_Authed_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootEws_Authed_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Ews_Authed_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};


export type Subscription_RootFiat_PayoutArgs = {
  distinct_on?: InputMaybe<Array<Fiat_Payout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fiat_Payout_Order_By>>;
  where?: InputMaybe<Fiat_Payout_Bool_Exp>;
};


export type Subscription_RootFiat_Payout_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fiat_Payout_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Fiat_Payout_Order_By>>;
  where?: InputMaybe<Fiat_Payout_Bool_Exp>;
};


export type Subscription_RootFiat_Payout_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootFiat_Payout_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Fiat_Payout_Stream_Cursor_Input>>;
  where?: InputMaybe<Fiat_Payout_Bool_Exp>;
};


export type Subscription_RootFloat_WalletArgs = {
  distinct_on?: InputMaybe<Array<Float_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Float_Wallet_Order_By>>;
  where?: InputMaybe<Float_Wallet_Bool_Exp>;
};


export type Subscription_RootFloat_Wallet_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Float_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Float_Wallet_Order_By>>;
  where?: InputMaybe<Float_Wallet_Bool_Exp>;
};


export type Subscription_RootFloat_Wallet_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Subscription_RootFloat_Wallet_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Float_Wallet_Stream_Cursor_Input>>;
  where?: InputMaybe<Float_Wallet_Bool_Exp>;
};


export type Subscription_RootGet_Detailed_AnalyticsArgs = {
  args: Get_Detailed_Analytics_Args;
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Subscription_RootGet_Detailed_Analytics_AggregateArgs = {
  args: Get_Detailed_Analytics_Args;
  distinct_on?: InputMaybe<Array<Detailed_Analytics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Detailed_Analytics_Order_By>>;
  where?: InputMaybe<Detailed_Analytics_Bool_Exp>;
};


export type Subscription_RootNft_Checkouts_OverviewArgs = {
  distinct_on?: InputMaybe<Array<Nft_Checkouts_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nft_Checkouts_Overview_Order_By>>;
  where?: InputMaybe<Nft_Checkouts_Overview_Bool_Exp>;
};


export type Subscription_RootNft_Checkouts_Overview_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nft_Checkouts_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nft_Checkouts_Overview_Order_By>>;
  where?: InputMaybe<Nft_Checkouts_Overview_Bool_Exp>;
};


export type Subscription_RootNft_Checkouts_Overview_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Nft_Checkouts_Overview_Stream_Cursor_Input>>;
  where?: InputMaybe<Nft_Checkouts_Overview_Bool_Exp>;
};


export type Subscription_RootOauthArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Order_By>>;
  where?: InputMaybe<Oauth_Bool_Exp>;
};


export type Subscription_RootOauth_Access_TokenArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Access_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Access_Token_Order_By>>;
  where?: InputMaybe<Oauth_Access_Token_Bool_Exp>;
};


export type Subscription_RootOauth_Access_Token_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Access_Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Access_Token_Order_By>>;
  where?: InputMaybe<Oauth_Access_Token_Bool_Exp>;
};


export type Subscription_RootOauth_Access_Token_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOauth_Access_Token_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Oauth_Access_Token_Stream_Cursor_Input>>;
  where?: InputMaybe<Oauth_Access_Token_Bool_Exp>;
};


export type Subscription_RootOauth_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Order_By>>;
  where?: InputMaybe<Oauth_Bool_Exp>;
};


export type Subscription_RootOauth_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOauth_Platform_MappingArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Platform_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Platform_Mapping_Order_By>>;
  where?: InputMaybe<Oauth_Platform_Mapping_Bool_Exp>;
};


export type Subscription_RootOauth_Platform_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Platform_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Oauth_Platform_Mapping_Order_By>>;
  where?: InputMaybe<Oauth_Platform_Mapping_Bool_Exp>;
};


export type Subscription_RootOauth_Platform_Mapping_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootOauth_Platform_Mapping_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Oauth_Platform_Mapping_Stream_Cursor_Input>>;
  where?: InputMaybe<Oauth_Platform_Mapping_Bool_Exp>;
};


export type Subscription_RootOauth_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Oauth_Stream_Cursor_Input>>;
  where?: InputMaybe<Oauth_Bool_Exp>;
};


export type Subscription_RootPaper_Access_KeyArgs = {
  distinct_on?: InputMaybe<Array<Paper_Access_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Paper_Access_Key_Order_By>>;
  where?: InputMaybe<Paper_Access_Key_Bool_Exp>;
};


export type Subscription_RootPaper_Access_Key_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Paper_Access_Key_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Paper_Access_Key_Order_By>>;
  where?: InputMaybe<Paper_Access_Key_Bool_Exp>;
};


export type Subscription_RootPaper_Access_Key_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPaper_Access_Key_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Paper_Access_Key_Stream_Cursor_Input>>;
  where?: InputMaybe<Paper_Access_Key_Bool_Exp>;
};


export type Subscription_RootSellerArgs = {
  distinct_on?: InputMaybe<Array<Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Order_By>>;
  where?: InputMaybe<Seller_Bool_Exp>;
};


export type Subscription_RootSeller_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Seller_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Order_By>>;
  where?: InputMaybe<Seller_Bool_Exp>;
};


export type Subscription_RootSeller_Billing_PlanArgs = {
  distinct_on?: InputMaybe<Array<Seller_Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Billing_Plan_Order_By>>;
  where?: InputMaybe<Seller_Billing_Plan_Bool_Exp>;
};


export type Subscription_RootSeller_Billing_Plan_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Seller_Billing_Plan_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seller_Billing_Plan_Order_By>>;
  where?: InputMaybe<Seller_Billing_Plan_Bool_Exp>;
};


export type Subscription_RootSeller_Billing_Plan_By_PkArgs = {
  seller_id: Scalars['String']['input'];
};


export type Subscription_RootSeller_Billing_Plan_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Seller_Billing_Plan_Stream_Cursor_Input>>;
  where?: InputMaybe<Seller_Billing_Plan_Bool_Exp>;
};


export type Subscription_RootSeller_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootSeller_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Seller_Stream_Cursor_Input>>;
  where?: InputMaybe<Seller_Bool_Exp>;
};


export type Subscription_RootShareArgs = {
  distinct_on?: InputMaybe<Array<Share_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Share_Order_By>>;
  where?: InputMaybe<Share_Bool_Exp>;
};


export type Subscription_RootShare_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Share_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Share_Order_By>>;
  where?: InputMaybe<Share_Bool_Exp>;
};


export type Subscription_RootShare_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootShare_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Share_Stream_Cursor_Input>>;
  where?: InputMaybe<Share_Bool_Exp>;
};


export type Subscription_RootTransactionArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Subscription_RootTransaction_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Subscription_RootTransaction_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootTransaction_On_Chain_AttemptArgs = {
  distinct_on?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_On_Chain_Attempt_Order_By>>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};


export type Subscription_RootTransaction_On_Chain_Attempt_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_On_Chain_Attempt_Order_By>>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};


export type Subscription_RootTransaction_On_Chain_Attempt_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootTransaction_On_Chain_Attempt_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Transaction_On_Chain_Attempt_Stream_Cursor_Input>>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};


export type Subscription_RootTransaction_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Transaction_Stream_Cursor_Input>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Subscription_RootWallet_UserArgs = {
  distinct_on?: InputMaybe<Array<Wallet_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Wallet_User_Order_By>>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};


export type Subscription_RootWallet_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Wallet_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Wallet_User_Order_By>>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};


export type Subscription_RootWallet_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootWallet_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Wallet_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};


export type Subscription_RootWebhookArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Order_By>>;
  where?: InputMaybe<Webhook_Bool_Exp>;
};


export type Subscription_RootWebhook_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Order_By>>;
  where?: InputMaybe<Webhook_Bool_Exp>;
};


export type Subscription_RootWebhook_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootWebhook_EventArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Event_Order_By>>;
  where?: InputMaybe<Webhook_Event_Bool_Exp>;
};


export type Subscription_RootWebhook_Event_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Webhook_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Webhook_Event_Order_By>>;
  where?: InputMaybe<Webhook_Event_Bool_Exp>;
};


export type Subscription_RootWebhook_Event_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootWebhook_Event_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Webhook_Event_Stream_Cursor_Input>>;
  where?: InputMaybe<Webhook_Event_Bool_Exp>;
};


export type Subscription_RootWebhook_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Webhook_Stream_Cursor_Input>>;
  where?: InputMaybe<Webhook_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** columns and relationships of "transaction" */
export type Transaction = {
  __typename?: 'transaction';
  airdrop_worker_job_name?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  buyer?: Maybe<Buyer>;
  buyer_id?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  checkout: Checkout;
  checkout_id: Scalars['uuid']['output'];
  checkoutcom_payment_id?: Maybe<Scalars['String']['output']>;
  claimed_tokens?: Maybe<Scalars['jsonb']['output']>;
  coinbase_payment_id?: Maybe<Scalars['String']['output']>;
  contract_args?: Maybe<Scalars['jsonb']['output']>;
  created_at: Scalars['timestamptz']['output'];
  crypto_payment_payer_address?: Maybe<Scalars['String']['output']>;
  crypto_payment_transaction_hash?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  customer?: Maybe<Customer>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  eligibility_method: Scalars['jsonb']['output'];
  email?: Maybe<Scalars['String']['output']>;
  expected_crypto_payment: Scalars['jsonb']['output'];
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  failure_reason?: Maybe<Scalars['String']['output']>;
  fee_bearer: Scalars['String']['output'];
  fiat_currency?: Maybe<Scalars['String']['output']>;
  float_wallet_nonce?: Maybe<Scalars['Int']['output']>;
  float_wallet_used?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  location?: Maybe<Scalars['String']['output']>;
  locked_fields: Scalars['jsonb']['output'];
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  metadata?: Maybe<Scalars['jsonb']['output']>;
  mint_method: Scalars['jsonb']['output'];
  network_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  payment_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  payment_failure_code?: Maybe<Scalars['String']['output']>;
  payment_hold_created_at?: Maybe<Scalars['timestamptz']['output']>;
  payment_method: Scalars['String']['output'];
  payment_started_at?: Maybe<Scalars['timestamptz']['output']>;
  quantity: Scalars['Int']['output'];
  queueId?: Maybe<Scalars['String']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  refunded_at?: Maybe<Scalars['timestamptz']['output']>;
  requested_token_id?: Maybe<Scalars['String']['output']>;
  sdk_client_secret?: Maybe<Scalars['String']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  signature_args?: Maybe<Scalars['jsonb']['output']>;
  solana_whitelist_transaction_hash?: Maybe<Scalars['String']['output']>;
  stripe_payment_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result?: Maybe<Scalars['String']['output']>;
  test_buckets?: Maybe<Scalars['jsonb']['output']>;
  title: Scalars['String']['output'];
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  transaction_on_chain_attempts: Array<Transaction_On_Chain_Attempt>;
  /** An aggregate relationship */
  transaction_on_chain_attempts_aggregate: Transaction_On_Chain_Attempt_Aggregate;
  transfer_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  transfer_failed_at?: Maybe<Scalars['timestamptz']['output']>;
  trench_transaction_id: Scalars['String']['output'];
  use_paper_key: Scalars['Boolean']['output'];
  user_exported_nft_transaction_hashes: Scalars['jsonb']['output'];
  value_in_currency?: Maybe<Scalars['String']['output']>;
  wallet_address?: Maybe<Scalars['String']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "transaction" */
export type TransactionClaimed_TokensArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionContract_ArgsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionEligibility_MethodArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionExpected_Crypto_PaymentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionLocked_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionMetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionMint_MethodArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionSignature_ArgsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionTest_BucketsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionTransaction_On_Chain_AttemptsArgs = {
  distinct_on?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_On_Chain_Attempt_Order_By>>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionTransaction_On_Chain_Attempts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_On_Chain_Attempt_Order_By>>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionUser_Exported_Nft_Transaction_HashesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "transaction" */
export type Transaction_Aggregate = {
  __typename?: 'transaction_aggregate';
  aggregate?: Maybe<Transaction_Aggregate_Fields>;
  nodes: Array<Transaction>;
};

/** aggregate fields of "transaction" */
export type Transaction_Aggregate_Fields = {
  __typename?: 'transaction_aggregate_fields';
  avg?: Maybe<Transaction_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Transaction_Max_Fields>;
  min?: Maybe<Transaction_Min_Fields>;
  stddev?: Maybe<Transaction_Stddev_Fields>;
  stddev_pop?: Maybe<Transaction_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transaction_Stddev_Samp_Fields>;
  sum?: Maybe<Transaction_Sum_Fields>;
  var_pop?: Maybe<Transaction_Var_Pop_Fields>;
  var_samp?: Maybe<Transaction_Var_Samp_Fields>;
  variance?: Maybe<Transaction_Variance_Fields>;
};


/** aggregate fields of "transaction" */
export type Transaction_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transaction_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Transaction_Append_Input = {
  claimed_tokens?: InputMaybe<Scalars['jsonb']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  eligibility_method?: InputMaybe<Scalars['jsonb']['input']>;
  expected_crypto_payment?: InputMaybe<Scalars['jsonb']['input']>;
  locked_fields?: InputMaybe<Scalars['jsonb']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mint_method?: InputMaybe<Scalars['jsonb']['input']>;
  signature_args?: InputMaybe<Scalars['jsonb']['input']>;
  test_buckets?: InputMaybe<Scalars['jsonb']['input']>;
  user_exported_nft_transaction_hashes?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Transaction_Avg_Fields = {
  __typename?: 'transaction_avg_fields';
  float_wallet_nonce?: Maybe<Scalars['Float']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "transaction". All fields are combined with a logical 'AND'. */
export type Transaction_Bool_Exp = {
  _and?: InputMaybe<Array<Transaction_Bool_Exp>>;
  _not?: InputMaybe<Transaction_Bool_Exp>;
  _or?: InputMaybe<Array<Transaction_Bool_Exp>>;
  airdrop_worker_job_name?: InputMaybe<String_Comparison_Exp>;
  buyer?: InputMaybe<Buyer_Bool_Exp>;
  buyer_id?: InputMaybe<String_Comparison_Exp>;
  checkout?: InputMaybe<Checkout_Bool_Exp>;
  checkout_id?: InputMaybe<Uuid_Comparison_Exp>;
  checkoutcom_payment_id?: InputMaybe<String_Comparison_Exp>;
  claimed_tokens?: InputMaybe<Jsonb_Comparison_Exp>;
  coinbase_payment_id?: InputMaybe<String_Comparison_Exp>;
  contract_args?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  crypto_payment_payer_address?: InputMaybe<String_Comparison_Exp>;
  crypto_payment_transaction_hash?: InputMaybe<String_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  customer?: InputMaybe<Customer_Bool_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  eligibility_method?: InputMaybe<Jsonb_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  expected_crypto_payment?: InputMaybe<Jsonb_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  failure_reason?: InputMaybe<String_Comparison_Exp>;
  fee_bearer?: InputMaybe<String_Comparison_Exp>;
  fiat_currency?: InputMaybe<String_Comparison_Exp>;
  float_wallet_nonce?: InputMaybe<Int_Comparison_Exp>;
  float_wallet_used?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  location?: InputMaybe<String_Comparison_Exp>;
  locked_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  locked_price_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mint_method?: InputMaybe<Jsonb_Comparison_Exp>;
  network_fee_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  payment_completed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  payment_failure_code?: InputMaybe<String_Comparison_Exp>;
  payment_hold_created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  payment_method?: InputMaybe<String_Comparison_Exp>;
  payment_started_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  quantity?: InputMaybe<Int_Comparison_Exp>;
  queueId?: InputMaybe<String_Comparison_Exp>;
  referrer?: InputMaybe<String_Comparison_Exp>;
  refunded_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  requested_token_id?: InputMaybe<String_Comparison_Exp>;
  sdk_client_secret?: InputMaybe<String_Comparison_Exp>;
  service_fee_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  signature_args?: InputMaybe<Jsonb_Comparison_Exp>;
  solana_whitelist_transaction_hash?: InputMaybe<String_Comparison_Exp>;
  stripe_payment_id?: InputMaybe<String_Comparison_Exp>;
  stripe_verification_session_id?: InputMaybe<String_Comparison_Exp>;
  stripe_verification_session_result?: InputMaybe<String_Comparison_Exp>;
  test_buckets?: InputMaybe<Jsonb_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  total_price_usd_cents?: InputMaybe<Int_Comparison_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
  transaction_on_chain_attempts?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
  transaction_on_chain_attempts_aggregate?: InputMaybe<Transaction_On_Chain_Attempt_Aggregate_Bool_Exp>;
  transfer_completed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  transfer_failed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  trench_transaction_id?: InputMaybe<String_Comparison_Exp>;
  use_paper_key?: InputMaybe<Boolean_Comparison_Exp>;
  user_exported_nft_transaction_hashes?: InputMaybe<Jsonb_Comparison_Exp>;
  value_in_currency?: InputMaybe<String_Comparison_Exp>;
  wallet_address?: InputMaybe<String_Comparison_Exp>;
  wallet_type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "transaction" */
export enum Transaction_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransactionPkey = 'transaction_pkey',
  /** unique or primary key constraint on columns "solana_whitelist_transaction_hash" */
  TransactionSolanaWhitelistTokenSentSignatureKey = 'transaction_solana_whitelist_token_sent_signature_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Transaction_Delete_At_Path_Input = {
  claimed_tokens?: InputMaybe<Array<Scalars['String']['input']>>;
  contract_args?: InputMaybe<Array<Scalars['String']['input']>>;
  eligibility_method?: InputMaybe<Array<Scalars['String']['input']>>;
  expected_crypto_payment?: InputMaybe<Array<Scalars['String']['input']>>;
  locked_fields?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata?: InputMaybe<Array<Scalars['String']['input']>>;
  mint_method?: InputMaybe<Array<Scalars['String']['input']>>;
  signature_args?: InputMaybe<Array<Scalars['String']['input']>>;
  test_buckets?: InputMaybe<Array<Scalars['String']['input']>>;
  user_exported_nft_transaction_hashes?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Transaction_Delete_Elem_Input = {
  claimed_tokens?: InputMaybe<Scalars['Int']['input']>;
  contract_args?: InputMaybe<Scalars['Int']['input']>;
  eligibility_method?: InputMaybe<Scalars['Int']['input']>;
  expected_crypto_payment?: InputMaybe<Scalars['Int']['input']>;
  locked_fields?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['Int']['input']>;
  mint_method?: InputMaybe<Scalars['Int']['input']>;
  signature_args?: InputMaybe<Scalars['Int']['input']>;
  test_buckets?: InputMaybe<Scalars['Int']['input']>;
  user_exported_nft_transaction_hashes?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Transaction_Delete_Key_Input = {
  claimed_tokens?: InputMaybe<Scalars['String']['input']>;
  contract_args?: InputMaybe<Scalars['String']['input']>;
  eligibility_method?: InputMaybe<Scalars['String']['input']>;
  expected_crypto_payment?: InputMaybe<Scalars['String']['input']>;
  locked_fields?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  mint_method?: InputMaybe<Scalars['String']['input']>;
  signature_args?: InputMaybe<Scalars['String']['input']>;
  test_buckets?: InputMaybe<Scalars['String']['input']>;
  user_exported_nft_transaction_hashes?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "transaction" */
export type Transaction_Inc_Input = {
  float_wallet_nonce?: InputMaybe<Scalars['Int']['input']>;
  locked_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  network_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  service_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  total_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "transaction" */
export type Transaction_Insert_Input = {
  airdrop_worker_job_name?: InputMaybe<Scalars['String']['input']>;
  buyer?: InputMaybe<Buyer_Obj_Rel_Insert_Input>;
  buyer_id?: InputMaybe<Scalars['String']['input']>;
  checkout?: InputMaybe<Checkout_Obj_Rel_Insert_Input>;
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  checkoutcom_payment_id?: InputMaybe<Scalars['String']['input']>;
  claimed_tokens?: InputMaybe<Scalars['jsonb']['input']>;
  coinbase_payment_id?: InputMaybe<Scalars['String']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  crypto_payment_payer_address?: InputMaybe<Scalars['String']['input']>;
  crypto_payment_transaction_hash?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  customer?: InputMaybe<Customer_Obj_Rel_Insert_Input>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  eligibility_method?: InputMaybe<Scalars['jsonb']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expected_crypto_payment?: InputMaybe<Scalars['jsonb']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  failure_reason?: InputMaybe<Scalars['String']['input']>;
  fee_bearer?: InputMaybe<Scalars['String']['input']>;
  fiat_currency?: InputMaybe<Scalars['String']['input']>;
  float_wallet_nonce?: InputMaybe<Scalars['Int']['input']>;
  float_wallet_used?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  locked_fields?: InputMaybe<Scalars['jsonb']['input']>;
  locked_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mint_method?: InputMaybe<Scalars['jsonb']['input']>;
  network_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  payment_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payment_failure_code?: InputMaybe<Scalars['String']['input']>;
  payment_hold_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  payment_started_at?: InputMaybe<Scalars['timestamptz']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  queueId?: InputMaybe<Scalars['String']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  refunded_at?: InputMaybe<Scalars['timestamptz']['input']>;
  requested_token_id?: InputMaybe<Scalars['String']['input']>;
  sdk_client_secret?: InputMaybe<Scalars['String']['input']>;
  service_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  signature_args?: InputMaybe<Scalars['jsonb']['input']>;
  solana_whitelist_transaction_hash?: InputMaybe<Scalars['String']['input']>;
  stripe_payment_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  test_buckets?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  total_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
  transaction_on_chain_attempts?: InputMaybe<Transaction_On_Chain_Attempt_Arr_Rel_Insert_Input>;
  transfer_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  transfer_failed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  trench_transaction_id?: InputMaybe<Scalars['String']['input']>;
  use_paper_key?: InputMaybe<Scalars['Boolean']['input']>;
  user_exported_nft_transaction_hashes?: InputMaybe<Scalars['jsonb']['input']>;
  value_in_currency?: InputMaybe<Scalars['String']['input']>;
  wallet_address?: InputMaybe<Scalars['String']['input']>;
  wallet_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Transaction_Max_Fields = {
  __typename?: 'transaction_max_fields';
  airdrop_worker_job_name?: Maybe<Scalars['String']['output']>;
  buyer_id?: Maybe<Scalars['String']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  checkoutcom_payment_id?: Maybe<Scalars['String']['output']>;
  coinbase_payment_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  crypto_payment_payer_address?: Maybe<Scalars['String']['output']>;
  crypto_payment_transaction_hash?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  failure_reason?: Maybe<Scalars['String']['output']>;
  fee_bearer?: Maybe<Scalars['String']['output']>;
  fiat_currency?: Maybe<Scalars['String']['output']>;
  float_wallet_nonce?: Maybe<Scalars['Int']['output']>;
  float_wallet_used?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  payment_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  payment_failure_code?: Maybe<Scalars['String']['output']>;
  payment_hold_created_at?: Maybe<Scalars['timestamptz']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  payment_started_at?: Maybe<Scalars['timestamptz']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  queueId?: Maybe<Scalars['String']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  refunded_at?: Maybe<Scalars['timestamptz']['output']>;
  requested_token_id?: Maybe<Scalars['String']['output']>;
  sdk_client_secret?: Maybe<Scalars['String']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  solana_whitelist_transaction_hash?: Maybe<Scalars['String']['output']>;
  stripe_payment_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  transfer_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  transfer_failed_at?: Maybe<Scalars['timestamptz']['output']>;
  trench_transaction_id?: Maybe<Scalars['String']['output']>;
  value_in_currency?: Maybe<Scalars['String']['output']>;
  wallet_address?: Maybe<Scalars['String']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Transaction_Min_Fields = {
  __typename?: 'transaction_min_fields';
  airdrop_worker_job_name?: Maybe<Scalars['String']['output']>;
  buyer_id?: Maybe<Scalars['String']['output']>;
  checkout_id?: Maybe<Scalars['uuid']['output']>;
  checkoutcom_payment_id?: Maybe<Scalars['String']['output']>;
  coinbase_payment_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  crypto_payment_payer_address?: Maybe<Scalars['String']['output']>;
  crypto_payment_transaction_hash?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  expires_at?: Maybe<Scalars['timestamptz']['output']>;
  failure_reason?: Maybe<Scalars['String']['output']>;
  fee_bearer?: Maybe<Scalars['String']['output']>;
  fiat_currency?: Maybe<Scalars['String']['output']>;
  float_wallet_nonce?: Maybe<Scalars['Int']['output']>;
  float_wallet_used?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  payment_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  payment_failure_code?: Maybe<Scalars['String']['output']>;
  payment_hold_created_at?: Maybe<Scalars['timestamptz']['output']>;
  payment_method?: Maybe<Scalars['String']['output']>;
  payment_started_at?: Maybe<Scalars['timestamptz']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  queueId?: Maybe<Scalars['String']['output']>;
  referrer?: Maybe<Scalars['String']['output']>;
  refunded_at?: Maybe<Scalars['timestamptz']['output']>;
  requested_token_id?: Maybe<Scalars['String']['output']>;
  sdk_client_secret?: Maybe<Scalars['String']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  solana_whitelist_transaction_hash?: Maybe<Scalars['String']['output']>;
  stripe_payment_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_id?: Maybe<Scalars['String']['output']>;
  stripe_verification_session_result?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  transfer_completed_at?: Maybe<Scalars['timestamptz']['output']>;
  transfer_failed_at?: Maybe<Scalars['timestamptz']['output']>;
  trench_transaction_id?: Maybe<Scalars['String']['output']>;
  value_in_currency?: Maybe<Scalars['String']['output']>;
  wallet_address?: Maybe<Scalars['String']['output']>;
  wallet_type?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "transaction" */
export type Transaction_Mutation_Response = {
  __typename?: 'transaction_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Transaction>;
};

/** input type for inserting object relation for remote table "transaction" */
export type Transaction_Obj_Rel_Insert_Input = {
  data: Transaction_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Transaction_On_Conflict>;
};

/** Tracks information/statuses of transaction-related blockchain interaction attempts */
export type Transaction_On_Chain_Attempt = {
  __typename?: 'transaction_on_chain_attempt';
  created_at: Scalars['timestamptz']['output'];
  failure_description: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  status: Scalars['String']['output'];
  /** An object relationship */
  transaction: Transaction;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  transaction_id: Scalars['uuid']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Aggregate = {
  __typename?: 'transaction_on_chain_attempt_aggregate';
  aggregate?: Maybe<Transaction_On_Chain_Attempt_Aggregate_Fields>;
  nodes: Array<Transaction_On_Chain_Attempt>;
};

export type Transaction_On_Chain_Attempt_Aggregate_Bool_Exp = {
  count?: InputMaybe<Transaction_On_Chain_Attempt_Aggregate_Bool_Exp_Count>;
};

export type Transaction_On_Chain_Attempt_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Aggregate_Fields = {
  __typename?: 'transaction_on_chain_attempt_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Transaction_On_Chain_Attempt_Max_Fields>;
  min?: Maybe<Transaction_On_Chain_Attempt_Min_Fields>;
};


/** aggregate fields of "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transaction_On_Chain_Attempt_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transaction_On_Chain_Attempt_Max_Order_By>;
  min?: InputMaybe<Transaction_On_Chain_Attempt_Min_Order_By>;
};

/** input type for inserting array relation for remote table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Arr_Rel_Insert_Input = {
  data: Array<Transaction_On_Chain_Attempt_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Transaction_On_Chain_Attempt_On_Conflict>;
};

/** Boolean expression to filter rows from the table "transaction_on_chain_attempt". All fields are combined with a logical 'AND'. */
export type Transaction_On_Chain_Attempt_Bool_Exp = {
  _and?: InputMaybe<Array<Transaction_On_Chain_Attempt_Bool_Exp>>;
  _not?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
  _or?: InputMaybe<Array<Transaction_On_Chain_Attempt_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  failure_description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  transaction?: InputMaybe<Transaction_Bool_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
  transaction_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "transaction_on_chain_attempt" */
export enum Transaction_On_Chain_Attempt_Constraint {
  /** unique or primary key constraint on columns "id" */
  TransactionOnChainAttemptPkey = 'transaction_on_chain_attempt_pkey'
}

/** input type for inserting data into table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  failure_description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  transaction?: InputMaybe<Transaction_Obj_Rel_Insert_Input>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Transaction_On_Chain_Attempt_Max_Fields = {
  __typename?: 'transaction_on_chain_attempt_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  failure_description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  transaction_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  failure_description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transaction_On_Chain_Attempt_Min_Fields = {
  __typename?: 'transaction_on_chain_attempt_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  failure_description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  transaction_id?: Maybe<Scalars['uuid']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  failure_description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Mutation_Response = {
  __typename?: 'transaction_on_chain_attempt_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Transaction_On_Chain_Attempt>;
};

/** on_conflict condition type for table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_On_Conflict = {
  constraint: Transaction_On_Chain_Attempt_Constraint;
  update_columns?: Array<Transaction_On_Chain_Attempt_Update_Column>;
  where?: InputMaybe<Transaction_On_Chain_Attempt_Bool_Exp>;
};

/** Ordering options when selecting data from "transaction_on_chain_attempt". */
export type Transaction_On_Chain_Attempt_Order_By = {
  created_at?: InputMaybe<Order_By>;
  failure_description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transaction_Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: transaction_on_chain_attempt */
export type Transaction_On_Chain_Attempt_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "transaction_on_chain_attempt" */
export enum Transaction_On_Chain_Attempt_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FailureDescription = 'failure_description',
  /** column name */
  Id = 'id',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  failure_description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "transaction_on_chain_attempt" */
export type Transaction_On_Chain_Attempt_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transaction_On_Chain_Attempt_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transaction_On_Chain_Attempt_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  failure_description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
  transaction_id?: InputMaybe<Scalars['uuid']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "transaction_on_chain_attempt" */
export enum Transaction_On_Chain_Attempt_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FailureDescription = 'failure_description',
  /** column name */
  Id = 'id',
  /** column name */
  Status = 'status',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  TransactionId = 'transaction_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Transaction_On_Chain_Attempt_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transaction_On_Chain_Attempt_Set_Input>;
  /** filter the rows which have to be updated */
  where: Transaction_On_Chain_Attempt_Bool_Exp;
};

/** on_conflict condition type for table "transaction" */
export type Transaction_On_Conflict = {
  constraint: Transaction_Constraint;
  update_columns?: Array<Transaction_Update_Column>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};

/** Ordering options when selecting data from "transaction". */
export type Transaction_Order_By = {
  airdrop_worker_job_name?: InputMaybe<Order_By>;
  buyer?: InputMaybe<Buyer_Order_By>;
  buyer_id?: InputMaybe<Order_By>;
  checkout?: InputMaybe<Checkout_Order_By>;
  checkout_id?: InputMaybe<Order_By>;
  checkoutcom_payment_id?: InputMaybe<Order_By>;
  claimed_tokens?: InputMaybe<Order_By>;
  coinbase_payment_id?: InputMaybe<Order_By>;
  contract_args?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  crypto_payment_payer_address?: InputMaybe<Order_By>;
  crypto_payment_transaction_hash?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  customer?: InputMaybe<Customer_Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  eligibility_method?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  expected_crypto_payment?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  failure_reason?: InputMaybe<Order_By>;
  fee_bearer?: InputMaybe<Order_By>;
  fiat_currency?: InputMaybe<Order_By>;
  float_wallet_nonce?: InputMaybe<Order_By>;
  float_wallet_used?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  location?: InputMaybe<Order_By>;
  locked_fields?: InputMaybe<Order_By>;
  locked_price_usd_cents?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mint_method?: InputMaybe<Order_By>;
  network_fee_usd_cents?: InputMaybe<Order_By>;
  payment_completed_at?: InputMaybe<Order_By>;
  payment_failure_code?: InputMaybe<Order_By>;
  payment_hold_created_at?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  payment_started_at?: InputMaybe<Order_By>;
  quantity?: InputMaybe<Order_By>;
  queueId?: InputMaybe<Order_By>;
  referrer?: InputMaybe<Order_By>;
  refunded_at?: InputMaybe<Order_By>;
  requested_token_id?: InputMaybe<Order_By>;
  sdk_client_secret?: InputMaybe<Order_By>;
  service_fee_usd_cents?: InputMaybe<Order_By>;
  signature_args?: InputMaybe<Order_By>;
  solana_whitelist_transaction_hash?: InputMaybe<Order_By>;
  stripe_payment_id?: InputMaybe<Order_By>;
  stripe_verification_session_id?: InputMaybe<Order_By>;
  stripe_verification_session_result?: InputMaybe<Order_By>;
  test_buckets?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  total_price_usd_cents?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  transaction_on_chain_attempts_aggregate?: InputMaybe<Transaction_On_Chain_Attempt_Aggregate_Order_By>;
  transfer_completed_at?: InputMaybe<Order_By>;
  transfer_failed_at?: InputMaybe<Order_By>;
  trench_transaction_id?: InputMaybe<Order_By>;
  use_paper_key?: InputMaybe<Order_By>;
  user_exported_nft_transaction_hashes?: InputMaybe<Order_By>;
  value_in_currency?: InputMaybe<Order_By>;
  wallet_address?: InputMaybe<Order_By>;
  wallet_type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: transaction */
export type Transaction_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Transaction_Prepend_Input = {
  claimed_tokens?: InputMaybe<Scalars['jsonb']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  eligibility_method?: InputMaybe<Scalars['jsonb']['input']>;
  expected_crypto_payment?: InputMaybe<Scalars['jsonb']['input']>;
  locked_fields?: InputMaybe<Scalars['jsonb']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mint_method?: InputMaybe<Scalars['jsonb']['input']>;
  signature_args?: InputMaybe<Scalars['jsonb']['input']>;
  test_buckets?: InputMaybe<Scalars['jsonb']['input']>;
  user_exported_nft_transaction_hashes?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "transaction" */
export enum Transaction_Select_Column {
  /** column name */
  AirdropWorkerJobName = 'airdrop_worker_job_name',
  /** column name */
  BuyerId = 'buyer_id',
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  CheckoutcomPaymentId = 'checkoutcom_payment_id',
  /** column name */
  ClaimedTokens = 'claimed_tokens',
  /** column name */
  CoinbasePaymentId = 'coinbase_payment_id',
  /** column name */
  ContractArgs = 'contract_args',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CryptoPaymentPayerAddress = 'crypto_payment_payer_address',
  /** column name */
  CryptoPaymentTransactionHash = 'crypto_payment_transaction_hash',
  /** column name */
  Currency = 'currency',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  EligibilityMethod = 'eligibility_method',
  /** column name */
  Email = 'email',
  /** column name */
  ExpectedCryptoPayment = 'expected_crypto_payment',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  FailureReason = 'failure_reason',
  /** column name */
  FeeBearer = 'fee_bearer',
  /** column name */
  FiatCurrency = 'fiat_currency',
  /** column name */
  FloatWalletNonce = 'float_wallet_nonce',
  /** column name */
  FloatWalletUsed = 'float_wallet_used',
  /** column name */
  Id = 'id',
  /** column name */
  Location = 'location',
  /** column name */
  LockedFields = 'locked_fields',
  /** column name */
  LockedPriceUsdCents = 'locked_price_usd_cents',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MintMethod = 'mint_method',
  /** column name */
  NetworkFeeUsdCents = 'network_fee_usd_cents',
  /** column name */
  PaymentCompletedAt = 'payment_completed_at',
  /** column name */
  PaymentFailureCode = 'payment_failure_code',
  /** column name */
  PaymentHoldCreatedAt = 'payment_hold_created_at',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  PaymentStartedAt = 'payment_started_at',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  QueueId = 'queueId',
  /** column name */
  Referrer = 'referrer',
  /** column name */
  RefundedAt = 'refunded_at',
  /** column name */
  RequestedTokenId = 'requested_token_id',
  /** column name */
  SdkClientSecret = 'sdk_client_secret',
  /** column name */
  ServiceFeeUsdCents = 'service_fee_usd_cents',
  /** column name */
  SignatureArgs = 'signature_args',
  /** column name */
  SolanaWhitelistTransactionHash = 'solana_whitelist_transaction_hash',
  /** column name */
  StripePaymentId = 'stripe_payment_id',
  /** column name */
  StripeVerificationSessionId = 'stripe_verification_session_id',
  /** column name */
  StripeVerificationSessionResult = 'stripe_verification_session_result',
  /** column name */
  TestBuckets = 'test_buckets',
  /** column name */
  Title = 'title',
  /** column name */
  TotalPriceUsdCents = 'total_price_usd_cents',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  TransferCompletedAt = 'transfer_completed_at',
  /** column name */
  TransferFailedAt = 'transfer_failed_at',
  /** column name */
  TrenchTransactionId = 'trench_transaction_id',
  /** column name */
  UsePaperKey = 'use_paper_key',
  /** column name */
  UserExportedNftTransactionHashes = 'user_exported_nft_transaction_hashes',
  /** column name */
  ValueInCurrency = 'value_in_currency',
  /** column name */
  WalletAddress = 'wallet_address',
  /** column name */
  WalletType = 'wallet_type'
}

/** input type for updating data in table "transaction" */
export type Transaction_Set_Input = {
  airdrop_worker_job_name?: InputMaybe<Scalars['String']['input']>;
  buyer_id?: InputMaybe<Scalars['String']['input']>;
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  checkoutcom_payment_id?: InputMaybe<Scalars['String']['input']>;
  claimed_tokens?: InputMaybe<Scalars['jsonb']['input']>;
  coinbase_payment_id?: InputMaybe<Scalars['String']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  crypto_payment_payer_address?: InputMaybe<Scalars['String']['input']>;
  crypto_payment_transaction_hash?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  eligibility_method?: InputMaybe<Scalars['jsonb']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expected_crypto_payment?: InputMaybe<Scalars['jsonb']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  failure_reason?: InputMaybe<Scalars['String']['input']>;
  fee_bearer?: InputMaybe<Scalars['String']['input']>;
  fiat_currency?: InputMaybe<Scalars['String']['input']>;
  float_wallet_nonce?: InputMaybe<Scalars['Int']['input']>;
  float_wallet_used?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  locked_fields?: InputMaybe<Scalars['jsonb']['input']>;
  locked_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mint_method?: InputMaybe<Scalars['jsonb']['input']>;
  network_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  payment_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payment_failure_code?: InputMaybe<Scalars['String']['input']>;
  payment_hold_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  payment_started_at?: InputMaybe<Scalars['timestamptz']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  queueId?: InputMaybe<Scalars['String']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  refunded_at?: InputMaybe<Scalars['timestamptz']['input']>;
  requested_token_id?: InputMaybe<Scalars['String']['input']>;
  sdk_client_secret?: InputMaybe<Scalars['String']['input']>;
  service_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  signature_args?: InputMaybe<Scalars['jsonb']['input']>;
  solana_whitelist_transaction_hash?: InputMaybe<Scalars['String']['input']>;
  stripe_payment_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  test_buckets?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  total_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
  transfer_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  transfer_failed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  trench_transaction_id?: InputMaybe<Scalars['String']['input']>;
  use_paper_key?: InputMaybe<Scalars['Boolean']['input']>;
  user_exported_nft_transaction_hashes?: InputMaybe<Scalars['jsonb']['input']>;
  value_in_currency?: InputMaybe<Scalars['String']['input']>;
  wallet_address?: InputMaybe<Scalars['String']['input']>;
  wallet_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Transaction_Stddev_Fields = {
  __typename?: 'transaction_stddev_fields';
  float_wallet_nonce?: Maybe<Scalars['Float']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Transaction_Stddev_Pop_Fields = {
  __typename?: 'transaction_stddev_pop_fields';
  float_wallet_nonce?: Maybe<Scalars['Float']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Transaction_Stddev_Samp_Fields = {
  __typename?: 'transaction_stddev_samp_fields';
  float_wallet_nonce?: Maybe<Scalars['Float']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "transaction" */
export type Transaction_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Transaction_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Transaction_Stream_Cursor_Value_Input = {
  airdrop_worker_job_name?: InputMaybe<Scalars['String']['input']>;
  buyer_id?: InputMaybe<Scalars['String']['input']>;
  checkout_id?: InputMaybe<Scalars['uuid']['input']>;
  checkoutcom_payment_id?: InputMaybe<Scalars['String']['input']>;
  claimed_tokens?: InputMaybe<Scalars['jsonb']['input']>;
  coinbase_payment_id?: InputMaybe<Scalars['String']['input']>;
  contract_args?: InputMaybe<Scalars['jsonb']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  crypto_payment_payer_address?: InputMaybe<Scalars['String']['input']>;
  crypto_payment_transaction_hash?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  eligibility_method?: InputMaybe<Scalars['jsonb']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expected_crypto_payment?: InputMaybe<Scalars['jsonb']['input']>;
  expires_at?: InputMaybe<Scalars['timestamptz']['input']>;
  failure_reason?: InputMaybe<Scalars['String']['input']>;
  fee_bearer?: InputMaybe<Scalars['String']['input']>;
  fiat_currency?: InputMaybe<Scalars['String']['input']>;
  float_wallet_nonce?: InputMaybe<Scalars['Int']['input']>;
  float_wallet_used?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  locked_fields?: InputMaybe<Scalars['jsonb']['input']>;
  locked_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  metadata?: InputMaybe<Scalars['jsonb']['input']>;
  mint_method?: InputMaybe<Scalars['jsonb']['input']>;
  network_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  payment_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payment_failure_code?: InputMaybe<Scalars['String']['input']>;
  payment_hold_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  payment_started_at?: InputMaybe<Scalars['timestamptz']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  queueId?: InputMaybe<Scalars['String']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  refunded_at?: InputMaybe<Scalars['timestamptz']['input']>;
  requested_token_id?: InputMaybe<Scalars['String']['input']>;
  sdk_client_secret?: InputMaybe<Scalars['String']['input']>;
  service_fee_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  signature_args?: InputMaybe<Scalars['jsonb']['input']>;
  solana_whitelist_transaction_hash?: InputMaybe<Scalars['String']['input']>;
  stripe_payment_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_id?: InputMaybe<Scalars['String']['input']>;
  stripe_verification_session_result?: InputMaybe<Scalars['String']['input']>;
  test_buckets?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  total_price_usd_cents?: InputMaybe<Scalars['Int']['input']>;
  transaction_hash?: InputMaybe<Scalars['String']['input']>;
  transfer_completed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  transfer_failed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  trench_transaction_id?: InputMaybe<Scalars['String']['input']>;
  use_paper_key?: InputMaybe<Scalars['Boolean']['input']>;
  user_exported_nft_transaction_hashes?: InputMaybe<Scalars['jsonb']['input']>;
  value_in_currency?: InputMaybe<Scalars['String']['input']>;
  wallet_address?: InputMaybe<Scalars['String']['input']>;
  wallet_type?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Transaction_Sum_Fields = {
  __typename?: 'transaction_sum_fields';
  float_wallet_nonce?: Maybe<Scalars['Int']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Int']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Int']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "transaction" */
export enum Transaction_Update_Column {
  /** column name */
  AirdropWorkerJobName = 'airdrop_worker_job_name',
  /** column name */
  BuyerId = 'buyer_id',
  /** column name */
  CheckoutId = 'checkout_id',
  /** column name */
  CheckoutcomPaymentId = 'checkoutcom_payment_id',
  /** column name */
  ClaimedTokens = 'claimed_tokens',
  /** column name */
  CoinbasePaymentId = 'coinbase_payment_id',
  /** column name */
  ContractArgs = 'contract_args',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CryptoPaymentPayerAddress = 'crypto_payment_payer_address',
  /** column name */
  CryptoPaymentTransactionHash = 'crypto_payment_transaction_hash',
  /** column name */
  Currency = 'currency',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  EligibilityMethod = 'eligibility_method',
  /** column name */
  Email = 'email',
  /** column name */
  ExpectedCryptoPayment = 'expected_crypto_payment',
  /** column name */
  ExpiresAt = 'expires_at',
  /** column name */
  FailureReason = 'failure_reason',
  /** column name */
  FeeBearer = 'fee_bearer',
  /** column name */
  FiatCurrency = 'fiat_currency',
  /** column name */
  FloatWalletNonce = 'float_wallet_nonce',
  /** column name */
  FloatWalletUsed = 'float_wallet_used',
  /** column name */
  Id = 'id',
  /** column name */
  Location = 'location',
  /** column name */
  LockedFields = 'locked_fields',
  /** column name */
  LockedPriceUsdCents = 'locked_price_usd_cents',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  MintMethod = 'mint_method',
  /** column name */
  NetworkFeeUsdCents = 'network_fee_usd_cents',
  /** column name */
  PaymentCompletedAt = 'payment_completed_at',
  /** column name */
  PaymentFailureCode = 'payment_failure_code',
  /** column name */
  PaymentHoldCreatedAt = 'payment_hold_created_at',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  PaymentStartedAt = 'payment_started_at',
  /** column name */
  Quantity = 'quantity',
  /** column name */
  QueueId = 'queueId',
  /** column name */
  Referrer = 'referrer',
  /** column name */
  RefundedAt = 'refunded_at',
  /** column name */
  RequestedTokenId = 'requested_token_id',
  /** column name */
  SdkClientSecret = 'sdk_client_secret',
  /** column name */
  ServiceFeeUsdCents = 'service_fee_usd_cents',
  /** column name */
  SignatureArgs = 'signature_args',
  /** column name */
  SolanaWhitelistTransactionHash = 'solana_whitelist_transaction_hash',
  /** column name */
  StripePaymentId = 'stripe_payment_id',
  /** column name */
  StripeVerificationSessionId = 'stripe_verification_session_id',
  /** column name */
  StripeVerificationSessionResult = 'stripe_verification_session_result',
  /** column name */
  TestBuckets = 'test_buckets',
  /** column name */
  Title = 'title',
  /** column name */
  TotalPriceUsdCents = 'total_price_usd_cents',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  TransferCompletedAt = 'transfer_completed_at',
  /** column name */
  TransferFailedAt = 'transfer_failed_at',
  /** column name */
  TrenchTransactionId = 'trench_transaction_id',
  /** column name */
  UsePaperKey = 'use_paper_key',
  /** column name */
  UserExportedNftTransactionHashes = 'user_exported_nft_transaction_hashes',
  /** column name */
  ValueInCurrency = 'value_in_currency',
  /** column name */
  WalletAddress = 'wallet_address',
  /** column name */
  WalletType = 'wallet_type'
}

export type Transaction_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Transaction_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Transaction_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Transaction_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Transaction_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Transaction_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Transaction_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Transaction_Set_Input>;
  /** filter the rows which have to be updated */
  where: Transaction_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Transaction_Var_Pop_Fields = {
  __typename?: 'transaction_var_pop_fields';
  float_wallet_nonce?: Maybe<Scalars['Float']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Transaction_Var_Samp_Fields = {
  __typename?: 'transaction_var_samp_fields';
  float_wallet_nonce?: Maybe<Scalars['Float']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Transaction_Variance_Fields = {
  __typename?: 'transaction_variance_fields';
  float_wallet_nonce?: Maybe<Scalars['Float']['output']>;
  locked_price_usd_cents?: Maybe<Scalars['Float']['output']>;
  network_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  service_fee_usd_cents?: Maybe<Scalars['Float']['output']>;
  total_price_usd_cents?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

/** Waller user details */
export type Wallet_User = {
  __typename?: 'wallet_user';
  authed_user_id: Scalars['String']['output'];
  client_id: Scalars['uuid']['output'];
  created_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  customer?: Maybe<Customer>;
  date_recovery_code_sent: Scalars['timestamptz']['output'];
  /** This field is deprecated, use authed_user.email instead */
  email?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  embedded_wallet: Array<Embedded_Wallet>;
  /** An aggregate relationship */
  embedded_wallet_aggregate: Embedded_Wallet_Aggregate;
  /** An array relationship */
  ews_authed_user: Array<Ews_Authed_User>;
  /** An aggregate relationship */
  ews_authed_user_aggregate: Ews_Authed_User_Aggregate;
  id: Scalars['uuid']['output'];
  is_aws_managed: Scalars['Boolean']['output'];
  last_accessed_at: Scalars['timestamptz']['output'];
  /** An object relationship */
  oauth: Oauth;
  recovery_share_management: Scalars['String']['output'];
  /** An array relationship */
  wallet_shares: Array<Share>;
  /** An aggregate relationship */
  wallet_shares_aggregate: Share_Aggregate;
};


/** Waller user details */
export type Wallet_UserEmbedded_WalletArgs = {
  distinct_on?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Embedded_Wallet_Order_By>>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};


/** Waller user details */
export type Wallet_UserEmbedded_Wallet_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Embedded_Wallet_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Embedded_Wallet_Order_By>>;
  where?: InputMaybe<Embedded_Wallet_Bool_Exp>;
};


/** Waller user details */
export type Wallet_UserEws_Authed_UserArgs = {
  distinct_on?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ews_Authed_User_Order_By>>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};


/** Waller user details */
export type Wallet_UserEws_Authed_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ews_Authed_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Ews_Authed_User_Order_By>>;
  where?: InputMaybe<Ews_Authed_User_Bool_Exp>;
};


/** Waller user details */
export type Wallet_UserWallet_SharesArgs = {
  distinct_on?: InputMaybe<Array<Share_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Share_Order_By>>;
  where?: InputMaybe<Share_Bool_Exp>;
};


/** Waller user details */
export type Wallet_UserWallet_Shares_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Share_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Share_Order_By>>;
  where?: InputMaybe<Share_Bool_Exp>;
};

/** aggregated selection of "wallet_user" */
export type Wallet_User_Aggregate = {
  __typename?: 'wallet_user_aggregate';
  aggregate?: Maybe<Wallet_User_Aggregate_Fields>;
  nodes: Array<Wallet_User>;
};

export type Wallet_User_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Wallet_User_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Wallet_User_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Wallet_User_Aggregate_Bool_Exp_Count>;
};

export type Wallet_User_Aggregate_Bool_Exp_Bool_And = {
  arguments: Wallet_User_Select_Column_Wallet_User_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Wallet_User_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Wallet_User_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Wallet_User_Select_Column_Wallet_User_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Wallet_User_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Wallet_User_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Wallet_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Wallet_User_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "wallet_user" */
export type Wallet_User_Aggregate_Fields = {
  __typename?: 'wallet_user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Wallet_User_Max_Fields>;
  min?: Maybe<Wallet_User_Min_Fields>;
};


/** aggregate fields of "wallet_user" */
export type Wallet_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Wallet_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "wallet_user" */
export type Wallet_User_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Wallet_User_Max_Order_By>;
  min?: InputMaybe<Wallet_User_Min_Order_By>;
};

/** input type for inserting array relation for remote table "wallet_user" */
export type Wallet_User_Arr_Rel_Insert_Input = {
  data: Array<Wallet_User_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Wallet_User_On_Conflict>;
};

/** Boolean expression to filter rows from the table "wallet_user". All fields are combined with a logical 'AND'. */
export type Wallet_User_Bool_Exp = {
  _and?: InputMaybe<Array<Wallet_User_Bool_Exp>>;
  _not?: InputMaybe<Wallet_User_Bool_Exp>;
  _or?: InputMaybe<Array<Wallet_User_Bool_Exp>>;
  authed_user_id?: InputMaybe<String_Comparison_Exp>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  customer?: InputMaybe<Customer_Bool_Exp>;
  date_recovery_code_sent?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  embedded_wallet?: InputMaybe<Embedded_Wallet_Bool_Exp>;
  embedded_wallet_aggregate?: InputMaybe<Embedded_Wallet_Aggregate_Bool_Exp>;
  ews_authed_user?: InputMaybe<Ews_Authed_User_Bool_Exp>;
  ews_authed_user_aggregate?: InputMaybe<Ews_Authed_User_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_aws_managed?: InputMaybe<Boolean_Comparison_Exp>;
  last_accessed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  oauth?: InputMaybe<Oauth_Bool_Exp>;
  recovery_share_management?: InputMaybe<String_Comparison_Exp>;
  wallet_shares?: InputMaybe<Share_Bool_Exp>;
  wallet_shares_aggregate?: InputMaybe<Share_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "wallet_user" */
export enum Wallet_User_Constraint {
  /** unique or primary key constraint on columns "authed_user_id", "client_id", "email" */
  WalletUserAuthedUserIdClientIdEmailKey = 'wallet_user_authed_user_id_client_id_email_key',
  /** unique or primary key constraint on columns "id" */
  WalletUserPkey = 'wallet_user_pkey'
}

/** input type for inserting data into table "wallet_user" */
export type Wallet_User_Insert_Input = {
  authed_user_id?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  customer?: InputMaybe<Customer_Obj_Rel_Insert_Input>;
  date_recovery_code_sent?: InputMaybe<Scalars['timestamptz']['input']>;
  /** This field is deprecated, use authed_user.email instead */
  email?: InputMaybe<Scalars['String']['input']>;
  embedded_wallet?: InputMaybe<Embedded_Wallet_Arr_Rel_Insert_Input>;
  ews_authed_user?: InputMaybe<Ews_Authed_User_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_aws_managed?: InputMaybe<Scalars['Boolean']['input']>;
  last_accessed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  oauth?: InputMaybe<Oauth_Obj_Rel_Insert_Input>;
  recovery_share_management?: InputMaybe<Scalars['String']['input']>;
  wallet_shares?: InputMaybe<Share_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Wallet_User_Max_Fields = {
  __typename?: 'wallet_user_max_fields';
  authed_user_id?: Maybe<Scalars['String']['output']>;
  client_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  date_recovery_code_sent?: Maybe<Scalars['timestamptz']['output']>;
  /** This field is deprecated, use authed_user.email instead */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_accessed_at?: Maybe<Scalars['timestamptz']['output']>;
  recovery_share_management?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "wallet_user" */
export type Wallet_User_Max_Order_By = {
  authed_user_id?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date_recovery_code_sent?: InputMaybe<Order_By>;
  /** This field is deprecated, use authed_user.email instead */
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_accessed_at?: InputMaybe<Order_By>;
  recovery_share_management?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Wallet_User_Min_Fields = {
  __typename?: 'wallet_user_min_fields';
  authed_user_id?: Maybe<Scalars['String']['output']>;
  client_id?: Maybe<Scalars['uuid']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  date_recovery_code_sent?: Maybe<Scalars['timestamptz']['output']>;
  /** This field is deprecated, use authed_user.email instead */
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_accessed_at?: Maybe<Scalars['timestamptz']['output']>;
  recovery_share_management?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "wallet_user" */
export type Wallet_User_Min_Order_By = {
  authed_user_id?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date_recovery_code_sent?: InputMaybe<Order_By>;
  /** This field is deprecated, use authed_user.email instead */
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_accessed_at?: InputMaybe<Order_By>;
  recovery_share_management?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "wallet_user" */
export type Wallet_User_Mutation_Response = {
  __typename?: 'wallet_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Wallet_User>;
};

/** input type for inserting object relation for remote table "wallet_user" */
export type Wallet_User_Obj_Rel_Insert_Input = {
  data: Wallet_User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Wallet_User_On_Conflict>;
};

/** on_conflict condition type for table "wallet_user" */
export type Wallet_User_On_Conflict = {
  constraint: Wallet_User_Constraint;
  update_columns?: Array<Wallet_User_Update_Column>;
  where?: InputMaybe<Wallet_User_Bool_Exp>;
};

/** Ordering options when selecting data from "wallet_user". */
export type Wallet_User_Order_By = {
  authed_user_id?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  customer?: InputMaybe<Customer_Order_By>;
  date_recovery_code_sent?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  embedded_wallet_aggregate?: InputMaybe<Embedded_Wallet_Aggregate_Order_By>;
  ews_authed_user_aggregate?: InputMaybe<Ews_Authed_User_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  is_aws_managed?: InputMaybe<Order_By>;
  last_accessed_at?: InputMaybe<Order_By>;
  oauth?: InputMaybe<Oauth_Order_By>;
  recovery_share_management?: InputMaybe<Order_By>;
  wallet_shares_aggregate?: InputMaybe<Share_Aggregate_Order_By>;
};

/** primary key columns input for table: wallet_user */
export type Wallet_User_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "wallet_user" */
export enum Wallet_User_Select_Column {
  /** column name */
  AuthedUserId = 'authed_user_id',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DateRecoveryCodeSent = 'date_recovery_code_sent',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  IsAwsManaged = 'is_aws_managed',
  /** column name */
  LastAccessedAt = 'last_accessed_at',
  /** column name */
  RecoveryShareManagement = 'recovery_share_management'
}

/** select "wallet_user_aggregate_bool_exp_bool_and_arguments_columns" columns of table "wallet_user" */
export enum Wallet_User_Select_Column_Wallet_User_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAwsManaged = 'is_aws_managed'
}

/** select "wallet_user_aggregate_bool_exp_bool_or_arguments_columns" columns of table "wallet_user" */
export enum Wallet_User_Select_Column_Wallet_User_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAwsManaged = 'is_aws_managed'
}

/** input type for updating data in table "wallet_user" */
export type Wallet_User_Set_Input = {
  authed_user_id?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  date_recovery_code_sent?: InputMaybe<Scalars['timestamptz']['input']>;
  /** This field is deprecated, use authed_user.email instead */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_aws_managed?: InputMaybe<Scalars['Boolean']['input']>;
  last_accessed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  recovery_share_management?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "wallet_user" */
export type Wallet_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Wallet_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Wallet_User_Stream_Cursor_Value_Input = {
  authed_user_id?: InputMaybe<Scalars['String']['input']>;
  client_id?: InputMaybe<Scalars['uuid']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  date_recovery_code_sent?: InputMaybe<Scalars['timestamptz']['input']>;
  /** This field is deprecated, use authed_user.email instead */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_aws_managed?: InputMaybe<Scalars['Boolean']['input']>;
  last_accessed_at?: InputMaybe<Scalars['timestamptz']['input']>;
  recovery_share_management?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "wallet_user" */
export enum Wallet_User_Update_Column {
  /** column name */
  AuthedUserId = 'authed_user_id',
  /** column name */
  ClientId = 'client_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DateRecoveryCodeSent = 'date_recovery_code_sent',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  IsAwsManaged = 'is_aws_managed',
  /** column name */
  LastAccessedAt = 'last_accessed_at',
  /** column name */
  RecoveryShareManagement = 'recovery_share_management'
}

export type Wallet_User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Wallet_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Wallet_User_Bool_Exp;
};

/** columns and relationships of "webhook" */
export type Webhook = {
  __typename?: 'webhook';
  created_at: Scalars['timestamptz']['output'];
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  is_production: Scalars['Boolean']['output'];
  /** An object relationship */
  seller?: Maybe<Seller>;
  seller_id: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

/** aggregated selection of "webhook" */
export type Webhook_Aggregate = {
  __typename?: 'webhook_aggregate';
  aggregate?: Maybe<Webhook_Aggregate_Fields>;
  nodes: Array<Webhook>;
};

/** aggregate fields of "webhook" */
export type Webhook_Aggregate_Fields = {
  __typename?: 'webhook_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Webhook_Max_Fields>;
  min?: Maybe<Webhook_Min_Fields>;
};


/** aggregate fields of "webhook" */
export type Webhook_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Webhook_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "webhook". All fields are combined with a logical 'AND'. */
export type Webhook_Bool_Exp = {
  _and?: InputMaybe<Array<Webhook_Bool_Exp>>;
  _not?: InputMaybe<Webhook_Bool_Exp>;
  _or?: InputMaybe<Array<Webhook_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_production?: InputMaybe<Boolean_Comparison_Exp>;
  seller?: InputMaybe<Seller_Bool_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "webhook" */
export enum Webhook_Constraint {
  /** unique or primary key constraint on columns "id" */
  WebhookPkey = 'webhook_pkey'
}

/** columns and relationships of "webhook_event" */
export type Webhook_Event = {
  __typename?: 'webhook_event';
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  request_body: Scalars['String']['output'];
  response_body: Scalars['String']['output'];
  /** An object relationship */
  seller?: Maybe<Seller>;
  seller_id: Scalars['String']['output'];
  status: Scalars['numeric']['output'];
  type: Scalars['String']['output'];
  /** An object relationship */
  webhook?: Maybe<Webhook>;
  webhook_id: Scalars['uuid']['output'];
};

/** aggregated selection of "webhook_event" */
export type Webhook_Event_Aggregate = {
  __typename?: 'webhook_event_aggregate';
  aggregate?: Maybe<Webhook_Event_Aggregate_Fields>;
  nodes: Array<Webhook_Event>;
};

/** aggregate fields of "webhook_event" */
export type Webhook_Event_Aggregate_Fields = {
  __typename?: 'webhook_event_aggregate_fields';
  avg?: Maybe<Webhook_Event_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Webhook_Event_Max_Fields>;
  min?: Maybe<Webhook_Event_Min_Fields>;
  stddev?: Maybe<Webhook_Event_Stddev_Fields>;
  stddev_pop?: Maybe<Webhook_Event_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Webhook_Event_Stddev_Samp_Fields>;
  sum?: Maybe<Webhook_Event_Sum_Fields>;
  var_pop?: Maybe<Webhook_Event_Var_Pop_Fields>;
  var_samp?: Maybe<Webhook_Event_Var_Samp_Fields>;
  variance?: Maybe<Webhook_Event_Variance_Fields>;
};


/** aggregate fields of "webhook_event" */
export type Webhook_Event_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Webhook_Event_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Webhook_Event_Avg_Fields = {
  __typename?: 'webhook_event_avg_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "webhook_event". All fields are combined with a logical 'AND'. */
export type Webhook_Event_Bool_Exp = {
  _and?: InputMaybe<Array<Webhook_Event_Bool_Exp>>;
  _not?: InputMaybe<Webhook_Event_Bool_Exp>;
  _or?: InputMaybe<Array<Webhook_Event_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  request_body?: InputMaybe<String_Comparison_Exp>;
  response_body?: InputMaybe<String_Comparison_Exp>;
  seller?: InputMaybe<Seller_Bool_Exp>;
  seller_id?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Numeric_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  webhook?: InputMaybe<Webhook_Bool_Exp>;
  webhook_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "webhook_event" */
export enum Webhook_Event_Constraint {
  /** unique or primary key constraint on columns "id" */
  WebhookEventPkey = 'webhook_event_pkey'
}

/** input type for incrementing numeric columns in table "webhook_event" */
export type Webhook_Event_Inc_Input = {
  status?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "webhook_event" */
export type Webhook_Event_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  request_body?: InputMaybe<Scalars['String']['input']>;
  response_body?: InputMaybe<Scalars['String']['input']>;
  seller?: InputMaybe<Seller_Obj_Rel_Insert_Input>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['numeric']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  webhook?: InputMaybe<Webhook_Obj_Rel_Insert_Input>;
  webhook_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Webhook_Event_Max_Fields = {
  __typename?: 'webhook_event_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  request_body?: Maybe<Scalars['String']['output']>;
  response_body?: Maybe<Scalars['String']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['numeric']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  webhook_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Webhook_Event_Min_Fields = {
  __typename?: 'webhook_event_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  request_body?: Maybe<Scalars['String']['output']>;
  response_body?: Maybe<Scalars['String']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['numeric']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  webhook_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "webhook_event" */
export type Webhook_Event_Mutation_Response = {
  __typename?: 'webhook_event_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Webhook_Event>;
};

/** on_conflict condition type for table "webhook_event" */
export type Webhook_Event_On_Conflict = {
  constraint: Webhook_Event_Constraint;
  update_columns?: Array<Webhook_Event_Update_Column>;
  where?: InputMaybe<Webhook_Event_Bool_Exp>;
};

/** Ordering options when selecting data from "webhook_event". */
export type Webhook_Event_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  request_body?: InputMaybe<Order_By>;
  response_body?: InputMaybe<Order_By>;
  seller?: InputMaybe<Seller_Order_By>;
  seller_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  webhook?: InputMaybe<Webhook_Order_By>;
  webhook_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: webhook_event */
export type Webhook_Event_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "webhook_event" */
export enum Webhook_Event_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  RequestBody = 'request_body',
  /** column name */
  ResponseBody = 'response_body',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
  /** column name */
  WebhookId = 'webhook_id'
}

/** input type for updating data in table "webhook_event" */
export type Webhook_Event_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  request_body?: InputMaybe<Scalars['String']['input']>;
  response_body?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['numeric']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  webhook_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Webhook_Event_Stddev_Fields = {
  __typename?: 'webhook_event_stddev_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Webhook_Event_Stddev_Pop_Fields = {
  __typename?: 'webhook_event_stddev_pop_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Webhook_Event_Stddev_Samp_Fields = {
  __typename?: 'webhook_event_stddev_samp_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "webhook_event" */
export type Webhook_Event_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Webhook_Event_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Webhook_Event_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  request_body?: InputMaybe<Scalars['String']['input']>;
  response_body?: InputMaybe<Scalars['String']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['numeric']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  webhook_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Webhook_Event_Sum_Fields = {
  __typename?: 'webhook_event_sum_fields';
  status?: Maybe<Scalars['numeric']['output']>;
};

/** update columns of table "webhook_event" */
export enum Webhook_Event_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  RequestBody = 'request_body',
  /** column name */
  ResponseBody = 'response_body',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Status = 'status',
  /** column name */
  Type = 'type',
  /** column name */
  WebhookId = 'webhook_id'
}

export type Webhook_Event_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Webhook_Event_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Webhook_Event_Set_Input>;
  /** filter the rows which have to be updated */
  where: Webhook_Event_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Webhook_Event_Var_Pop_Fields = {
  __typename?: 'webhook_event_var_pop_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Webhook_Event_Var_Samp_Fields = {
  __typename?: 'webhook_event_var_samp_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Webhook_Event_Variance_Fields = {
  __typename?: 'webhook_event_variance_fields';
  status?: Maybe<Scalars['Float']['output']>;
};

/** input type for inserting data into table "webhook" */
export type Webhook_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_production?: InputMaybe<Scalars['Boolean']['input']>;
  seller?: InputMaybe<Seller_Obj_Rel_Insert_Input>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Webhook_Max_Fields = {
  __typename?: 'webhook_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Webhook_Min_Fields = {
  __typename?: 'webhook_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deleted_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  seller_id?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "webhook" */
export type Webhook_Mutation_Response = {
  __typename?: 'webhook_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Webhook>;
};

/** input type for inserting object relation for remote table "webhook" */
export type Webhook_Obj_Rel_Insert_Input = {
  data: Webhook_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Webhook_On_Conflict>;
};

/** on_conflict condition type for table "webhook" */
export type Webhook_On_Conflict = {
  constraint: Webhook_Constraint;
  update_columns?: Array<Webhook_Update_Column>;
  where?: InputMaybe<Webhook_Bool_Exp>;
};

/** Ordering options when selecting data from "webhook". */
export type Webhook_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_production?: InputMaybe<Order_By>;
  seller?: InputMaybe<Seller_Order_By>;
  seller_id?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: webhook */
export type Webhook_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "webhook" */
export enum Webhook_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsProduction = 'is_production',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Url = 'url'
}

/** input type for updating data in table "webhook" */
export type Webhook_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_production?: InputMaybe<Scalars['Boolean']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "webhook" */
export type Webhook_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Webhook_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Webhook_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_production?: InputMaybe<Scalars['Boolean']['input']>;
  seller_id?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "webhook" */
export enum Webhook_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsProduction = 'is_production',
  /** column name */
  SellerId = 'seller_id',
  /** column name */
  Url = 'url'
}

export type Webhook_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Webhook_Set_Input>;
  /** filter the rows which have to be updated */
  where: Webhook_Bool_Exp;
};
