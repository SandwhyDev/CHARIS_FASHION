import express from "express";
import env from "dotenv";
env.config();
import moment from "moment";
import { jwtSign } from "../services/jwt";

const auth = express.Router();

const { API_ID, API_SECRET } = process.env;

// GET AUTH
auth.post("/get_auth", async (req, res) => {
  try {
    const { api_id, api_secret } = await req.body;

    if (api_id !== API_ID) {
      res.status(401).json({
        success: false,
        msg: "id salah",
      });
      return;
    }

    if (api_secret !== API_SECRET) {
      res.status(401).json({
        success: false,
        msg: "secret salah",
      });
      return;
    }

    const token = jwtSign({
      app_name: "charisfashion",
      req_date: moment().format("DD:MM:YYYY hh:mm:ss"),
    });

    // var cookieDate = new Date(moment().add(30, "m").toDate())

    // res.cookie("_user", jwt.sign({

    // }, process.env.API_SECRET),{
    //     httpOnly : true,
    //     expires : cookieDate
    // })

    res.status(200).json({
      success: true,
      msg: "auth success",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//CLEAR AUTH
auth.get("/clear_auth", async (req, res) => {
  try {
    res.clearCookie("_user");
    res.status(200).json({
      success: true,
      msg: "success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
export default auth;
