// Database types
// Hand-maintained to match src/db/migrations. Generate from Supabase once the
// project database is provisioned; extend with more row types as features land.

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
