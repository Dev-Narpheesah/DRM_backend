// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
      
//     },
//     phone: {
//       type: String, 
//       required: true,
//     },
//     disasterType: {
//       type: String,
//       required: true,
//       enum: ["Flood", "Earthquake", "Fire", "Hurricane", "Tornado", "Other"],
//     },
//     location: {
//       type: String,
//       required: true,
//     },
//     report: {
//       type: String,
//       required: true,
//     },
//     image: {
//       url: {
//         type: String,
//         required: false,  
//       },
//       public_id: {
//         type: String,
//         required: false, 
//       },
//     },
//     isAdmin: {
//   type: Boolean,
//   default: false,
// },
//     hasSubmittedReport: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
