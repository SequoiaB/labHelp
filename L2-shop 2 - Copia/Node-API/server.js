const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const Order = require("./models/orderModel");
const Delivery = require("./models/deliveryDataModel");
const cors = require("cors");
const uri = process.env.MONGO_URI;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));

//routes

app.get("/", (req, res) => {
  res.send("Hello NODE API");
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0, __v: 0 }); // Escludi _id e __v dai risultati della query
    const formattedProducts = products.map((product) => {
      return {
        id: product.id,
        title: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      };
    });
    res.status(200).json(formattedProducts);
    console.log(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id: id }); // usa findOne qui
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//add new product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
// update a product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `cannot find any product with ID ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save profile data
app.post("/api/save", async (req, res) => {
  try {
    const { username, telegramHandle, address } = req.body;

    // Verifica se esiste già un account con lo stesso indirizzo
    const existingUser = await User.findOne({ address: address });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Un account con questo indirizzo esiste già." });
      return;
    }

    const user = new User({
      username,
      telegramHandle,
      address,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Update user data
app.put("/api/update/:account", async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.account });
    if (user) {
      user.username = req.body.username || user.username;
      user.telegramHandle = req.body.telegramHandle || user.telegramHandle;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        telegramHandle: updatedUser.telegramHandle,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating the user" });
  }
});
// Check if user exists
app.get("/api/check/:account", async (req, res) => {
  try {
    const user = await User.findOne({
      address: req.params.account.toLocaleLowerCase().trim(),
    });
    if (user) {
      res.json({ user: true });
    } else {
      res.json({ user: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error checking the address" });
  }
});

// get account data
app.get("/api/getUser/:account", async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.account });
    if (user) {
      res.json({
        username: user.username,
        telegramHandle: user.telegramHandle,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
});
//create new order
app.post("/neworder", async (req, res) => {
  try {
    const { buyerAddress, items, total } = req.body;

    const order = new Order({
      buyerAddress,
      items,
      total,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
// get orders of a specific user
app.get("/getorders/:buyerAddress", async (req, res) => {
  try {
    const { buyerAddress } = req.params;
    const lowerCaseAddress = buyerAddress.toLowerCase();
    const orders = await Order.find({ buyerAddress: lowerCaseAddress });
    if (!orders) {
      return res.status(404).json({
        message: `Cannot find any orders with buyerAddress ${buyerAddress}`,
      });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// check if account has delivery info
app.get("/api/checkdelivery/:address", async (req, res) => {
  try {
    const DData = await Delivery.findOne({
      address: req.params.address.toLocaleLowerCase(),
    });
    if (DData) {
      res.json({ DData: true });
    } else {
      res.json({ DData: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Error checking delivery data:" });
  }
});

//save delivery info
app.post("/api/delivery/save", async (req, res) => {
  try {
    const {
      address,
      customerName,
      customerSurname,
      deliveryAddress,
      city,
      postalCode,
      country,
      email,
    } = req.body;

    const deliveryData = new Delivery({
      address,
      customerName,
      customerSurname,
      deliveryAddress,
      city,
      postalCode,
      country,
      email,
    });

    const savedDeliveryData = await deliveryData.save();
    res.status(201).json(savedDeliveryData);
  } catch (error) {
    console.error("Error saving delivery data:", error);
    res.status(500).json({ error: "Error saving delivery data" });
  }
});
// get delivery info from account
app.get("/api/delivery/:account", async (req, res) => {
  try {
    const { account } = req.params;
    const lowerCaseAddress = account.toLowerCase();
    const deliveryData = await Delivery.findOne({
      address: lowerCaseAddress,
    });

    if (deliveryData) {
      res.json(deliveryData);
    } else {
      res.status(404).json({ error: "Delivery data not found" });
    }
  } catch (error) {
    console.error("Error retrieving delivery data:", error);
    res.status(500).json({ error: "Error retrieving delivery data" });
  }
});
// update delivery info from account
app.put("/api/delivery/update/:address", async (req, res) => {
  const { address } = req.params;
  const {
    customerName,
    customerSurname,
    deliveryAddress,
    city,
    postalCode,
    country,
    email,
  } = req.body;

  try {
    // Cerca e aggiorna i dati di consegna
    const updatedDeliveryData = await Delivery.findOneAndUpdate(
      { address },
      {
        customerName,
        customerSurname,
        deliveryAddress,
        city,
        postalCode,
        country,
        email,
      },
      { new: true } // Questa opzione ritorna il documento dopo l'aggiornamento
    );

    if (!updatedDeliveryData) {
      return res
        .status(404)
        .json({ error: "No user delivery data found with this address" });
    }

    res.json(updatedDeliveryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Node API app is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
