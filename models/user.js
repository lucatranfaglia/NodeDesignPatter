import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.ObjectId, Double = mongoose.Schema.Types.Double

const UserSchema = new mongoose.Schema({
  _id:{
      type: ObjectId,
      require: true,
  },
  name: {
      type: String,
      required: true
  },
  lastname: {
      type: String,
      required: true
  }    
})

export const User = mongoose.model("user", UserSchema);

export default User;