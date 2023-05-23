const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    buyerAddress: {
      type: String,
      required: [true, "Please enter the buyer's address"],
    },
    items: [
      {
        productId: {
          type: Number,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: [true, "Please enter the product name"],
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
