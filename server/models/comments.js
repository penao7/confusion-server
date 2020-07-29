import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  dish : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Comments = mongoose.model('Comment', commentSchema);

export default Comments;