const mongoose = require("mongoose");

const deliveryDataSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Please enter an address"],
    },
    customerName: {
      type: String,
      required: [true, "Please enter the customer's name"],
    },
    customerSurname: {
      type: String,
      required: [true, "Please enter the customer's Surname"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Please enter the delivery address"],
    },
    city: {
      type: String,
      required: [true, "Please enter the city"],
    },
    postalCode: {
      type: String,
      required: [true, "Please enter the postal code"],
    },
    country: {
      type: String,
      required: [true, "Please enter the country"],
    },
    email: {
      type: String,
      required: [true, "Please enter the email"],
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryData = mongoose.model("DeliveryData", deliveryDataSchema);

module.exports = DeliveryData;
