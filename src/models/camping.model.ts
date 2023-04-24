import mongoose, { Schema } from "mongoose";
import { ICamping } from "../interfaces/camping.interface";

const campingSchema = new Schema({
  img: String,
  title: String,
  description: String,
  price: Number,
  user: {
     type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  }
}, 
{
  timestamps: true
}
);

const Camping = mongoose.model<ICamping>('Camping', campingSchema)
export default Camping