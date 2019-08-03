const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  fullName: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  isAdmin: {
    type: Boolean,
    required: false
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function (product) {
  const updatedCartItems = [...this.cart.items];

  updatedCartItems.push({
    productId: product._id
  });

  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;
  console.log(this.cart);
  return this.save();
};

// userSchema.methods.removeProductFromCart = function (productId) {
//   let updatedCartItems = [...this.cart.items];

//   updatedCartItems = this.cart.items.filter(item => {
//     return item._id.toString() !== productId.toString();
//   });
//   this.cart.items = updatedCartItems;
//   return this.save();
// };

// userSchema.methods.clearCart = function () {
//   this.cart = { items: [] };
//   return this.save();
// };

module.exports = mongoose.model('User', userSchema);