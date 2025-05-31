"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  IconHome, 
  IconTransfer,
  IconCreditCard, 
  IconReportMoney,
  IconUser,
  IconWallet,
  IconBuilding,
  IconDevices,
  IconLogout
} from "@tabler/icons-react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function SidebarItem({ href, icon, label, isActive }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-muted"
        }`}
      >
        <div className="w-5 h-5">{icon}</div>
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default function SubmerchantDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleLogout = () => {
    // In a real app, you would clear auth tokens, cookies, etc.
    // For now, just redirect to login page
    router.push("/login/submerchant");
  };
  
  const sidebarItems = [
    {
      href: "/submerchant/dashboard",
      icon: <IconHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/submerchant/dashboard/transactions",
      icon: <IconTransfer className="w-5 h-5" />,
      label: "Transactions",
    },
    {
      href: "/submerchant/dashboard/payments",
      icon: <IconCreditCard className="w-5 h-5" />,
      label: "Payments",
    },
    {
      href: "/submerchant/dashboard/wallet",
      icon: <IconWallet className="w-5 h-5" />,
      label: "Wallet",
    },
    {
      href: "/submerchant/dashboard/terminals",
      icon: <IconDevices className="w-5 h-5" />,
      label: "Terminals",
    },
    {
      href: "/submerchant/dashboard/reports",
      icon: <IconReportMoney className="w-5 h-5" />,
      label: "Reports",
    },
    {
      href: "/submerchant/dashboard/parent-merchant",
      icon: <IconBuilding className="w-5 h-5" />,
      label: "Parent Merchant",
    },
    {
      href: "/submerchant/dashboard/profile",
      icon: <IconUser className="w-5 h-5" />,
      label: "Profile",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-6 px-3">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="text-xl font-bold">BluPay SubMerchant</span>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t bg-card">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 rounded-md w-full transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <div className="w-5 h-5">
              <IconLogout className="w-5 h-5" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
} 