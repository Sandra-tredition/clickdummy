import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Settings,
  BarChart3,
  LogOut,
  HelpCircle,
  Home,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const path = location.pathname;
  const [showHelp, setShowHelp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        w-64 border-r bg-card p-4 flex flex-col h-full
        lg:relative lg:translate-x-0
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="mb-8">
          <img
            src="/tredition-logo.png"
            alt="tredition"
            className="h-10 mb-2"
          />
          <p className="text-sm text-muted-foreground">Self-Publishing App</p>
        </div>

        <nav className="flex-1 flex flex-col">
          <div className="space-y-1">
            {/* Main Navigation */}
            <Link
              to="/"
              className={`flex items-center gap-3 rounded-md p-2 ${path === "/" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/buchmanagement"
              className={`flex items-center gap-3 rounded-md p-2 ${path === "/buchmanagement" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen size={20} />
              <span>Buchmanagement</span>
            </Link>

            <Link
              to="/reports"
              className={`flex items-center gap-3 rounded-md p-2 ${path === "/reports" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 size={20} />
              <span>Berichte</span>
            </Link>
          </div>

          {/* Spacer to push bottom items down */}
          <div className="flex-1"></div>

          {/* Bottom Navigation */}
          <div className="space-y-1">
            <Separator className="mb-4" />

            <Link
              to="/help"
              className={`flex items-center gap-3 rounded-md p-2 ${path === "/help" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HelpCircle size={20} />
              <span>Hilfe</span>
            </Link>

            <Link
              to="/account"
              className={`flex items-center gap-3 rounded-md p-2 ${path === "/account" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings size={20} />
              <span>Benutzerkonto</span>
            </Link>

            <button
              className="flex items-center gap-3 rounded-md p-2 w-full text-left text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={async () => {
                try {
                  setIsMobileMenuOpen(false);
                  await signOut();
                  navigate("/login");
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
            >
              <LogOut size={20} />
              <span>Abmelden</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
