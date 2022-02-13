import express from "express";
import ps from "../prisma/connection";
import product_images from "../services/product_images";
import path from "path";
import fs from "fs";

const product_controller = express.Router();

// PRODUCT CREATE
product_controller.post(
  "/product_create",
  product_images.array("images", 10),
  async (req, res) => {
    try {
      const data = await req.body;
      const file = await req.files;
      const result = await ps.products.create({
        data: {
          name: data.name,
          price: parseInt(data.price),
          size: data.size,
          description: data.description,
          category_id: parseInt(data.category_id),
        },
      });

      //   const makeDir = await fs.mkdirSync(
      //     path.join(__dirname, `../static/uploads/product_images/${result.name}`)
      //   );

      const images_result = await file.forEach((e) => {
        ps.product_images
          .create({
            data: {
              filename: e.filename,
              mime_type: e.mimetype,
              image_path: path.join(
                __dirname,
                `../static/uploads/product_images/${e.filename}`
              ),
              product_id: result.id,
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
        msg: "berhasil buat product",
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

// PRODUCT READ
product_controller.get("/product_read", async (req, res) => {
  try {
    const result = await ps.products.findMany({
      include: {
        product_review: {
          select: {
            user_id: true,
            body: true,
          },
        },
        discount: {
          select: {
            id: true,
            expired: true,
            percentage: true,
          },
        },
        product_images: {
          select: {
            id: true,
            filename: true,
            mime_type: true,
            image_path: true,
          },
        },
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

// PRODUCT UPDATE
product_controller.put("/product_update/:id", async (req, res) => {
  try {
    const data = await req.body;
    const findId = await ps.products.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!findId) {
      res.status(401).json({
        success: false,
        msg: "data product tidak ditemukan",
      });
      return;
    }

    const result = await ps.products.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name: data.name,
        price: parseInt(data.price),
        size: data.size,
        description: data.description,
        // category_id : parseInt(data.category_id)
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil update product",
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PRODUCT DELETE
product_controller.delete("/product_delete/:id", async (req, res) => {
  try {
    // const file = await req.files;
    const findId = await ps.products.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!findId) {
      res.status(401).json({
        success: false,
        msg: "data product tidak ditemukan",
      });
      return;
    }
    const result = await ps.products.delete({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        product_images: {
          select: {
            filename: true,
          },
        },
      },
    });

    // DELETE FILES WITH FS UNCLEAR
    const delete_img = await fs.unlinkSync(
      path.join(
        __dirname,
        `../static/uploads/upload_images/${result.product_images.forEach(
          (e) => {
            ps.product_images
              .findMany({
                where: {
                  product_id: parseInt(req.params.id),
                },
                // select: {
                //   filename: e.filename,
                // },
              })
              .then((response) => {
                console.log(response);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        )}`
      )
    );

    res.status(201).json({
      success: true,
      msg: "berhasil delete product",
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default product_controller;
