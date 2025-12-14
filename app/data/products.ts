export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Fresh" | "Snacks" | "Drinks" | "Household" | "Personal Care";
  imageAlt?: string;
};

// Static catalog modeled after a compact convenience store selection.
export const products: Product[] = [
  {
    id: "apple-pack",
    name: "Crisp Apple Pack",
    price: 3.5,
    category: "Fresh",
    imageAlt: "Bag of fresh apples",
  },
  {
    id: "avocado",
    name: "Ripe Avocado",
    price: 1.99,
    category: "Fresh",
    imageAlt: "Single avocado",
  },
  {
    id: "salad-kit",
    name: "Garden Salad Kit",
    price: 5.25,
    category: "Fresh",
    imageAlt: "Prepared salad kit",
  },
  {
    id: "chips-sea-salt",
    name: "Sea Salt Chips",
    price: 2.49,
    category: "Snacks",
    imageAlt: "Bag of potato chips",
  },
  {
    id: "granola-bar",
    name: "Honey Granola Bar",
    price: 1.29,
    category: "Snacks",
    imageAlt: "Granola bar wrapper",
  },
  {
    id: "trail-mix",
    name: "Trail Mix Pouch",
    price: 3.99,
    category: "Snacks",
    imageAlt: "Trail mix bag",
  },
  {
    id: "sparkling-water",
    name: "Sparkling Citrus Water",
    price: 1.75,
    category: "Drinks",
    imageAlt: "Bottle of sparkling water",
  },
  {
    id: "cold-brew",
    name: "Cold Brew Coffee",
    price: 3.1,
    category: "Drinks",
    imageAlt: "Bottle of cold brew",
  },
  {
    id: "green-tea",
    name: "Iced Green Tea",
    price: 2.05,
    category: "Drinks",
    imageAlt: "Bottle of iced tea",
  },
  {
    id: "laundry-pods",
    name: "Laundry Pods (10 ct)",
    price: 6.5,
    category: "Household",
    imageAlt: "Laundry detergent pods",
  },
  {
    id: "paper-towels",
    name: "Paper Towel Roll",
    price: 2.99,
    category: "Household",
    imageAlt: "Roll of paper towels",
  },
  {
    id: "dish-soap",
    name: "Citrus Dish Soap",
    price: 3.4,
    category: "Household",
    imageAlt: "Bottle of dish soap",
  },
  {
    id: "hand-sanitizer",
    name: "Hand Sanitizer",
    price: 2.2,
    category: "Personal Care",
    imageAlt: "Hand sanitizer bottle",
  },
  {
    id: "toothpaste",
    name: "Mint Toothpaste",
    price: 3.15,
    category: "Personal Care",
    imageAlt: "Tube of toothpaste",
  },
  {
    id: "face-wipes",
    name: "Refreshing Face Wipes",
    price: 4.1,
    category: "Personal Care",
    imageAlt: "Pack of face wipes",
  },
];

export const categories = Array.from(
  new Set(products.map((product) => product.category)),
);
