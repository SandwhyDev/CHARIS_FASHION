import express from "express";
import path from "path";
import ps from "../prisma/connection";
import avatar_user from "../services/avatar_user";
import { compare_password, hash_password } from "../services/hashing";
import jwt from "jsonwebtoken";
import env from "dotenv";
import moment from "moment";
import user_auth_check from "../services/user_auth_cek";
env.config();
import fs from "fs";
import { jwtSign } from "../services/jwt";

const user_controller = express.Router();

// USER CREATE
user_controller.post(
  "/users_create",
  // avatar_user.single("avatar"),
  async (req, res) => {
    try {
      const data = await req.body;
      // const file = await req.file;
      const findEmail = await ps.users.findUnique({
        where: {
          email: data.email,
        },
      });

      if (findEmail) {
        res.status(401).json({
          success: false,
          msg: "email sudah digunakan",
        });
        return;
      }

      const result = await ps.users.create({
        data: {
          email: data.email,
          password: hash_password(data.password),
          // avatar: {
          //   create: {
          //     filename: file.filename,
          //     mime_type: file.mimetype,
          //     image_path: path.join(
          //       __dirname,
          //       `../static/uploads/avatar_user/${file.filename}`
          //     ),
          //   },
          // },
        },
      });

      res.status(201).json({
        success: true,
        msg: "berhasil tambah user",
        query: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// USER LOGIN
user_controller.post("/users_login", async (req, res) => {
  try {
    const data = await req.body;
    const result = await ps.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!result) {
      res.status(404).json({
        success: false,
        msg: "email salah",
      });
      return;
    }

    const cek_password = await compare_password(data.password, result.password);

    if (!cek_password) {
      res.status(401).json({
        success: false,
        msg: "password salah",
      });
      return;
    }

    // var cookieDate = new Date(moment().add(30, "m").toDate());

    // res.cookie(
    //   "_user",
    //   jwt.sign(
    //     {
    //       email: result.email,
    //       id: result.id,
    //     },
    //     process.env.API_SECRET
    //   ),
    //   {
    //     expires: cookieDate,
    //     httpOnly: true,
    //   }
    // );

    res.status(200).json({
      success: true,
      msg: "berhasil login",
      token: jwtSign(
        {
          app_name: "charisfashion",
          user_id: result.id,
          user_email: result.email,
          req_date: moment().toLocaleString(),
        },
        process.env.API_SECRET
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// USER LOGOUT
user_controller.get("/users_logout", async (req, res) => {
  try {
    res.clearCookie("_user");
    res.status(201).json({
      success: true,
      msg: "berhasil logout",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// USER READ
user_controller.get("/users_read", async (req, res) => {
  try {
    const result = await ps.users.findMany({
      include: {
        avatar: {
          select: {
            filename: true,
            image_path: true,
            mime_type: true,
          },
        },
        profile: true,
        product_review: true,
      },
    });
    res.status(200).json({
      success: true,
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// USER UPDATE
user_controller.put("/users_update/:id", async (req, res) => {
  try {
    const data = await req.body;
    const { oldPassword } = await req.body;
    const findUser = await ps.users.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!findUser) {
      res.status(404).json({
        success: false,
        msg: "data user tidak ditemukan",
      });
      return;
    }

    // validate old password
    const isValidPassword = await compare_password(
      oldPassword,
      findUser.password
    );

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        msg: "password lama salah",
      });
      return;
    }

    const result = await ps.users.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        password: hash_password(data.password),
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil update user",
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    console.log(error);
  }
});

// USER DELETE
user_controller.delete(
  "/users_delete/:id",
  user_auth_check,
  async (req, res) => {
    try {
      const findUser = await ps.users.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!findUser) {
        res.status(404).json({
          success: false,
          msg: "data user tidak ditemukan",
        });
        return;
      }
      const result = await ps.users.delete({
        where: {
          id: parseInt(req.params.id),
        },
        include: {
          avatar: true,
        },
      });

      const delete_img = await fs.unlinkSync(
        path.join(
          __dirname,
          `../static/uploads/avatar_user/${findUser.email}.${
            result.avatar.mime_type.split("/")[1]
          }`
        )
      );

      res.status(201).json({
        success: true,
        msg: "berhasil delete user",
        query: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default user_controller;
