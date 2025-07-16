import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import MenuPreview from "@/components/MenuPreview";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSection />
      <MenuPreview />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
