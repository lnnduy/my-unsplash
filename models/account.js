const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const accountSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 5,
      max: 20,
    },
    password: {
      type: String,
      required: true,
    },
    photos: [
      {
        type: Schema.ObjectId,
        ref: "Photo",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

accountSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const Account = model("Account", accountSchema);

module.exports = Account;
