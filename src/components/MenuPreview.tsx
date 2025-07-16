import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Flame } from "lucide-react";
import biryaniHero from "@/assets/biryani-hero.jpg";

const MenuPreview = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const menuItems = [
    {
      name: "Royal Chicken Biryani",
      description: "Aromatic basmati rice with tender chicken, saffron, and traditional spices",
      price: "₹299",
      rating: 4.8,
      image: biryaniHero,
      isSpicy: true,
      isPopular: true,
      category: "Biryani"
    },
    {
      name: "Paneer Butter Masala",
      description: "Creamy tomato-based curry with soft paneer cubes",
      price: "₹249",
      rating: 4.7,
      image: biryaniHero,
      isSpicy: false,
      isPopular: true,
      category: "Main Course"
    },
    {
      name: "Lamb Rogan Josh",
      description: "Slow-cooked lamb in aromatic spices and yogurt curry",
      price: "₹399",
      rating: 4.9,
      image: biryaniHero,
      isSpicy: true,
      isPopular: false,
      category: "Main Course"
    },
    {
      name: "Dal Makhani",
      description: "Rich and creamy black lentils simmered overnight",
      price: "₹179",
      rating: 4.6,
      image: biryaniHero,
      isSpicy: false,
      isPopular: true,
      category: "Main Course"
    },
    {
      name: "Chicken Tikka",
      description: "Grilled chicken marinated in yogurt and spices",
      price: "₹229",
      rating: 4.5,
      image: biryaniHero,
      isSpicy: true,
      isPopular: false,
      category: "Starters"
    },
    {
      name: "Garlic Naan",
      description: "Fresh baked bread topped with garlic and herbs",
      price: "₹99",
      rating: 4.4,
      image: biryaniHero,
      isSpicy: false,
      isPopular: true,
      category: "Breads"
    }
  ];

  const categories = [
    { name: "All", count: menuItems.length },
    { name: "Starters", count: menuItems.filter(item => item.category === "Starters").length },
    { name: "Main Course", count: menuItems.filter(item => item.category === "Main Course").length },
    { name: "Biryani", count: menuItems.filter(item => item.category === "Biryani").length },
    { name: "Breads", count: menuItems.filter(item => item.category === "Breads").length },
    { name: "Desserts", count: 6 }
  ];

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <section id="menu" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Signature Dishes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the authentic flavors of India with our carefully crafted menu
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "hero" : "elegant"}
              size="sm"
              className="group"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {filteredItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-golden transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.isPopular && (
                  <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                    Popular
                  </Badge>
                )}
                {item.isSpicy && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                    <Flame className="w-3 h-3" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-secondary fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {item.price}
                  </span>
                  <Badge variant="outline" className="text-muted-foreground">
                    Coming Soon
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Full Menu CTA */}
        <div className="text-center">
          <Button variant="hero" size="xl" className="group">
            View Full Menu
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;