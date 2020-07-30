import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true,
  }],
}, { timestamps: true },
);

const Favourites = mongoose.model('favourite', favouriteSchema);

export default Favourites;