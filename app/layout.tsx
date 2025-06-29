// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Navbar from "../components/Navbar"

export const metadata: Metadata = {
  title: 'Artha Job Board',
  description: 'Job Import and Management Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
