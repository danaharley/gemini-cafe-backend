import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import MongooseSequence from "mongoose-sequence";

const AutoIncrement = MongooseSequence(mongoose);

const UserSchema = new mongoose.Schema(
  {
    customerId: {
      type: Number,
    },
    fullname: {
      type: String,
      minlength: [3, "Fullname must be three or more characters"],
      maxlength: [
        50,
        "Fullname should be not exceed the max length than 50 characters",
      ],
      required: [true, "Fullname must be filled"],
    },
    email: {
      type: String,
      required: [true, "Email must be filled"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be six or more characters"],
      maxlength: [
        200,
        "Password exceed the maximum encrypted value length of 200 characters",
      ],
      required: [true, "Password must be filled"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.path("email").validate(
  async function (value) {
    try {
      const uniqeEmail = await this.model("User").count({ email: value });
      return !uniqeEmail;
    } catch (error) {
      throw error;
    }
  },
  (msg) => `This email (${msg.value}) is already registered`
);

UserSchema.path("email").validate(
  function (value) {
    const validateEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return validateEmail.test(value);
  },
  (msg) => `${msg.value} is not valid email. Please enter a valid email`
);

UserSchema.virtual("passwordConfirm")
  .get(function () {
    return this._passwordConfirm;
  })
  .set(function (value) {
    this._passwordConfirm = value;
  });

UserSchema.pre("validate", function (next) {
  if (this.password !== this.passwordConfirm) {
    this.invalidate("passwordConfirm", "Password do not match");
  }
  next();
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.plugin(AutoIncrement, { inc_field: "customerId" });

export default mongoose.model("User", UserSchema);
