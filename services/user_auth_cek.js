import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const user_auth_check = async (req, res, next) => {
  try {
    const { _user } = await req.cookies;
    console.log(_user);

    if (!_user) {
      res.status(401).json({
        success: false,
        msg: "belum login...",
      });
      return;
    }

    const verifToken = await jwt.verify(_user, process.env.API_SECRET);

    if (!verifToken) {
      res.sta(401).json({
        success: false,
        msg: "token error",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "internal server error",
      error: error.message,
    });
  }
};

export default user_auth_check;
