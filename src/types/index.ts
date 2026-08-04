export type Tier = "bronze" | "silver" | "gold" | "platinum" | "Bronze" | "Silver" | "Gold" | "Platinum";

export type ToolCategory =
  | "All"
  | "Utilities"
  | "Calculators"
  | "Media & Files"
  | "Text & Content"
  | "Developer & Security"
  | "Productivity"
  | "Image"
  | "Security"
  | "Math"
  | "Finance"
  | "Documents"
  | "Search"
  | string;

export type Category = ToolCategory;

export interface ToolItem {
  id: string;
  title: string;
  icon: any;
  color?: string;
  tier?: Tier;
  requiredTier?: Tier;
  category: ToolCategory;
  description: string;
  badge?: string;
}

export interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  tier: Tier;
  tierExpiry?: string;
  savedTools: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

