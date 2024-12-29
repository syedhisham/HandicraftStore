import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  emailVerificationToken: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});
//middleware
authSchema.methods.isPasswordCorrect = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  console.log("bcrypt comparison result:", isMatch); // Log the result of the comparison
  return isMatch;
};



  authSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
export const Auth = mongoose.model("Auth", authSchema);
