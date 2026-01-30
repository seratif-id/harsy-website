import { Product, Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Boneka Crochet",
    slug: "boneka",
    image: "/images/cat-boneka.jpg",
    description: "Boneka rajut lucu dan aman untuk anak-anak."
  },
  {
    id: "2",
    name: "Tas Rajut",
    slug: "tas",
    image: "/images/cat-tas.jpg",
    description: "Tas handmade dengan desain unik dan modis."
  },
  {
    id: "3",
    name: "Aksesoris",
    slug: "aksesoris",
    image: "/images/cat-aksesoris.jpg",
    description: "Pemanis penampilan dengan sentuhan rajutan."
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Boneka Kelinci Soft",
    slug: "boneka-kelinci-soft",
    price: 85000,
    image: "/images/p-kelinci.jpg",
    category: "boneka",
    rating: 4.9,
    sold: 24,
    estimatedTime: "3-4 hari",
    description: "Boneka kelinci lembut dengan benang katun berkualitas."
  },
  {
    id: "p2",
    name: "Sling Bag Pastel",
    slug: "sling-bag-pastel",
    price: 125000,
    image: "/images/p-tas.jpg",
    category: "tas",
    rating: 4.8,
    sold: 15,
    estimatedTime: "5-7 hari",
    description: "Tas selempang dengan warna pastel yang manis."
  },
  {
    id: "p3",
    name: "Gantungan Kunci Bunga",
    slug: "gantungan-bunga",
    price: 15000,
    image: "/images/p-keychain.jpg",
    category: "aksesoris",
    rating: 5.0,
    sold: 52,
    estimatedTime: "1-2 hari",
    description: "Gantungan kunci rajut bentuk bunga matahari."
  }
];
