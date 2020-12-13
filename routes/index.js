const router = require("express").Router();
const passport = require("passport");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const multer = require("multer");
const path = require("path");

const Account = require("../models/account");

const storage = multer.diskStorage({});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image")) cb(null, false);
    cb(null, true);
  },
});

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("secret_token"),
    },
    async (token, done) => {
      try {
        const account = await Account.findById(token.uid);
        return done(null, account);
      } catch (error) {
        done(error);
      }
    }
  )
);

router.post("/signup", require("../functions/signup"));
router.post("/login", require("../functions/login"));
router.post(
  "/photos",
  [upload.single("image"), passport.authenticate("jwt", { session: false })],
  require("../functions/postPhoto")
);
router.get(
  "/photos",
  passport.authenticate("jwt", { session: false }),
  require("../functions/getPhotos")
);
router.delete(
  "/photos/:photoId",
  passport.authenticate("jwt", { session: false }),
  require("../functions/deletePhoto")
);

module.exports = router;
