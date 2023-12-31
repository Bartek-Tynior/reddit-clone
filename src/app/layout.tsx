import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Montserrat } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'saidIt',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const montserrat = Montserrat({ subsets: ['latin'] })

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-[#0f0f0f] text-white antialiased light",
        montserrat.className
      )}
    >
      <body className="min-h-screen pt-12 bg-[#0f0f0f] antialiased">
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}

          <div className="container max-w-7xl mx-auto pt-12 h-full">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}