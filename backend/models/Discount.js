const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Discount code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

discountSchema.methods.isValid = function (orderAmount) {
  const now = new Date();

  if (!this.isActive)
    return { valid: false, message: "Discount code is not active" };
  if (now < this.startDate)
    return { valid: false, message: "Discount code is not yet valid" };
  if (now > this.endDate)
    return { valid: false, message: "Discount code has expired" };
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: "Discount code usage limit reached" };
  }
  if (orderAmount < this.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount is $${this.minOrderAmount}`,
    };
  }

  return { valid: true };
};

discountSchema.methods.calculateDiscount = function (orderAmount) {
  let discount = 0;

  if (this.type === "percentage") {
    discount = (orderAmount * this.value) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.value;
  }

  return Math.min(discount, orderAmount);
};

module.exports = mongoose.model("Discount", discountSchema);
