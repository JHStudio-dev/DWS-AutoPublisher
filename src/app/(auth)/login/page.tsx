import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión · DWS PublishFlow",
};

export default function LoginPage() {
  return (
    <div className="dws-auth__panel">
      <h1 className="dws-auth__title text-lg font-semibold text-text">
        Iniciar sesión
      </h1>
      <p className="dws-auth__subtitle mt-1 text-sm text-text-muted">
        Accede a tu panel de gestión.
      </p>

      <div className="mt-6">
        <LoginForm />
      </div>

      <div className="dws-auth__links mt-4 flex items-center justify-between text-sm">
        <Link
          href="/forgot-password"
          className="text-text-muted transition-colors hover:text-text"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <Link
          href="/signup"
          className="text-text-muted transition-colors hover:text-text"
        >
          Solicitar acceso
        </Link>
      </div>
    </div>
  );
}
