const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },  
  email: {
    type: String,
    unique: true,    
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);    
      },
    },
  },
  password: {
  type: String,
  required: true,
  minlength: 6
},
  age: {
    type: Number,    
    min: 0,
    max: 120,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  skills: {
    type: [String],
    default: ["javascript"]
  },
  description: {
    type: String,
    maxlength: 500,
    default: ""
  },
  photoUrl:{
    type: String,
     validate: {
        validator: function (value) {
            return validator.isURL(value);    
        }
     }
  }
} , { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign(
        { _id: user._id },
        "secretKey",
        { expiresIn: "1d" }
    );
    return token;
};

userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid=await bcrypt.compare(passwordInput, passwordHash);
    return isPasswordValid;
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;