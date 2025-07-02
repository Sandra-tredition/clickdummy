import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type CommunicationPreferences = {
  orderUpdates?: boolean;
  newFeatures?: boolean;
  marketing?: boolean;
  newsletter?: boolean;
};

type UserData = {
  email: string;
  userType: "person" | "publisher";
  customerNumber: string;
  // Person fields
  firstName?: string;
  lastName?: string;
  // Publisher fields
  publisherName?: string;
  publisherFirstName?: string;
  publisherLastName?: string;
  publisherStreet?: string;
  publisherCity?: string;
  publisherPostalCode?: string;
  publisherCountry?: string;
  isVlbRegistered?: boolean;
  mvbNumber?: string;
  communicationPreferences?: CommunicationPreferences;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (
    email: string,
    password: string,
    userData: UserData,
  ) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: {} | null;
  }>;
  signInWithProvider: (provider: "github" | "facebook" | "google") => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  verifyPassword: (password: string) => Promise<{
    error: Error | null;
    isValid: boolean;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        console.log("Restoring user session from localStorage:", userData);

        const authUser = {
          id: userData.id,
          email: userData.email,
          user_metadata: userData.userData,
        } as User;

        const authSession = {
          user: authUser,
          access_token: "token-" + Date.now(),
          refresh_token: "refresh-token-" + Date.now(),
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: "bearer",
        } as Session;

        setSession(authSession);
        setUser(authUser);
      } catch (error) {
        console.error("Error restoring user session:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);

    // Ensure demo users exist in localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );

    const demoUsers = [
      {
        id: "demo-user-1",
        email: "demo@example.com",
        password: "demo123",
        userData: {
          email: "demo@example.com",
          userType: "person",
          customerNumber: "DEMO001",
          firstName: "Demo",
          lastName: "User",
          communicationPreferences: {
            orderUpdates: true,
            newFeatures: true,
            marketing: false,
            newsletter: true,
          },
        },
      },
      {
        id: "verlag-user-1",
        email: "verlag@example.com",
        password: "verlag123",
        userData: {
          email: "verlag@example.com",
          userType: "publisher",
          customerNumber: "VERL001",
          publisherName: "Demo Verlag GmbH",
          publisherFirstName: "Max",
          publisherLastName: "Mustermann",
          publisherStreet: "Musterstraße 123",
          publisherCity: "Berlin",
          publisherPostalCode: "10115",
          publisherCountry: "Deutschland",
          isVlbRegistered: true,
          mvbNumber: "12345",
          communicationPreferences: {
            orderUpdates: true,
            newFeatures: true,
            marketing: true,
            newsletter: true,
          },
        },
      },
      {
        id: "neuer-verlag-user-1",
        email: "neuer-verlag@example.com",
        password: "password123",
        userData: {
          email: "neuer-verlag@example.com",
          userType: "publisher",
          customerNumber: "NEUER001",
          publisherName: "Neuer Verlag GmbH",
          publisherFirstName: "Anna",
          publisherLastName: "Schmidt",
          publisherStreet: "Neue Straße 456",
          publisherCity: "München",
          publisherPostalCode: "80331",
          publisherCountry: "Deutschland",
          isVlbRegistered: false,
          mvbNumber: "",
          communicationPreferences: {
            orderUpdates: true,
            newFeatures: true,
            marketing: false,
            newsletter: true,
          },
        },
      },
      {
        id: "clean-user-1",
        email: "clean@example.com",
        password: "clean123",
        userData: {
          email: "clean@example.com",
          userType: "person",
          customerNumber: "CLEAN001",
          firstName: "Clean",
          lastName: "User",
          communicationPreferences: {
            orderUpdates: false,
            newFeatures: false,
            marketing: false,
            newsletter: false,
          },
        },
      },
    ];

    // Clear localStorage and force update demo users to ensure latest data
    localStorage.removeItem("registeredUsers");
    localStorage.setItem("registeredUsers", JSON.stringify(demoUsers));
    console.log("Demo users refreshed in localStorage");

    // Ensure demo projects exist for demo users
    const demoProjects = [
      {
        id: "1",
        title: "Mein erstes Buchprojekt",
        subtitle: "Eine spannende Geschichte",
        description:
          "Dies ist mein erstes Buchprojekt mit einer faszinierenden Geschichte.",
        cover_image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user-1",
      },
      {
        id: "2",
        title: "Zweites Buchprojekt",
        subtitle: "Fortsetzung der Geschichte",
        description:
          "Die Fortsetzung meiner ersten Geschichte mit neuen Abenteuern.",
        cover_image:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user-1",
      },
    ];
    localStorage.setItem("demoProjects", JSON.stringify(demoProjects));
    console.log("Demo projects created in localStorage");
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check localStorage for registered users
      const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );

      console.log("Attempting login for:", email);
      console.log(
        "Available users:",
        registeredUsers.map((u: any) => ({ email: u.email, id: u.id })),
      );

      const foundUser = registeredUsers.find(
        (u: any) => u.email === email && u.password === password,
      );

      if (foundUser) {
        console.log("User found:", foundUser);

        const authUser = {
          id: foundUser.id,
          email: foundUser.email,
          user_metadata: foundUser.userData,
        } as User;

        const authSession = {
          user: authUser,
          access_token: "token-" + Date.now(),
          refresh_token: "refresh-token-" + Date.now(),
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: "bearer",
        } as Session;

        setSession(authSession);
        setUser(authUser);

        // Store current user info for other components to access
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: foundUser.id,
            email: foundUser.email,
            userData: foundUser.userData,
          }),
        );

        return {
          error: null,
          data: authSession,
        };
      } else {
        console.log("User not found or password incorrect");
        // Return error for invalid credentials
        return {
          error: new Error("Ungültige Anmeldedaten"),
          data: null,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        error: new Error("Fehler beim Anmelden"),
        data: null,
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: UserData,
  ) => {
    try {
      // Check if user already exists
      const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );
      const existingUser = registeredUsers.find((u: any) => u.email === email);

      if (existingUser) {
        return {
          data: { user: null, session: null },
          error: new Error(
            "Benutzer mit dieser E-Mail-Adresse existiert bereits",
          ),
        };
      }

      // Create clean user data without mock values
      const userDataWithEmail = {
        ...userData,
        email: email,
        full_name:
          userData.userType === "person"
            ? `${userData.firstName} ${userData.lastName}`
            : userData.publisherName,
      };

      const userId = "user-" + Date.now();

      // Store user in localStorage
      const newUserRecord = {
        id: userId,
        email: email,
        password: password,
        userData: userDataWithEmail,
      };

      registeredUsers.push(newUserRecord);
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

      // Create user with provided data - no mock data
      const newUser = {
        id: userId,
        email: email,
        user_metadata: userDataWithEmail,
      } as User;

      const newSession = {
        user: newUser,
        access_token: "token-" + Date.now(),
        refresh_token: "refresh-token-" + Date.now(),
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: "bearer",
      } as Session;

      // Update state immediately
      setSession(newSession);
      setUser(newUser);

      // Store current user info for other components to access
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: userId,
          email: email,
          userData: userDataWithEmail,
        }),
      );

      return {
        data: { user: newUser, session: newSession },
        error: null,
      };
    } catch (error) {
      return {
        data: { user: null, session: null },
        error: error as Error,
      };
    }
  };

  const resetPassword = async (email: string) => {
    // Mock password reset - always successful
    return {
      data: {},
      error: null,
    };
  };

  const signInWithProvider = async (
    provider: "github" | "facebook" | "google",
  ) => {
    // Mock OAuth sign in - always successful
    const mockUser = {
      id: `${provider}-user`,
      email: `user@${provider}.com`,
      user_metadata: {
        provider: provider,
        first_name: "OAuth",
        last_name: "User",
      },
    } as User;

    const mockSession = {
      user: mockUser,
      access_token: "mock-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: "bearer",
    } as Session;

    setSession(mockSession);
    setUser(mockUser);

    return {
      data: { user: mockUser, session: mockSession },
      error: null,
    };
  };

  const verifyPassword = async (password: string) => {
    // Mock password verification - in a real app, this would verify against the stored password
    // For demo purposes, accept "password123" as the correct password
    if (password === "password123") {
      return {
        error: null,
        isValid: true,
      };
    } else {
      return {
        error: new Error("Ungültiges Passwort"),
        isValid: false,
      };
    }
  };

  const signOut = async () => {
    // Mock sign out
    setSession(null);
    setUser(null);
    // Clear current user info
    localStorage.removeItem("currentUser");
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    resetPassword,
    signInWithProvider,
    verifyPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Using named function expression for Fast Refresh compatibility
// Using named function declaration for Fast Refresh compatibility
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
