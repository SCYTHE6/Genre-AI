import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { AppLayoutClient } from './app-layout-client';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Audio Genre Transformer - Transform Your Music',
  description: 'Transform your audio into different music genres with AI-powered technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}