const Account = require("../models/account");
const Photo = require("../models/photo");

const getPhotos = async (req, res) => {
  try {
    const account = await Account.findById(req.user._id).populate({
      path: "photos",
      model: Photo,
      options: { sort: { createdAt: "desc" } },
    });
    res.json({ success: true, data: account.photos });
  } catch (error) {
    console.log(error);
    res.json({ success: false, errorCode: "SERVER_ERROR" });
  }
};

module.exports = getPhotos;
