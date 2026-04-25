'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  show?: boolean;
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  user: { email?: string; name?: string };
  navItems: NavItem[];
  onLogout: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  subtitle,
  user,
  navItems,
  onLogout,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-orange-200 flex flex-col justify-between shadow-lg">
        <div>
          <div className="p-6 border-b border-orange-200">
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-gray-900">LogoDouman</h1>
            </Link>
            <p className="text-orange-600 font-medium">{subtitle}</p>
            <p className="text-sm text-gray-500 mt-1 truncate" title={user.email}>
              {user.email}
            </p>
          </div>

          <nav className="flex flex-col gap-2 p-4">
            {navItems
              .filter((item) => item.show !== false)
              .map((item) => {
                const Icon = item.icon;
                const path = pathname ?? '';
                const isActive = item.active ?? (item.href ? path === item.href || path.startsWith(item.href + '/') : false);
                const btnClass = `text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 w-full ${
                  isActive ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-orange-50'
                }`;
                const content = (
                  <>
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </>
                );
                if (item.href) {
                  return (
                    <Link key={item.id} href={item.href} className={btnClass}>
                      {content}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className={btnClass}
                  >
                    {content}
                  </button>
                );
              })}
          </nav>
        </div>

        <div className="p-4 border-t border-orange-200 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Retour au site
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
