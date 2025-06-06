"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconHome, 
  IconCreditCard, 
  IconWallet,
  IconReceipt,
  IconDeviceMobile,
  IconUser,
  IconCode,
  IconUsers,
  IconLogout
} from "@tabler/icons-react";
import { showLogoutSuccess } from "@/components/success-toast";

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

export default function MerchantDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  const handleLogout = async () => {
    // Show logout success toast
    await showLogoutSuccess("merchant");
    
    // Clear user data and redirect
    setTimeout(() => {
      window.location.href = "/login/merchant";
    }, 500);
  };
  
  const sidebarItems = [
    {
      href: "/merchant/dashboard",
      icon: <IconHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/merchant/dashboard/transactions",
      icon: <IconReceipt className="w-5 h-5" />,
      label: "Transactions",
    },
    {
      href: "/merchant/dashboard/payments",
      icon: <IconCreditCard className="w-5 h-5" />,
      label: "Payments",
    },
    {
      href: "/merchant/dashboard/wallet",
      icon: <IconWallet className="w-5 h-5" />,
      label: "Wallet",
    },
    {
      href: "/merchant/dashboard/terminals",
      icon: <IconDeviceMobile className="w-5 h-5" />,
      label: "Terminals",
    },
    {
      href: "/merchant/dashboard/developer",
      icon: <IconCode className="w-5 h-5" />,
      label: "Developer",
    },
    {
      href: "/merchant/dashboard/users",
      icon: <IconUsers className="w-5 h-5" />,
      label: "Users",
    },
    {
      href: "/merchant/dashboard/profile",
      icon: <IconUser className="w-5 h-5" />,
      label: "Profile",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 flex flex-col h-screen fixed left-0 top-0">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-6 px-3 flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-primary"></div>
          <span className="text-xl font-bold">BluPay Merchant</span>
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto space-y-1 pr-2">
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
        
        {/* Logout Button - Fixed at bottom */}
        <div className="pt-4 border-t flex-shrink-0">
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

      {/* Main content - with left margin to account for fixed sidebar */}
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
} 