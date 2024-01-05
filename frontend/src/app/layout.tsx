import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ReduxProvider } from '@/redux/provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Auctionaire',
  description: 'Auction site that give you freedom 🦅🦅🦅🦅.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='h-full'>
      <body className={cn('relative h-full font-sans antialiased', inter.className)}>
        <ReduxProvider>
          <main className='relative flex flex-col min-h-full'>
            <Navbar />
            {children}
            <Separator />
            <Footer />
            <SpeedInsights />
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
