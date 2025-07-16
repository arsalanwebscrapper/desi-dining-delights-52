import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Heart
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];

  const quickLinks = [
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Reservations", href: "/reservations" }
  ];

  const services = [
    { name: "Dine In", href: "#" },
    { name: "Takeaway", href: "#" },
    { name: "Delivery", href: "#" },
    { name: "Catering", href: "#" },
    { name: "Private Events", href: "#" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Restaurant Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Spice Heritage</h3>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                Experience the authentic taste of India at Spice Heritage. We bring you 
                traditional recipes with modern presentation, creating memorable dining 
                experiences since 1995.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">+91 98765 43210</div>
                    <div className="text-sm text-primary-foreground/70">Call for reservations</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">info@spiceheritage.com</div>
                    <div className="text-sm text-primary-foreground/70">Email us anytime</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">123 Heritage Street, Mumbai</div>
                    <div className="text-sm text-primary-foreground/70">Maharashtra, India 400001</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/admin/login"
                    className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200"
                  >
                    Admin Login
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.name}>
                    <a
                      href={service.href}
                      className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Hours & Social */}
        <div className="py-8 border-t border-primary-foreground/20">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Hours */}
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-secondary" />
              <div>
                <div className="font-medium">Open Daily</div>
                <div className="text-sm text-primary-foreground/70">11:00 AM - 10:30 PM</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-primary-foreground/80">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-primary-foreground/10 hover:bg-secondary rounded-full flex items-center justify-center transition-colors duration-200 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-primary-foreground group-hover:text-secondary-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-primary-foreground/70">
              © 2024 Spice Heritage. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-sm text-primary-foreground/70">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for Indian food lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;