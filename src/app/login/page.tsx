import AuthForm from "../../components/forms/AuthForm";
import { Suspense } from "react";

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
