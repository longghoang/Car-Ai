const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete')

const BlogPost = new Schema(
{
  title: { type :String },
  text: { type :String },
  created_at: {
    type: Date,
    default: Date.now
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  deleted: {
    type: Boolean,
    default: null
  }
},
{
    collection: 'post',
},

);

BlogPost.plugin(mongooseDelete, {
   overrideMethods: 'all',
   deletedAt: true
 })

module.exports = mongoose.model('Post', BlogPost, 'post')