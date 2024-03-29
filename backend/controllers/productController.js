const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your cloud name and API key/secret

const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: "umairdev",
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});
// api_key: "778786747673568",
//   api_secret: "iEH85A2-PmRSj2Cu9XNi7xWpiX4"
// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  //  Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill all required field");
  }

  // Handle image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce",
        resource_type: "image",
      });
    

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  } catch (error) {
    res.status(500);
    throw new Error("Image could not be uploaded");
  }
  }

  // Create new product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json({
    "Product Added Successfully": product
  });
});

// Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("createdAt");
  res.status(200).json(products);
});

// Get Single Product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesn't exist
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  // Match product to it's user
  if (product.user.toString() !== req.user.id) {
    res.status(400);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesn't exist
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }
  await product.remove();
  res.status(200).json({ message: "Product deleted." });
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  //   if product doesn't exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Match product to it's user
  if (product.user.toString() !== req.user.id) {
    // toString() return string as string and convert a string object into a string
    res.status(401);
    throw new Error("User not Authorized");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  //   update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    {_id: id},
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true, 
    }
  );
  res.status(200).json({"product updated": updatedProduct});
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
