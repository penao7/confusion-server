import mongoose from 'mongoose';
import loadType from 'mongoose-currency';
const Schema = mongoose.Schema;
const Currency = loadType.loadType(mongoose);

const promoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: '',
    required: true
  },
  price: {
    type: Currency,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    required: true
  }
});

const Promos = mongoose.model('promotions', promoSchema);

export default Promos;