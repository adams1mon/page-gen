import { SiteHeader } from '@/components/header/SiteHeader';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NewComponentButton } from '@/components/header/NewComponentButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SiteHeader>
                    <NewComponentButton/>
                </SiteHeader>
                {children}
            </body>
        </html>
    );
}
