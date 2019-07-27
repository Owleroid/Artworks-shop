const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    email: {
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
    }
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      size: { type: String, required: false },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  orderStatus: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

orderSchema.methods.deleteOrderItem = function (itemIndex) {
  let updatedOrderItems = [...this.products];

  updatedOrderItems.splice(itemIndex, 1);
  this.products = updatedOrderItems;
  return this.save();
};

orderSchema.methods.editOrderItem = function (itemIndex, newQuantity) {
  const price = this.products[itemIndex].price;
  let updatedOrderItems = [...this.products];

  updatedOrderItems[itemIndex].quantity = newQuantity;
  updatedOrderItems[itemIndex].total = newQuantity * price;
  this.products = updatedOrderItems;
  return this.save();
};

orderSchema.methods.addOrderItem = function (productId, size, price, quantity, total) {
  let updatedOrderItems = [...this.products];
  let newItem;
  if (size) {
    newItem = {
      productId: productId,
      size: size,
      price: price,
      quantity: quantity,
      total: total
    };
  } else {
    newItem = {
      productId: productId,
      price: price,
      quantity: quantity,
      total: total
    };
  };

  updatedOrderItems.push(newItem);
  this.products = updatedOrderItems;
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
