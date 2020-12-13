const Account = require("../models/account");
const jwt = require("jsonwebtoken");

const signupValidator = require("../validators/signup");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existsAccount = await Account.findOne({ username });

    if (existsAccount !== null) {
      res.json({ success: false, errorCode: "USERNAME_ALREADY_TAKEN" });
      return;
    }

    const { success, data, errors } = await signupValidator({
      username,
      password,
    });

    if (!success) {
      res.json({ success: false, errorCode: "VALIDATE_FAILED", errors });
      return;
    }

    const account = new Account({ ...data });
    await account.save();
    const token = jwt.sign({ uid: account._id }, process.env.JWT_SECRET);

    res.json({ success: true, data: { uid: account._id, token } });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: error.message,
    });
  }
};

module.exports = signup;
