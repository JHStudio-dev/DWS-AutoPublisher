import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Solicitar acceso · DWS PublishFlow",
};

export default function SignupPage() {
  return (
    <div className="dws-auth__panel">
      <h1 className="dws-auth__title text-lg font-semibold text-text">
        Solicitar acceso
      </h1>
      <p className="dws-auth__subtitle mt-1 text-sm text-text-muted">
        El acceso es por invitación. Un administrador vinculará tu cuenta a la
        empresa.
      </p>

      <div className="mt-6">
        <SignupForm />
      </div>

      <div className="dws-auth__links mt-4 text-sm">
        <Link
          href="/login"
          className="text-text-muted transition-colors hover:text-text"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
