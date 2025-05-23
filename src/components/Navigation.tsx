import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

import {
  BookOpen,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  User,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      authRequired: true,
    },
    { path: "/create", label: "Create", icon: Plus, authRequired: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.authRequired || isAuthenticated
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">GemMentor</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex ml-6 space-x-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/sign-in">
                    <Button variant="outline" size="sm">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile navigation button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex items-center mb-8 mt-2">
                  <BookOpen className="h-6 w-6 mr-2 text-primary" />
                  <span className="font-bold text-xl">GemMentor</span>
                </div>
                <nav className="flex flex-col gap-2">
                  {filteredNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link key={item.path} to={item.path} onClick={closeMenu}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}

                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={closeMenu}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start mt-2"
                        onClick={async () => {
                          await logout();
                          closeMenu();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/sign-in" onClick={closeMenu}>
                        <Button
                          variant="outline"
                          className="w-full justify-start mt-2"
                        >
                          Sign in
                        </Button>
                      </Link>
                      <Link to="/sign-up" onClick={closeMenu}>
                        <Button
                          variant="default"
                          className="w-full justify-start mt-2"
                        >
                          Sign up
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
