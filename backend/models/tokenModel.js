const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
      userId: { // if we want to contact from one table to another we ref
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user", // this will link to user model
      },
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
});

const Token = mongoose.model("Token", tokenSchema)


module.exports = Token;