import express from "express";
import ps from "../prisma/connection";

const order_controller = express.Router();

// ORDER CREATE
order_controller.post("/order_create", async (req, res) => {
  try {
    const data = await req.body;

    const findProduct = await ps.products.findUnique({
      where: {
        id: parseInt(data.product_id),
      },
      include: {
        discount: {
          select : {
            id : true,
            percentage : true
          }
        }
      }
    });

    // console.log(findProduct.discount.id);

    if (!findProduct) {
      res.status(404).json({
        success: false,
        msg: "product tidak ditemukan",
      });
      return;
    }

    // console.log(findDiscount.percentage);
  
    const qtyPrice = await data.qty * findProduct.price

    const priceAfterDiscount = await qtyPrice - (qtyPrice * findDiscount.percentage / 100)

    console.log(priceAfterDiscount);
    const result = await ps.order.create({
      data: {
        product_id: parseInt(data.product_id),
        qty: parseInt(data.qty),
        discount : parseInt(findDiscount.percentage),
        price : parseInt(qtyPrice),
        price_after_discount : parseInt(priceAfterDiscount),
        user_id: parseInt(data.user_id),
        orderStatus: data.orderStatus,
        shipping: data.shipping,
        address: data.address,

        //PAYMENT LANGSUNG DIBUAT
        payment: {
          create: {
            total: parseInt(priceAfterDiscount),
            status: false,
            method: data.method,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil buat order",
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ORDER READ
order_controller.get("/order_read", async (req, res) => {
  try {
    const result = await ps.order.findMany({
      orderBy : {
        id : "desc"
      },
      include: {
        payment: true,
      },
    });

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

// ORDER UDPATE
order_controller.put("/order_update/:id", async (req, res) => {
  try {
    const data = await req.body;
    const findId = await ps.order.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!findId) {
      res.status(404).json({
        success: false,
        msg: "data order tidak ditemukan",
      });
      return;
    }

    const result = await ps.order.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        // product_id : parseInt(data.product_id),
        // qty: parseInt(data.qty),
        // user_id : parseInt(data.user_id),
        orderStatus: data.orderStatus,
        shipping: data.shipping,
        address: data.address,
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil update order",
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ORDER DELETE
order_controller.delete("/order_delete/:id", async (req, res) => {
  try {
    const findId = await ps.order.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!findId) {
      res.status(404).json({
        success: false,
        msg: "data order tidak ditemukan",
      });
      return;
    }
    const result = await ps.order.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(201).json({
      success: true,
      msg: "berhasil delete order",
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default order_controller;
