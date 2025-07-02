import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[] | React.ReactNode;
}

const Layout = ({ children, title, subtitle, breadcrumbs }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header with Breadcrumbs and Title - White Background */}
        <div className="bg-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Breadcrumbs */}
            <div className="pb-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link
                  to="/"
                  className="flex items-center hover:text-gray-900 transition-colors"
                >
                  <Home size={16} />
                </Link>
                {breadcrumbs &&
                  (Array.isArray(breadcrumbs) ? (
                    breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={index}>
                        <ChevronRight size={14} className="text-gray-400" />
                        {crumb.href ? (
                          <Link
                            to={crumb.href}
                            className="hover:text-gray-900 transition-colors"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {crumb.label}
                          </span>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <ChevronRight size={14} className="text-gray-400" />
                      {breadcrumbs}
                    </>
                  ))}
              </nav>
            </div>

            {/* Title Section */}
            {title && (
              <div className="pb-4">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="w-full px-4 sm:px-6 lg:px-8 pb-6 max-w-7xl mx-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
