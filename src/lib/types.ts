export interface AccountInfo {
  email: string;
  posted_count: number;
  groups_used_count: number;
  status: string;
  anonymous_commented: number;
}

export interface DashboardState {
  version?: string;
  totalPostedLinks: number;
  totalGroups: number;
  activeAccounts: number;
  currentCycle: number;
  lastUpdated: string;
  postedLinks: string[];
  groupLinkMap: Record<string, string[]>;
  accounts: AccountInfo[];
}

export interface Product {
  id: string;
  name: string;
  price: number | null;
  sales: string;
  shop: string;
  commissionRate: string;
  commission: number | null;
  link: string;
  productLink: string;
  category: string;
  price_raw: string;
}

export interface Offer {
  name: string;
  commissionRate: string;
  link: string;
  period: string;
  type: string;
  source: string;
}

export interface GroupInfo {
  url: string;
  totalPosts: number;
  links: string[];
}
