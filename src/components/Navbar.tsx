import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Phone, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReservationModal from "./ReservationModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "Menu", href: "#menu" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Spice Heritage
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/login')}
                className="ml-4"
              >
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </div>
            <ReservationModal>
              <Button variant="hero" size="sm">
                Reserve Table
              </Button>
            </ReservationModal>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigate('/admin/login');
              setIsMenuOpen(false);
            }}
            className="mx-3 my-2 w-auto"
          >
            <User className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
          <div className="px-3 py-2 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </div>
            <ReservationModal>
              <Button variant="hero" size="sm" className="w-full">
                Reserve Table
              </Button>
            </ReservationModal>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;