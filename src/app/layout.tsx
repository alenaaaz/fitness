import "~/styles/globals.css";
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react'; // Импортируем SessionProvider
import { auth } from '~/server/auth';
import Navbar from './_components/navbar';
import Footer from './_components/Footer';
import { TRPCReactProvider } from '~/trpc/react';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // Получаем сессию

  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        {/* Оборачиваем в SessionProvider и передаем session */}
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <Navbar session={session} />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster position="top-center" reverseOrder={false} />
            <Footer />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

