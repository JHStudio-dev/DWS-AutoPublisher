import type { Metadata } from "next";
import { signOutAction } from "@/services/auth/actions";

export const metadata: Metadata = {
  title: "Cuenta pendiente · DWS PublishFlow",
};

export default function AccountPendingPage() {
  return (
    <main className="dws-account-pending flex min-h-screen items-center justify-center bg-background p-6">
      <div className="dws-account-pending__card w-full max-w-md rounded-lg border border-border bg-surface p-8 text-center">
        <h1 className="dws-account-pending__title text-xl font-semibold text-text">
          Cuenta sin empresa asignada
        </h1>
        <p className="dws-account-pending__text mt-2 text-sm text-text-muted">
          Tu cuenta aún no está vinculada a una empresa. Contacta al
          administrador para obtener acceso.
        </p>
        <form
          action={signOutAction}
          className="dws-account-pending__actions mt-6"
        >
          <button
            type="submit"
            className="dws-account-pending__logout rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
