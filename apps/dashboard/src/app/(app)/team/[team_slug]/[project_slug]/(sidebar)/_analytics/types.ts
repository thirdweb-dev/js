export type PageParams = {
  team_slug: string;
  project_slug: string;
};

export type PageSearchParams = {
  from: string | undefined | string[];
  to: string | undefined | string[];
  type: string | undefined | string[];
  interval: string | undefined | string[];
  appHighlights: string | undefined | string[];
  client_transactions: string | undefined | string[];
  totalSponsored: string | undefined | string[];
};
