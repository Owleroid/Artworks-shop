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
        },
        size: { type: Number, required: false },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCartWithTypeSingle = function (product, quantity) {
  const cartProductIndex = this.cart.items.findIndex(elem => {
    return elem.productId.toString() === product._id.toString();
  });
  const price = product.price;
  const updatedCartItems = [...this.cart.items];
  let newQuantity;
  let newTotal;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + +quantity;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    newTotal = price * newQuantity;
    updatedCartItems[cartProductIndex].total = newTotal;
  } else {
    let total = price * quantity;
    updatedCartItems.push({
      productId: product._id,
      price: price,
      quantity: quantity,
      total: total
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.addToCartWithTypeMultiple = function (product, selected, quantity) {
  const cartProductIndex = this.cart.items.findIndex(elem => {
    return elem.productId.toString() === product._id.toString();
  });
  const cartProductSizeIndex = this.cart.items.findIndex(elem => {
    return elem.productId.toString() === product._id.toString() && elem.size === +selected;
  });
  const indexOfSize = product.sizes.findIndex(elem => {
    return elem === selected;
  });
  const price = product.prices[indexOfSize];
  const updatedCartItems = [...this.cart.items];
  let newQuantity;
  let newTotal;

  if (cartProductIndex >= 0) {
    if (cartProductSizeIndex >= 0) {
      newQuantity = this.cart.items[cartProductSizeIndex].quantity + +quantity;
      updatedCartItems[cartProductSizeIndex].quantity = newQuantity;
      newTotal = price * newQuantity;
      updatedCartItems[cartProductSizeIndex].total = newTotal;
    } else {
      let total = price * quantity;
      updatedCartItems.push({
        productId: product._id,
        size: selected,
        price: price,
        quantity: quantity,
        total: total
      });
    }
  } else {
    let total = price * quantity;
    updatedCartItems.push({
      productId: product._id,
      size: selected,
      price: price,
      quantity: quantity,
      total: total
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.changeProductQuantity = function (productId, newQuantity) {
  const productIndex = this.cart.items.findIndex(elem => {
    return elem._id.toString() === productId.toString();
  });
  let updatedCartItems = [...this.cart.items];

  updatedCartItems[productIndex].quantity = newQuantity;
  updatedCartItems[productIndex].total = newQuantity * updatedCartItems[productIndex].price;
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.removeProductFromCart = function (productId) {
  let updatedCartItems = [...this.cart.items];

  updatedCartItems = this.cart.items.filter(item => {
    return item._id.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);