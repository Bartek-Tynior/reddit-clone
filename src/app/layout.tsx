import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Montserrat } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toaster'

export const metadata = {
  title: 'saidIt',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const montserrat = Montserrat({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={cn(
      'bg-white text-slate-900 antialiased light',
      montserrat.className
    )}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        
        <Navbar/>

        <div className='container max-w-7xl mx-auto pt-12 h-full'>
        {children}
        </div>
        
        <Toaster />
        </body>
    </html>
  )
}