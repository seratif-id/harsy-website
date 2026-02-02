import { Hero } from "@/components/organisms/Landing/Hero";
import { CategoriesSection } from "@/components/organisms/Landing/CategoriesSection";
import { FeaturedProducts } from "@/components/organisms/Landing/FeaturedProducts";
import { NewProducts } from "@/components/organisms/Landing/NewProducts";
import { OwnerProfile } from "@/components/organisms/Landing/OwnerProfile";
import { AboutSection } from "@/components/organisms/Landing/AboutSection";
import { HowToOrder } from "@/components/organisms/Landing/HowToOrder";
import { ContactSection } from "@/components/organisms/Landing/ContactSection";
import { getProducts } from "@/lib/services/product-service";
import { getSiteContent } from "@/lib/services/site-content-service";

export default async function Home() {
  const { products } = await getProducts();
  const siteContent = await getSiteContent();

  return (
    <div className="flex flex-col">
      <Hero content={siteContent?.hero} />
      <div id="categories">
        <CategoriesSection />
      </div>
      <FeaturedProducts products={products} content={siteContent?.featured} />
      <NewProducts products={products} content={siteContent?.newProducts} />
      <div id="how-to-order">
        <HowToOrder steps={siteContent?.howToOrder?.steps} />
      </div>
      <div id="contact">
        <ContactSection content={siteContent?.contact} />
      </div>
    </div>
  );
}
