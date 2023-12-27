import Link from "next/link"
import { Icons } from "./Icons"
import { buttonVariants } from "./ui/Button"
import { getAuthSession } from "@/lib/auth"
import AccountNav from "./AccountNav"
import SearchBar from "./SearchBar"

const Navbar = async () => {

    const session = await getAuthSession();

    return (
      <div className="fixed top-0 inset-x-0 h-fit bg-[#0f0f0f] z-[10] py-4">
        <div className="container mx-w-7xl h-full mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex gap-2 items-center">
            <p className="hidden text-white text-base font-semibold md:block">
              .echoHub
            </p>
          </Link>

          <SearchBar />

          {session?.user ? (
            <AccountNav user={session.user} />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    );
}

export default Navbar