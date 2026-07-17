export interface Budget {
  "Schema Version": string;
  "Last Modification Date": string;
  "Funding Sources": FundingSource[];
  Accounts: Account[];
  Allocations: Allocation[];
}

export type AllocationType =
  | "Fixed"
  | "Percentage"
  | "Subscription";

export type AllocationPeriod =
  | "Weekly"
  | "Biweekly"
  | "Monthly"
  | "Yearly"
  | "One-time"
  | "Constant";

export type PayTimingPeriod =
  | "Weekly"
  | "Biweekly"
  | "Monthly"
  | "Yearly"
  | "One-time";

export type FundingType =
  | "Salary"
  | "Hourly";

export interface Allocation {
  Name: string;
  Type: AllocationType;
  Period: AllocationPeriod;
  "Last Paid": string | null;
  Amount: number;
  Account: string;
}

export interface Account {
  Name: string;
  Balance: number;
  Transactions: Transaction[];
}

interface Transaction {
  Name: string | null;
  Amount: number;
  Date: string;
}

interface FundingSource {
  Name: string;
  "Funding Type": FundingType;
  Rate: number;
  "Pay Timing": PayTiming;
  "Hours Per Pay Period": number | null;
}

interface PayTiming {
  "Start Date": string | null;
  "First Pay Date"?: string;
  Period: PayTimingPeriod;
  "End Date"?: string | null;
}
