import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Restablecer contraseña · DWS PublishFlow",
};

export default function ForgotPasswordPage() {
  return (
    <div className="dws-auth__panel">
      <h1 className="dws-auth__title text-lg font-semibold text-text">
        Restablecer contraseña
      </h1>
      <p className="dws-auth__subtitle mt-1 text-sm text-text-muted">
        Te enviaremos instrucciones a tu correo electrónico.
      </p>

      <div className="mt-6">
        <ForgotPasswordForm />
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
