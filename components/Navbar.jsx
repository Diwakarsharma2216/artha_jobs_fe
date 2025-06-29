'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex space-x-4">
        <Link
          href="/"
          className={`hover:underline ${pathname === '/' ? 'font-bold' : ''}`}
        >
          Home
        </Link>
        <Link
          href="/import-history"
          className={`hover:underline ${pathname === '/import-history' ? 'font-bold' : ''}`}
        >
          Import History
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;