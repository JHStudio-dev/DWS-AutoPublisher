import "server-only";
import type { Vehicle } from "@/db/types/database";
import type { VehicleInput } from "@/lib/validation/vehicle";
import { getCompanyScope } from "./scope";

// Vehicle services

function toRow(input: VehicleInput) {
  return {
    title: input.title,
    brand: input.brand,
    model: input.model,
    year: input.year,
    price: input.price,
    mileage: input.mileage ?? null,
    transmission: input.transmission ?? null,
    fuel_type: input.fuel_type ?? null,
    color: input.color ?? null,
    description: input.description ?? null,
    status: input.status,
    visibility: input.visibility,
  };
}

export async function listVehicles(): Promise<Vehicle[]> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("company_id", companyId)
    .order("updated_at", { ascending: false })
    .returns<Vehicle[]>();

  if (error) throw error;
  return data ?? [];
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("company_id", companyId)
    .maybeSingle<Vehicle>();

  if (error) throw error;
  return data;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const { supabase, companyId, profileId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("vehicles")
    .insert({ ...toRow(input), company_id: companyId, created_by: profileId })
    .select("*")
    .single<Vehicle>();

  if (error) throw error;
  return data;
}

export async function updateVehicle(
  id: string,
  input: VehicleInput,
): Promise<Vehicle> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("vehicles")
    .update(toRow(input))
    .eq("id", id)
    .eq("company_id", companyId)
    .select("*")
    .maybeSingle<Vehicle>();

  if (error) throw error;
  if (!data) throw new Error("Vehicle not found.");
  return data;
}

export async function deleteVehicle(id: string): Promise<void> {
  const { supabase, companyId } = await getCompanyScope();
  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id)
    .eq("company_id", companyId);

  if (error) throw error;
}

export async function duplicateVehicle(id: string): Promise<Vehicle> {
  const { supabase, companyId, profileId } = await getCompanyScope();

  const { data: source, error: findError } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("company_id", companyId)
    .maybeSingle<Vehicle>();

  if (findError) throw findError;
  if (!source) throw new Error("Vehicle not found.");

  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      company_id: companyId,
      created_by: profileId,
      title: `${source.title} (copia)`,
      brand: source.brand,
      model: source.model,
      year: source.year,
      price: source.price,
      mileage: source.mileage,
      transmission: source.transmission,
      fuel_type: source.fuel_type,
      color: source.color,
      description: source.description,
      status: "draft",
      visibility: "internal_only",
    })
    .select("*")
    .single<Vehicle>();

  if (error) throw error;
  return data;
}
