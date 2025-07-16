import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Clock } from "lucide-react";
import heroThali from "@/assets/hero-thali.jpg";
import biryaniHero from "@/assets/biryani-hero.jpg";
import ReservationModal from "./ReservationModal";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-hero z-10" />
        <img
          src={heroThali}
          alt="Traditional Indian Thali"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-secondary fill-current" />
            <span className="text-sm font-medium text-primary-foreground">
              Authentic Indian Cuisine Since 1995
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
            A Taste of{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Tradition
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Experience the rich flavors of India with our authentic recipes
            passed down through generations
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button variant="golden" size="xl" className="group">
              View Our Menu
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <ReservationModal>
              <Button variant="elegant" size="xl">
                Reserve Table
              </Button>
            </ReservationModal>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                1000+
              </div>
              <div className="text-sm text-primary-foreground/80">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                4.8/5
              </div>
              <div className="text-sm text-primary-foreground/80">
                Customer Rating
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                25+
              </div>
              <div className="text-sm text-primary-foreground/80">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      
      {/* Floating spice animation */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-turmeric/30 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-terracotta/30 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-5 h-5 bg-secondary/30 rounded-full animate-pulse delay-2000" />
    </section>
  );
};

export default Hero;