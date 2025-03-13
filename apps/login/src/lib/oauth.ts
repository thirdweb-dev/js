import type { PermissionState } from "@/components/permission-card";

export type Oauth2AuthorizeParams = {
  client_id: string;
  redirect_uri: string;
  response_type: "code";
  scope?: string; // currently unused
  state: string;
  code_challenge: string;
  code_challenge_method: "S256" | "plain";
};

export type Oauth2CodePayload = {
  sub: string;
  scope: string;
  client_id: string;
  code_challenge: string;
  code_challenge_method: "S256" | "plain";
  redirect_uri: string;
  permissions: PermissionState;
};

export type Oauth2AuthTokenRequest = {
  grant_type: "authorization_code";
  code: string;
  code_verifier: string;
  redirect_uri: string;
  client_id: string;
};

export type Oauth2RefreshTokenRequest = {
  grant_type: "refresh_token";
  refresh_token: string;
  redirect_uri: string;
  client_id: string;
};

export type Oauth2AuthToken = {
  sub: string;
  scope: string;
  permissions: PermissionState;
  data?: Record<string, unknown>;
};

export type Oauth2RefreshToken = {
  originalData: Oauth2AuthToken;
};
