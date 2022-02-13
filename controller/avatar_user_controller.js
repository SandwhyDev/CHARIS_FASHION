import express from "express";
import path from "path";
import ps from "../prisma/connection";
import avatar_user from "../services/avatar_user";

const avatar_user_controller = express.Router();

// AVATAR CREATE
avatar_user_controller.post("/avatar_user_create", avatar_user.single("avatar"),async (req, res) => {
  try {
    const data = await req.body;
    const file = await req.file;
    const findId = await ps.users.findUnique({
      where: {
        id: parseInt(data.user_id),
      },
      include : {
        avatar : true
      }
    });

    if (!findId) {
      res.status(404).json({
        success: false,
        msg: "data user tidak ditemukan",
      });
      return;
    }


    const result = await ps.avatar.create({
      data: {
        filename: file.filename,
        mime_type: file.mimetype,
        image_path: path.join(
          __dirname,
          `../static/uploads/avatar_user/${file.filename}`,
        ),
        user_id : parseInt(data.user_id)
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil tambah avatar",
      query : result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// AVATAR READ 
avatar_user_controller.get("/avatar_user_read", async(req,res)=>{
  try {
    const result =await ps.avatar.findMany({
      select : {
        id : true,
        user_id : true,
        filename : true,
        mime_type : true,
        image_path : true
      }
    })

    res.status(201).json({
      success: true,
      query : result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
})

// AVATAR UPDATE 
avatar_user_controller.put("/avatar_user_update/:id", avatar_user.single("avatar"),async(req,res)=>{
  try {
    const data = await req.body
    const file = await req.file
    const findId = await ps.users.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include : {
        avatar : true
      }
    });

    if(!findId) {
      res.status(404).json({
        success: false,
        msg: "data user tidak ditemukan",
      });
      return;
    }


    const result = await ps.avatar.update({
      where : {
        user_id : parseInt(req.params.id)
      },
      data : {
        filename: file.filename,
        mime_type: file.mimetype,
        image_path: path.join(
          __dirname,
          `../static/uploads/avatar_user/${file.filename}`,
        ),
        // user_id : parseInt(data.user_id)
      }
    })

    res.status(201).json({
      success: true,
      msg: "berhasil update avatar",
      query : result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
})

// AVATAR DELETE 
avatar_user_controller.delete("/avatar_user_delete/:id", async(req,res)=>{
  try {
    const findId = await ps.users.findUnique({
      where: {
        id: parseInt(data.user_id),
      },
      include : {
        avatar : true
      }
    });

    if(!findId) {
      res.status(404).json({
        success: false,
        msg: "data tidak ditemukan",
      });
      return;
    }

    const result = await ps.avatar.delete({
      where : {
        id : parseInt(req.params.id)
      }
    })

    res.status(201).json({
      success: true,
      msg: "berhasil delete avatar",
      query : result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
})



export default avatar_user_controller;
