const Account = require("../models/account");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const account = await Account.findOne({ username });
    const isMatch = await account.comparePassword(password);

    if (account === null || !isMatch) {
      res.json({ success: false, errorCode: "LOGIN_FAILED" });
      return;
    }

    const token = jwt.sign({ uid: account._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ success: true, data: { token } });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: error.message,
    });
  }
};

module.exports = login;
