import { Product, Category, User, Review } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Boneka Rajut",
    slug: "boneka",
    image: "/sampleImage/catDoll.png",
    description: "Boneka rajut lucu dan aman untuk anak-anak.",
    colors: ["Coklat", "Krem", "Putih", "Abu-abu"]
  },
  {
    id: "2",
    name: "Tas Rajut",
    slug: "tas",
    image: "/sampleImage/catBag.png",
    description: "Tas handmade dengan desain unik dan modis.",
    colors: ["Navy", "Hitam", "Maroon", "Pastel"]
  },
  {
    id: "3",
    name: "Aksesoris Rajut",
    slug: "aksesoris",
    image: "/sampleImage/catAcc.png",
    description: "Pemanis penampilan dengan sentuhan rajutan.",
    colors: ["Gold", "Silver", "Pink", "Ungu"]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Bag Charm BTS Jongkook",
    slug: "bag-charm-bts-jongkook",
    price: 50000,
    originalPrice: 100000,
    image: [
      "/sampleImage/imgAcc1.png",
      "/sampleImage/imgAcc1.png",
      "/sampleImage/imgAcc1.png",
      "/sampleImage/imgAcc1.png",
      "/sampleImage/imgAcc1.png",
    ],
    category: "aksesoris",
    rating: 5.0,
    sold: 100,
    reviewCount: 50,
    estimatedTime: "3-4 hari",
    updatedAt: "2024-01-25T10:00:00Z",
    description: "There are many ways to expressing your love to someone or something that you love. They may not phisically close but love knows no boundaries. You can admiring them through their picture, song, or something that you can bring along with you, yes bag charm.",
    partitions: [
        { name: "Character", colors: ["Cooky", "Tata", "Chimmy", "Koya"] },
        { name: "Strap", colors: ["Black", "Purple", "Pink"] }
    ]
  },
  {
    id: "p2",
    name: "Sling Bag Pastel",
    slug: "sling-bag-pastel",
    price: 50000,
    originalPrice: 100000,
    image: [
      "/sampleImage/catBag.png",
      "/sampleImage/catBag.png",
      "/sampleImage/catBag.png",
      "/sampleImage/catBag.png",
      "/sampleImage/catBag.png",
    ],
    category: "tas",
    rating: 4.0,
    sold: 10,
    reviewCount: 15,
    estimatedTime: "5-7 hari",
    updatedAt: "2024-01-24T10:00:00Z",
    description: "Tas selempang dengan warna pastel yang manis.",
    partitions: [
        { name: "Main Body", colors: ["Pastel Pink", "Pastel Blue", "Lilac"] },
        { name: "Strap", colors: ["White", "Beige"] }
    ]
  },
  {
    id: "p3",
    name: "Adorable Deer",
    slug: "adorable-deer",
    price: 90000,
    originalPrice: 100000,
    image: [
      "/sampleImage/imgDoll1.png",
      "/sampleImage/imgDoll1.png",
      "/sampleImage/imgDoll1.png",
      "/sampleImage/imgDoll1.png",
      "/sampleImage/imgDoll1.png",
      
    ],
    category: "boneka",
    rating: 5.0,
    sold: 10,
    reviewCount: 30,
    estimatedTime: "1-2 hari",
    updatedAt: "2024-01-23T10:00:00Z",
    description: "A calming color palette: beige, broken white, and earthy brown, with the softness of cotton, meet in this adorable deer. He is ready to be a new friend or the perfect baby gift!",
    partitions: [
        { name: "Body", colors: ["Beige", "Brown"] },
        { name: "Scarf", colors: ["Red", "Green", "Yellow"] }
    ]
  },
    {
    id: "p4",
    name: "Milky Brown Bunny",
    slug: "milky-brown-bunny",
    price: 90000,
    originalPrice: 100000,
    image: [
      "/sampleImage/imgDoll2.png",
      "/sampleImage/imgDoll2.png",
      "/sampleImage/imgDoll2.png",
      "/sampleImage/imgDoll2.png",
      "/sampleImage/imgDoll2.png",
    ],
    category: "boneka",
    rating: 4.0,
    sold: 100,
    reviewCount: 20,
    estimatedTime: "1-2 hari",
    updatedAt: "2024-01-22T10:00:00Z",
    description: "The warm milky brown bunny pairs perfectly with the cool mint overalls. This blend of beige and pastel mint colors complement each other beautifully, accentuating every intricate detail of the crochet work.",
    partitions: [
        { name: "Body", colors: ["Milky Brown", "White"] },
        { name: "Overalls", colors: ["Mint", "Blue", "Pink"] }
    ]
  }

];

export const USERS: User[] = [
  {
    id: "u1",
    name: "Bunda Harsy",
    email: "bunda@gmail.com",
    role: "user",
    avatar: "/avatars/user-1.jpg",
    password: "password123"
  },
  {
    id: "u2",
    name: "Admin Harsy",
    email: "admin1@harsy.com",
    role: "admin",
    avatar: "/avatars/admin.jpg",
    password: "adminpassword1"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p1",
    userId: "u1",
    rating: 5,
    comment: "Bagus banget! Kualitas rajutannya rapi dan kokoh. Suka banget sama karakter Cooky-nya.",
    createdAt: "2024-02-01T10:00:00Z"
  },
  {
    id: "r2",
    productId: "p1",
    userId: "u2",
    rating: 4,
    comment: "Lucu, tapi pengirimannya agak lama. Overall oke.",
    createdAt: "2024-01-30T14:30:00Z"
  },
  {
    id: "r3",
    productId: "p3",
    userId: "u1",
    rating: 5,
    comment: "Boneka rusanya gemes banget! Bahannya lembut, cocok buat kado anak.",
    createdAt: "2024-01-25T09:15:00Z"
  },
  {
    id: "r4",
    productId: "p2",
    userId: "u1",
    rating: 5,
    comment: "Tasnya cantik, warnanya pastel soft banget. Muat banyak barang juga ternyata.",
    createdAt: "2024-01-20T11:20:00Z"
  },
  {
    id: "r5",
    productId: "p4",
    userId: "u2",
    rating: 3,
    comment: "Agak beda sama di foto warnanya, tapi tetep lucu sih.",
    createdAt: "2024-01-15T16:45:00Z"
  }
];
