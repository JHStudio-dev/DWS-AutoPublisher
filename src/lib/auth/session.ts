import "server-only";
import { redirect } from "next/navigation";
import {
  getCurrentProfile,
  type CurrentProfile,
} from "@/services/profiles/current-profile";

export async function requireProfile(): Promise<CurrentProfile> {
  const current = await getCurrentProfile();

  if (!current) {
    redirect("/login");
  }

  return current;
}
