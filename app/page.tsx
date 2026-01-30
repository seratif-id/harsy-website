import { Hero } from "@/components/organisms/Landing/Hero";
import { CategoriesSection } from "@/components/organisms/Landing/CategoriesSection";
import { FeaturedProducts } from "@/components/organisms/Landing/FeaturedProducts";
import { NewProducts } from "@/components/organisms/Landing/NewProducts";
import { HowToOrder } from "@/components/organisms/Landing/HowToOrder";
import { ContactSection } from "@/components/organisms/Landing/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div id="categories">
        <CategoriesSection />
      </div>
      <FeaturedProducts />
      <NewProducts />
      <div id="how-to-order">
        <HowToOrder />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
}
