import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/icons";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <Logo className="h-8 w-8 text-primary" />
            MediPortal
          </Link>
        </div>
        <SignUpForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
