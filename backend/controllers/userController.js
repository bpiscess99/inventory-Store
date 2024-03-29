const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const {OAuth2Client} = require("google-auth-library")

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};


// Register User
const registerUser = asyncHandler( async(req, res) => {
    const {name, email, password} = req.body
    
    // Validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill all required fields")
    };

    // If password length is less than 6
    if(password.length < 6){
        res.status(400)
        throw new Error("Password must be up to 6 characters")
    };

    // Check If email is already exist
    const userExits = await User.findOne({email})
    if(userExits){
    res.status(400)
    throw new Error("User email already exist")   
   };    


   // Create a new user  
const user = await User.create({
    name,
    email,
    password,
}); 

// Generate a token   
const token = generateToken(user._id)

// Send HTTP-only cookie
res.cookie("token", token, {
    path: "/", // even if we will not set path it will be by default home page
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
});

    if(user){
const {_id, name, email, photo, phone, bio} = user   
    res.status(201).json({
    _id, name, email, photo, phone, bio, token,
});    
}else {
    res.status(400)
    throw new Error("Invalid user data")
};
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

// Validation Request
    if(!email || !password){
        res.status(400)
        throw new Error("Please add email and password")
    }
    
// Check if user is exist 
    const user = await User.findOne({email})
    if(!user){
        res.status(400)
    throw new Error("User not found please sign up");    
    }

// User exist , check if password is correct

    const passwordIsCorrect = await bcrypt.compare(password, user.password) // compare will decrypt the password and will match normal password then will return true

    // Generate a token   
const token = generateToken(user._id)

// Send HTTP-only cookie
res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
});

    if(user && passwordIsCorrect){
    const {_id, name, email, photo, phone, bio} = user   
    res.status(200).json({
        _id, name, email, photo, phone, bio, token, 
    });    
    }else{
    res.status(400)    
    throw new Error("Invalid email or password")
    }
}); 

// Logout User
const logout = asyncHandler (async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), 
        sameSite: "none",
        secure: true,
    }); 
    return res.status(200).json({ message: "Successfully logged Out"});
}); 

// Get User Data
const getUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)
    
    if(user){
        const {_id, name, email, photo, phone, bio} = user;   
            res.status(200).json({
            _id, name, email, photo, phone, bio,
        });    
        }else {
            res.status(400)
            throw new Error("User not found")
        };
});

// Get Login Status
const loginStatus = asyncHandler (async (req, res) => {
     
    const token = req.cookies.token;
    if(!token){
        return res.json(false)
    }
    
    // verify Token
    const verified = jwt.verify(token, process.env.jwt_SECRET)
    if(verified){
        return res.json(true)
    }
    return res.json(false)
});

// Update User
const updateUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id); 

    if(user){
    const {name, email, photo, phone, bio} = user;
    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save()
    res.status(200).json({
        _id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        photo: updatedUser.photo, 
        phone: updatedUser.phone, 
        bio: updatedUser.bio,

    });
} else {
    res.status(404);
    throw new Error("User not found");
}

});

// Change Password

const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); 
    const {oldPassword, password} = req.body
    if(!user){
        res.status(400); 
        throw new Error("User not found, Please signup");
    } 

    // Validate
    if(!oldPassword || !password){
    res.status(400); 
    throw new Error("Please add old and new password");
    }

    // check if old password matches password in DB  
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    // Save new Password
    if (user && passwordIsCorrect){
        user.password = password
        await user.save();
        res.status(200).send("Password changed successful");    
    } else{
        res.status(400);    
        throw new Error("Old password is incorrect");
    }

});

// Forgot Password
const forgotPassword = asyncHandler ( async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})

    if(!user){
        res.status(404)
        throw new Error("User does not exist")
    }


    // Delete token if it exists in DB
    let token = await Token.findOne({userId: user._id})
    if (token) {
        await token.deleteOne()
    }

    // Create Reset Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id
    console.log("reset token", resetToken);

//   Hash token before saving to DB
const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
console.log("hashed token",hashedToken)
     
    // Save token to DB
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) // thirty minutes 
    }).save()

    // Construct Reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${hashedToken}`;

    // Reset Email
    const message = `
       <h2>Hello ${user.name}<h2/>
       <p>Please use the url below to reset your password<p/>
       <p>This reset link is valid for only 30minutes.<p/>

       <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

       <p>Regards...</p>
       <p>Pinvent Team</p>
       `;
        
    //  Send Email
       const subject = "Password Reset Request";
       const send_to = user.email;
       const sent_from = process.env.EMAIL_USER 
       
       try {
         await sendEmail(subject, message, send_to, sent_from)
         res.status(200).json({success: true, message: "Reset Email Sent"})
       } catch (error) {
         res.status(500)
         throw new Error("Email not sent, please try again")
       }   
});

// Reset Password

const resetPassword = asyncHandler (async (req, res) => {
    const {password} = req.body;
    const {resetToken} = req.params;
    // console.log("reset token", resetToken)

//   Hash token, then compare to Token in
// const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
// console.log("Hashed Token", hashedToken)

// Find token in DB
const userToken = await Token.findOne({
    token: resetToken,
    expiresAt: {$gt: Date.now()}
})
console.log("hashedToken", userToken)
if(!userToken){
   res.status(500)
   throw new Error("Invalid or Expired Token")
}

// Find User
const user = await User.findOne({_id: userToken.userId})

// Now Reset Password
user.password = password 
await user.save()
res.status(200).json({
    message: "Password Reset Successful, Please Login"
})

});

// login with google 
const loginWithGoogle = asyncHandler(async (req, res) => {
    const {userToken} = req.body;

    const ticket = await client.verifyIdToken({
        idToken: userToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log('Token Audience:', payload);
    const {name, email, picture, sub} = payload;
    const password = Date.now() + sub;

    // Check if user exist 
    const user = await User.findOne({email})
    if(!user){
        // create new user
        const newUser = await User.create({
            name,
            email,
            password,
            photo: picture,
            isVerified: true
        })

        if(newUser){
        // Generate token
        const token = generateToken(user._id)
        // Send HTTP-only token
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 Day
            sameSite: "none",
            secure: true,
        });
        
        const {_id, name, email, photo, phone, bio} = newUser;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
        }
    }
    
    // if User Exist Login
    if(user){
        const token = generateToken(user._id);
        // Send Http-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true,
          });

          const {_id, name, email, photo, phone, bio} = user;
          res.status(200).json({
              _id,
              name,
              email,
              photo,
              phone,
              bio,
              token
          })

    }

});


module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    loginWithGoogle

};