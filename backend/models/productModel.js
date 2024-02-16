const mongoose = require("mongoose")

const productSchema = mongoose.Schema(
    {
      
        user: {
        type: String,
        required: true,
        ref: "User",
      },

      name: {
        type: String,
        required: [true, "Please add name"],
        trim: true,
      },

      sku: {  // Stock Keeping Unit
        type: String,
        required: true,
        default: "SKU",
        trim: true,
      },

      category: {
        type: String,
        required: [true, "Please add a category"],
        trim: true,
      },

      quantity: {
        type: String,
        // type: Number,
        required: [true, "Please add a quantity"],
        trim: true
      },

      price: {
        type: String,
        // type: Number,
        required: true,
        trim: [true, "Please add a price"],
      },

      description: {
        type: String,
        required: true,
        trim: [true, "Please add a description"],
      },

      image: {
        type: Object,
        required: {},
      },

},

{
   timestamps: true,
}

);


const Product = mongoose.model("Product", productSchema);

module.exports = Product;