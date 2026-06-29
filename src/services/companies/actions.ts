"use server";

import { revalidatePath } from "next/cache";
import { companySettingsSchema } from "@/lib/validation/company";
import { GENERIC_ERROR_MESSAGE, type FormState } from "@/lib/errors";
import { updateCompany } from "@/services/companies";

// Company actions

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function updateCompanyAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = companySettingsSchema.safeParse({
    name: field(formData, "name"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  try {
    await updateCompany(parsed.data);
  } catch {
    return { status: "error", message: "No se pudo guardar la configuración." };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Configuración actualizada." };
}
