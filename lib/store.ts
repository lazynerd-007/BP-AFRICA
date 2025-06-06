"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "merchant" | "partner-bank" | "submerchant" | null;

interface User {
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  showLogoutModal: boolean;
  login: (email: string, password: string, userType: "admin" | "merchant" | "partner-bank" | "submerchant") => Promise<boolean>;
  logout: () => void;
  setShowLogoutModal: (show: boolean) => void;
  clearError: () => void;
  requestPasswordReset: (email: string, userType: "admin" | "merchant" | "partner-bank" | "submerchant") => Promise<void>;
}

// Mock API function for authentication
const mockAuthenticate = async (
  email: string, 
  password: string, 
  userType: "admin" | "merchant" | "partner-bank" | "submerchant"
): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Validate credentials (this is just a mock)
  if (password.length < 6) {
    throw new Error("Invalid credentials. Password must be at least 6 characters.");
  }
  
  // In a real app, this would validate against a backend
  if (userType === "admin" && !email.includes("admin")) {
    throw new Error("Invalid admin credentials");
  }
  
  if (userType === "partner-bank" && !email.includes("bank")) {
    throw new Error("Invalid partner bank credentials");
  }
  
  if (userType === "submerchant" && !email.includes("sub")) {
    throw new Error("Invalid submerchant credentials");
  }
  
  return {
    email,
    role: userType,
    name: email.split("@")[0]
  };
};

// Mock API function for password reset
const mockRequestPasswordReset = async (
  email: string,
  userType: "admin" | "merchant" | "partner-bank" | "submerchant"
): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would send a reset link via email
  // For this mock, we'll just check if the email exists
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
  
  // Additional validation based on user type
  if (userType === "admin" && !email.includes("admin")) {
    throw new Error("Email not found in admin records");
  }
  
  if (userType === "partner-bank" && !email.includes("bank")) {
    throw new Error("Email not found in partner bank records");
  }
  
  if (userType === "submerchant" && !email.includes("sub")) {
    throw new Error("Email not found in submerchant records");
  }
  
  // Success - in a real app this would trigger an email sending process
  return;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      showLogoutModal: false,
      
      login: async (email, password, userType) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await mockAuthenticate(email, password, userType);
          set({ user, isLoading: false });
          
          // Return success for modal handling
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
          return false;
        }
      },
      
      logout: () => {
        set({ showLogoutModal: true });
      },
      
      setShowLogoutModal: (show: boolean) => {
        if (!show) {
          // Actually logout when modal is closed
          const userRole = get().user?.role;
          set({ user: null, showLogoutModal: false });
          
          // Redirect to the appropriate login page based on the user's role
          if (userRole === "admin") {
            window.location.href = "/login/admin";
          } else if (userRole === "partner-bank") {
            window.location.href = "/login/partner-bank";
          } else if (userRole === "submerchant") {
            window.location.href = "/login/submerchant";
          } else {
            window.location.href = "/login/merchant";
          }
        } else {
          set({ showLogoutModal: show });
        }
      },
      
      clearError: () => set({ error: null }),
      
      requestPasswordReset: async (email, userType) => {
        set({ isLoading: true, error: null });
        
        try {
          await mockRequestPasswordReset(email, userType);
          set({ isLoading: false });
          // In a real app, we might set a success message or redirect
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to process reset request",
            isLoading: false
          });
        }
      }
    }),
    {
      name: "blupay-auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
); 