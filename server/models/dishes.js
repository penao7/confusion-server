import mongoose from 'mongoose';
import loadType from 'mongoose-currency';
const Schema = mongoose.Schema;
const Currency = loadType.loadType(mongoose);

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: ''
  },
  price: {
    type: Currency,
    required: true,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Dishes = mongoose.model('Dish', dishSchema);

export default Dishes;