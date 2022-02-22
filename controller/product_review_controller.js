import express from "express";
import ps from "../prisma/connection";

const product_review_controller = express.Router();

// PRODUCT REVIEW CREATE
product_review_controller.post("/product_review_create", async (req, res) => {
  try {
    const data = await req.body;

    const result = await ps.productReview.create({
      data: {
        product_id: parseInt(data.product_id),
        user_id: parseInt(data.user_id),
        body: data.body,
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil tambah review",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PRODUCT REVIEW READ
product_review_controller.get("/product_review_read", async (req, res) => {
  try {
    const result = await ps.productReview.findMany();

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

// PRODUCT REVIEW UPDATE
product_review_controller.put(
  "/product_review_update/:id",
  async (req, res) => {
    try {
      const data = await req.body;
      const findId = await ps.productReview.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!findId) {
        res.status(404).json({
          success: false,
          msg: "data review tidak ditemukan",
        });
        return;
      }

      const result = await ps.productReview.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          // product_id : parseInt(data.product_id),
          // user_id : parseInt(data.user_id),
          body: data.body,
        },
      });

      res.status(201).json({
        success: true,
        msg: "berhasil update product review",
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

// PRODUCT REVIEW DELETE
product_review_controller.delete(
  "/product_review_delete/:id ",
  async (req, res) => {
    try {
      const findId = await ps.productReview.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!findId) {
        res.status(404).json({
          success: false,
          msg: "data review tidak ditemukan",
        });
        return;
      }

      const result = await ps.productReview.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      res.status(201).json({
        success: true,
        msg: "berhasil delete product review",
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

export default product_review_controller;
