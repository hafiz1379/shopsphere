const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: "Electronics",
    brand: "SoundMax",
    stock: 50,
    featured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        publicId: "sample_headphones",
      },
    ],
  },
  {
    name: "Smart Watch Pro",
    description:
      "Advanced smartwatch with health monitoring, GPS tracking, and 7-day battery life.",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: "Electronics",
    brand: "TechFit",
    stock: 30,
    featured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        publicId: "sample_watch",
      },
    ],
  },
  {
    name: "Premium Leather Bag",
    description:
      "Handcrafted genuine leather bag for everyday use with multiple compartments.",
    price: 149.99,
    originalPrice: null,
    discount: 0,
    category: "Fashion",
    brand: "LeatherCraft",
    stock: 25,
    featured: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
        publicId: "sample_bag",
      },
    ],
  },
  {
    name: "Running Shoes Ultra",
    description:
      "Lightweight and comfortable running shoes with advanced cushioning technology.",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    category: "Sports",
    brand: "SpeedRunner",
    stock: 100,
    featured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        publicId: "sample_shoes",
      },
    ],
  },
  {
    name: "Minimalist Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature.",
    price: 45.99,
    originalPrice: null,
    discount: 0,
    category: "Home",
    brand: "LumiDesign",
    stock: 60,
    featured: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        publicId: "sample_lamp",
      },
    ],
  },
  {
    name: "Organic Coffee Beans",
    description:
      "Premium organic coffee beans from Colombia, medium roast with rich flavor.",
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    category: "Food",
    brand: "BeanOrigin",
    stock: 200,
    featured: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
        publicId: "sample_coffee",
      },
    ],
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Extra thick yoga mat with carrying strap and non-slip surface.",
    price: 39.99,
    originalPrice: null,
    discount: 0,
    category: "Sports",
    brand: "ZenFlex",
    stock: 80,
    featured: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
        publicId: "sample_yogamat",
      },
    ],
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated water bottle that keeps drinks cold for 24 hours and hot for 12 hours.",
    price: 29.99,
    originalPrice: 34.99,
    discount: 14,
    category: "Accessories",
    brand: "HydroKeep",
    stock: 150,
    featured: false,
    images: [
      {
        url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
        publicId: "sample_bottle",
      },
    ],
  },
];

module.exports = sampleProducts;
