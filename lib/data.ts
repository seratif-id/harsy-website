import { Product, Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Boneka Rajut",
    slug: "boneka",
    image: "/sampleImage/catDoll.png",
    description: "Boneka rajut lucu dan aman untuk anak-anak."
  },
  {
    id: "2",
    name: "Tas Rajut",
    slug: "tas",
    image: "/sampleImage/catBag.png",
    description: "Tas handmade dengan desain unik dan modis."
  },
  {
    id: "3",
    name: "Aksesoris Rajut",
    slug: "aksesoris",
    image: "/sampleImage/catAcc.png",
    description: "Pemanis penampilan dengan sentuhan rajutan."
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Bag Charm BTS Jongkook",
    slug: "bag-charm-bts-jongkook",
    price: 285000,
    image: "/sampleImage/imgAcc1.png",
    category: "aksesoris",
    rating: 4.9,
    sold: 24,
    estimatedTime: "3-4 hari",
    description: "There are many ways to expressing your love to someone or something that you love. They may not phisically close but love knows no boundaries. You can admiring them through their picture, song, or something that you can bring along with you, yes bag charm."
  },
  {
    id: "p2",
    name: "Sling Bag Pastel",
    slug: "sling-bag-pastel",
    price: 325000,
    image: "/sampleImage/catBag.png",
    category: "tas",
    rating: 4.8,
    sold: 15,
    estimatedTime: "5-7 hari",
    description: "Tas selempang dengan warna pastel yang manis."
  },
  {
    id: "p3",
    name: "Adorable Deer",
    slug: "adorable-deer",
    price: 450000,
    image: "/sampleImage/imgDoll1.png",
    category: "boneka",
    rating: 5.0,
    sold: 52,
    estimatedTime: "1-2 hari",
    description: "A calming color palette: beige, broken white, and earthy brown, with the softness of cotton, meet in this adorable deer. He is ready to be a new friend or the perfect baby gift!"
  },
    {
    id: "p4",
    name: "Milky Brown Bunny",
    slug: "milky-brown-bunny",
    price: 15000,
    image: "/sampleImage/imgDoll2.png",
    category: "boneka",
    rating: 5.0,
    sold: 52,
    estimatedTime: "1-2 hari",
    description: "The warm milky brown bunny pairs perfectly with the cool mint overalls. This blend of beige and pastel mint colors complement each other beautifully, accentuating every intricate detail of the crochet work."
  }
];
