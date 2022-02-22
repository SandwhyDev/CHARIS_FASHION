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

      const findCategories = await ps.categories.findUnique({
        where: {
          id: parseInt(data.category_id),
        },
      });

      if (!findCategories) {
        res.status(401).json({
          success: false,
          msg: "category tidak ditemukan",
        });
        return;
      }

      const result = await ps.products.create({
        data: {
          name: data.name,
          price: parseInt(data.price),
          size: data.size,
          description: data.description,
          category_id: parseInt(data.category_id),
          // sub_category_id: parseInt(data.sub_category_id),
        },
      });

      const images_result = await file.forEach((e) => {
        ps.product_images
          .create({
            data: {
              filename: e.filename,
              mime_type: e.mimetype,
              image_path: `/static/uploads/product_images/${e.filename}`,
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
    const { page = 1, limit = 10 } = await req.query;
    const skip = (page - 1) * limit;

    const result = await ps.products.findMany({
      skip: parseInt(skip),
      orderBy: {
        id: "desc",
      },
      include: {
        order: true,
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

    const countBlog = await ps.products.count();

    res.status(200).json({
      success: true,
      current_page: parseInt(page),
      total_page: Math.ceil(countBlog / limit),
      total_data: parseInt(countBlog),
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
      res.status(404).json({
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
      res.status(404).json({
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

    const removeAllImages = await result.product_images.forEach((e) => {
      fs.unlinkSync(
        path.join(__dirname, `../static/uploads/product_images/${e.filename}`)
      );
    });

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
