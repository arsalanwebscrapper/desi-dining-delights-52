import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Users, Utensils } from "lucide-react";
import restaurantInterior from "@/assets/restaurant-interior.jpg";

const AboutSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every dish is prepared with passion and traditional techniques"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in authentic Indian cuisine"
    },
    {
      icon: Users,
      title: "Family Owned",
      description: "A family business serving the community for over 25 years"
    },
    {
      icon: Utensils,
      title: "Fresh Ingredients",
      description: "Only the finest spices and freshest ingredients are used"
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-warm">
              <img
                src={restaurantInterior}
                alt="Restaurant Interior"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-terracotta/20 rounded-full blur-xl" />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Story of{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Authentic Flavors
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to Spice Heritage, where every meal tells a story of tradition, 
                passion, and authentic Indian flavors. Since 1995, our family has been 
                dedicated to bringing you the true taste of India with recipes passed 
                down through generations.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-soft hover:shadow-golden transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Button */}
            <Button variant="hero" size="lg">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;