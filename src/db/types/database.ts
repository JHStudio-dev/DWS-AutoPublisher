// Hand-maintained to match src/db/migrations until generated from Supabase.

export type UserRole = "owner" | "admin" | "staff";

export type VehicleStatus = "draft" | "ready" | "published" | "archived";

export type VehicleVisibility =
  | "internal_only"
  | "visible_in_catalog"
  | "archived";

export type GroupPlatform =
  | "facebook_group"
  | "facebook_page"
  | "instagram"
  | "marketplace"
  | "whatsapp"
  | "other";

export type PublicationStatus =
  | "draft"
  | "pending"
  | "processing"
  | "requires_review"
  | "completed"
  | "failed"
  | "cancelled";

export type PublicationTargetStatus =
  | "pending"
  | "requires_review"
  | "completed"
  | "failed"
  | "cancelled";

export type PublicationLogLevel = "info" | "warning" | "error" | "success";

export type PublicationStrategy =
  | "manual"
  | "facebook_group_assisted"
  | "facebook_page_api_future"
  | "facebook_group_rpa_internal_future"
  | "instagram_api_future"
  | "webhook_future";

export type PublicationJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type Company = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  accent_color: string | null;
  theme_key: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  auth_user_id: string;
  company_id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Vehicle = {
  id: string;
  company_id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  transmission: string | null;
  fuel_type: string | null;
  color: string | null;
  description: string | null;
  status: VehicleStatus;
  visibility: VehicleVisibility;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type VehicleImage = {
  id: string;
  vehicle_id: string;
  storage_path: string;
  public_url: string | null;
  sort_order: number;
  created_at: string;
};

export type PublicationGroup = {
  id: string;
  company_id: string;
  name: string;
  url: string;
  platform: GroupPlatform;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Publication = {
  id: string;
  company_id: string;
  vehicle_id: string;
  status: PublicationStatus;
  publication_text: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicationTarget = {
  id: string;
  publication_id: string;
  group_id: string;
  status: PublicationTargetStatus;
  target_url: string | null;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicationLog = {
  id: string;
  publication_id: string;
  target_id: string | null;
  level: PublicationLogLevel;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};
