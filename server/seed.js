import mongoose from 'mongoose';
import connectDB from './configs/db.js';
import productModel from './models/productModel.js';
import 'dotenv/config';

const seedProducts = [
  // Vegetables
  {
    name: "Potato 500g",
    category: "Vegetables",
    price: 25,
    offerPrice: 20,
    image: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80"],
    description: ["Fresh and organic", "Rich in carbohydrates", "Ideal for curries and fries"],
    stock: 20,
    inStock: true,
    weight: "500g"
  },
  {
    name: "Tomato 1 kg",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&q=80"],
    description: ["Juicy and ripe", "Rich in Vitamin C", "Perfect for salads and sauces", "Farm fresh quality"],
    stock: 15,
    inStock: true,
    weight: "1 kg"
  },
  {
    name: "Carrot 500g",
    category: "Vegetables",
    price: 30,
    offerPrice: 28,
    image: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80"],
    description: ["Sweet and crunchy", "Good for eyesight", "Ideal for juices and salads"],
    stock: 12,
    inStock: true,
    weight: "500g"
  },
  {
    name: "Spinach 500g",
    category: "Vegetables",
    price: 18,
    offerPrice: 15,
    image: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80"],
    description: ["Rich in iron", "High in vitamins", "Perfect for soups and salads"],
    stock: 8,
    inStock: true,
    weight: "500g"
  },
  {
    name: "Onion 500g",
    category: "Vegetables",
    price: 22,
    offerPrice: 19,
    image: ["https://images.unsplash.com/photo-1508747702725-c24512161357?w=500&q=80"],
    description: ["Fresh and pungent", "Perfect for cooking", "A kitchen staple"],
    stock: 25,
    inStock: true,
    weight: "500g"
  },

  // Fruits
  {
    name: "Apple 1 kg",
    category: "Fruits",
    price: 120,
    offerPrice: 110,
    image: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80"],
    description: ["Crisp and juicy", "Rich in fiber", "Boosts immunity", "Organic and farm fresh"],
    stock: 10,
    inStock: true,
    weight: "1 kg"
  },
  {
    name: "Orange 1 kg",
    category: "Fruits",
    price: 80,
    offerPrice: 75,
    image: ["https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&q=80"],
    description: ["Juicy and sweet", "Rich in Vitamin C", "Perfect for juices and fruit salads"],
    stock: 14,
    inStock: true,
    weight: "1 kg"
  },
  {
    name: "Banana 1 kg",
    category: "Fruits",
    price: 50,
    offerPrice: 45,
    image: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80"],
    description: ["Sweet and ripe", "High in potassium", "Great for smoothies and snacking"],
    stock: 30,
    inStock: true,
    weight: "1 kg"
  },
  {
    name: "Mango 1 kg",
    category: "Fruits",
    price: 150,
    offerPrice: 140,
    image: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80"],
    description: ["Sweet and flavorful", "Perfect for smoothies and desserts", "Rich in Vitamin A"],
    stock: 5,
    inStock: true,
    weight: "1 kg"
  },
  {
    name: "Grapes 500g",
    category: "Fruits",
    price: 70,
    offerPrice: 65,
    image: ["https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80"],
    description: ["Fresh and juicy", "Rich in antioxidants", "Perfect for snacking"],
    stock: 15,
    inStock: true,
    weight: "500g"
  },

  // Dairy
  {
    name: "Amul Milk 1L",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80"],
    description: ["Pure and fresh", "Rich in calcium", "Ideal for tea, coffee, and desserts"],
    stock: 22,
    inStock: true,
    weight: "1L"
  },
  {
    name: "Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80"],
    description: ["Soft and fresh", "Rich in protein", "Ideal for curries and snacks"],
    stock: 18,
    inStock: true,
    weight: "200g"
  },
  {
    name: "Eggs 12 pcs",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=500&q=80"],
    description: ["Farm fresh", "Rich in protein", "Ideal for breakfast and baking"],
    stock: 15,
    inStock: true,
    weight: "12 pcs"
  },
  {
    name: "Cheese 200g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    image: ["https://images.unsplash.com/photo-1486299267070-8382e21b471a?w=500&q=80"],
    description: ["Creamy and delicious", "Perfect for pizzas and sandwiches", "Rich in calcium"],
    stock: 10,
    inStock: true,
    weight: "200g"
  },

  // Drinks
  {
    name: "Coca-Cola 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80"],
    description: ["Refreshing and fizzy", "Perfect for parties and gatherings", "Best served chilled"],
    stock: 25,
    inStock: true,
    weight: "1.5L"
  },
  {
    name: "Pepsi 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    image: ["https://images.unsplash.com/photo-1543257580-7269da773bf5?w=500&q=80"],
    description: ["Chilled and refreshing", "Perfect for celebrations", "Best served cold"],
    stock: 20,
    inStock: true,
    weight: "1.5L"
  },
  {
    name: "Sprite 1.5L",
    category: "Drinks",
    price: 79,
    offerPrice: 74,
    image: ["https://images.unsplash.com/photo-1625772291427-39f8509b7c80?w=500&q=80"],
    description: ["Refreshing citrus taste", "Perfect for hot days", "Best served chilled"],
    stock: 18,
    inStock: true,
    weight: "1.5L"
  },

  // Grains
  {
    name: "Basmati Rice 5kg",
    category: "Grains",
    price: 550,
    offerPrice: 520,
    image: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80"],
    description: ["Long grain and aromatic", "Perfect for biryani and pulao", "Premium quality"],
    stock: 12,
    inStock: true,
    weight: "5kg"
  },
  {
    name: "Wheat Flour 5kg",
    category: "Grains",
    price: 250,
    offerPrice: 230,
    image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80"],
    description: ["High-quality whole wheat", "Soft and fluffy rotis", "Rich in nutrients"],
    stock: 15,
    inStock: true,
    weight: "5kg"
  },
  {
    name: "Organic Quinoa 500g",
    category: "Grains",
    price: 450,
    offerPrice: 420,
    image: ["https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80"],
    description: ["High in protein and fiber", "Gluten-free", "Rich in vitamins and minerals"],
    stock: 8,
    inStock: true,
    weight: "500g"
  },

  // Bakery
  {
    name: "Brown Bread 400g",
    category: "Bakery",
    price: 40,
    offerPrice: 35,
    image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80"],
    description: ["Soft and healthy", "Made from whole wheat", "Ideal for breakfast and sandwiches"],
    stock: 10,
    inStock: true,
    weight: "400g"
  },
  {
    name: "Butter Croissant 100g",
    category: "Bakery",
    price: 50,
    offerPrice: 45,
    image: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80"],
    description: ["Flaky and buttery", "Freshly baked", "Perfect for breakfast or snacks"],
    stock: 6,
    inStock: true,
    weight: "100g"
  },

  // Instant
  {
    name: "Maggi Noodles 280g",
    category: "Instant",
    price: 55,
    offerPrice: 50,
    image: ["https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&q=80"],
    description: ["Instant and easy to cook", "Delicious taste", "Popular kitchen staple"],
    stock: 30,
    inStock: true,
    weight: "280g"
  },
  {
    name: "Tomato Soup Cup 70g",
    category: "Instant",
    price: 35,
    offerPrice: 30,
    image: ["https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&q=80"],
    description: ["Convenient for on-the-go", "Healthy and warm", "Tangy tomato flavor"],
    stock: 25,
    inStock: true,
    weight: "70g"
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("Connected to Database for seeding...");
    
    // Clear existing products
    await productModel.deleteMany({});
    console.log("Cleared existing products.");

    // Insert new products
    const inserted = await productModel.insertMany(seedProducts);
    console.log(`Successfully seeded ${inserted.length} products!`);

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
