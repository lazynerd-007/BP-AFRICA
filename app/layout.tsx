import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BluPay Fintech Platform",
  description: "A fintech platform for merchants and admins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log to external service in production
            console.error("App Error:", error, errorInfo);
          }}
        >
          {children}
        </ErrorBoundary>
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          expand={false}
          visibleToasts={3}
          toastOptions={{
            duration: 5000,
            className: "rounded-md",
          }}
        />
      </body>
    </html>
  );
}
