import "server-only";
import { redirect } from "next/navigation";
import {
  getCurrentProfile,
  type CurrentProfile,
} from "@/services/profiles/current-profile";

// Guards used by protected server components. requireProfile redirects to the
// login page when there is no authenticated profile.
export async function requireProfile(): Promise<CurrentProfile> {
  const current = await getCurrentProfile();

  if (!current) {
    redirect("/login");
  }

  return current;
}
