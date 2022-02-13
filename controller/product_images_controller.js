import express from "express";
import ps from "../prisma/connection";
import path from "path";
import fs from "fs";
import product_images from "../services/product_images";

const product_image_controller = express.Router();

// PRODUCT IMAGES CREATE
product_image_controller.post(
  "/product_images_create",
  product_images.array("images", 10),
  async (req, res) => {
    try {
      const data = await req.body;
      const file = await req.files;

      const image = await file.forEach((e) => {
        ps.product_images
          .create({
            data: {
              product_id: parseInt(data.product_id),
              filename: e.filename,
              mime_type: e.mimetype,
              image_path: path.join(
                __dirname,
                `../static/uploads/product_images/${e.filename}`
              ),
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      res.status(201).json({
        success: true,
        msg: "berhasil tambah gambar",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// PRODUCT IMAGES CREATE
product_image_controller.get("/product_images_read", async (req, res) => {
  try {
    const result = await ps.product_images.findMany();

    res.status(201).json({
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

// PRODUCT IMAGES DELETE MANY
product_image_controller.delete(
  "/product_images_delete_many/:id",
  async (req, res) => {
    try {
      // findId
      const findId = await ps.products.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
        include: {
          product_images: true,
        },
      });

      if (!findId) {
        res.status(404).json({
          success: false,
          msg: "data product tidak ada",
        });
        return;
      }

      const result = await ps.product_images.deleteMany({
        where: {
          product_id: parseInt(req.params.id),
        },
      });

      // const delete_img = await fs.unlinkSync(
      //   path.join(
      //     __dirname,
      //     `../static/uploads/upload_images/${findId.product_images.forEach(
      //       (e) => {
      //         ps.product_images
      //           .findMany({
      //             where: {
      //               product_id: parseInt(e.product_id),
      //             },
      //             select: {
      //               filename: e.filename,
      //               mime_type: e.mime_type,
      //             },
      //           })
      //           .then((response) => {
      //             console.log(response);
      //           })
      //           .catch((err) => {
      //             console.log(err);
      //           });
      //       }
      //     )}`
      //   )
      // );

      res.status(201).json({
        success: true,
        info: delete_img,
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
export default product_image_controller;
