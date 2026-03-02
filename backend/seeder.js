const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const Wishlist = require("./models/Wishlist");
const Discount = require("./models/Discount");
const sampleProducts = require("./data/sampleProducts");

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Product.deleteMany();
    await Discount.deleteMany();
    await User.deleteMany();

    const adminUser = await User.create({
      name: "Hafizullah Rasa",
      email: "admin@shopsphere.com",
      password: "admin123",
      role: "admin",
    });

    await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "john123",
      role: "user",
    });

    const productsWithUser = sampleProducts.map((p) => ({
      ...p,
      createdBy: adminUser._id,
    }));

    await Product.insertMany(productsWithUser);

    await Discount.create({
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minOrderAmount: 50,
      maxDiscount: 20,
      usageLimit: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    console.log("Data imported successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Product.deleteMany();
    await Discount.deleteMany();
    await User.deleteMany();

    console.log("Data destroyed successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
