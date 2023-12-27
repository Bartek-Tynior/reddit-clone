import Link from "next/link"
import UserAuthForm from "./UserAuthForm"

const SignUp = () => {
  return (
    <div className="container mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <p className="hidden text-[#0f0f0f] text-base font-semibold md:block">
          .echoHub
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign Up To Our Platform
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a saidIt account and agreeing to our
          Terms of Service and Privacy Policy.
        </p>

        {/* sign in form */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          Already a user?{" "}
          <Link
            href="/sign-in"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp