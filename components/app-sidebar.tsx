"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconCreditCard,
  IconUsers,
  IconHelp,
  IconInnerShadowTop,
  IconBuildingStore,
  IconTransfer,
  IconUserCircle,
  IconReportMoney,
  IconBuildingBank,
  IconDeviceMobile,
  IconFileAnalytics,
  IconServer,
  IconChartPie,
  IconBell,
  IconLoader2,
  IconClipboardCheck
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/lib/store"
import { useEffect, useState } from "react"

// Admin navigation data
const adminData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Merchants",
      url: "/dashboard/merchant",
      icon: IconBuildingStore,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconTransfer,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartPie,
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Partner Banks",
      url: "/dashboard/partner-bank",
      icon: IconBuildingBank,
    },
    {
      title: "Approvals",
      url: "/dashboard/approvals",
      icon: IconClipboardCheck,
    },
    {
      title: "OVA",
      url: "/dashboard/ova",
      icon: IconCreditCard,
    },
    {
      title: "Financial Reports",
      url: "/dashboard/financial-reports",
      icon: IconFileAnalytics,
    },
    {
      title: "Commissions",
      url: "/dashboard/commissions",
      icon: IconReportMoney,
    },
    {
      title: "Device Manager",
      url: "/dashboard/terminal-devices",
      icon: IconDeviceMobile,
    },
    {
      title: "System Logs",
      url: "/dashboard/system-logs",
      icon: IconDatabase,
    },
    {
      title: "System Status",
      url: "/dashboard/system-status",
      icon: IconServer,
    },
  ],
  navSecondary: [
    {
      title: "Account",
      url: "/dashboard/account",
      icon: IconUserCircle,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Help Center",
      url: "/dashboard/help-center",
      icon: IconHelp,
    },
  ],
}

// Merchant navigation data
const merchantData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconTransfer,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartPie,
    },
    {
      title: "Payments",
      url: "#",
      icon: IconCreditCard,
    },
    {
      title: "Customers",
      url: "#",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Account",
      url: "/dashboard/account",
      icon: IconUserCircle,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
    },
    {
      title: "Support",
      url: "#",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPathname, setCurrentPathname] = useState("");
  
  useEffect(() => {
    // Check if we're in an admin route to ensure correct sidebar is shown
    const pathname = window.location.pathname;
    setCurrentPathname(pathname);
    
    // Set a short timeout to ensure authentication state is fully loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Force admin data when in admin routes
  const isAdminRoute = currentPathname.includes('/admin/');
  
  // Determine which navigation data to use based on user role and route
  const data = (isAdminRoute || user?.role === "admin") ? adminData : merchantData;
  
  // User data
  const userData = {
    name: user?.name || user?.email?.split('@')[0] || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/user.jpg",
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">BluPay</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="flex items-center justify-center flex-col h-full">
          <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-2">Loading...</p>
        </SidebarContent>
      </Sidebar>
    );
  }
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">BluPay</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={userData} 
          onSignOut={() => logout()} 
        />
      </SidebarFooter>
    </Sidebar>
  )
}
