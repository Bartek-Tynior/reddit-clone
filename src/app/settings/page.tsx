import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FC } from "react";

export const metadata = {
  title: "Settings",
  description: "Settings account and website settings.",
};

const page = async () => {
  const session = await getAuthSession();

  if (!session) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
          <div className="grid items-start gap-8">
              <h1 className="font-bold text-3xl md:text-4xl">
                  Settings
              </h1>
          </div>
          
          <div className="grid gap-10">
              <UsernameForm />
          </div>
    </div>
  );
};

export default page;
