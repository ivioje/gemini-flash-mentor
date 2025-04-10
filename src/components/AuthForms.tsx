
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignInForm() {
  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none mx-auto w-full",
              formButtonPrimary: "bg-primary text-white hover:bg-primary/90",
            }
          }}
        />
      </CardContent>
    </Card>
  );
}

export function SignUpForm() {
  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none mx-auto w-full",
              formButtonPrimary: "bg-primary text-white hover:bg-primary/90",
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
