import Link from "next/link"

const Navbar = async () => {

    return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
        <div className="container mx-w-7xl h-full mx-auto flex items-center justify-between gap-2">
            <Link href="/" className="flex gap-2 items-center">
                <p className="hidden text-zinc-700 text-sm font-medium md:block">Beardit</p>
            </Link>
        </div>
    </div>
    
    )
}

export default Navbar