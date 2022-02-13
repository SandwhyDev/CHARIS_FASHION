import express from "express";
import ps from "../prisma/connection";

const payment_controller = express.Router()

// PAYMENT CREATE
payment_controller.post("/payment_create", async(req, res)=>{
    try {
        const data = await req.body
        const result = await ps.payment.create({
            data : {
                total : parseInt(data.total),
                status : data.status,
                method : data.method,
                order_id : parseInt(data.order_id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil buat payment"
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

//PAYMENT READ
payment_controller.get("/payment_read", async(req, res)=>{
    try {
        const result = await ps.payment.findMany()
        res.status(201).json({
            success : true,
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// PAYMENR UPDATE
payment_controller.put("/payment_update/:id", async(req, res)=>{
    try {
        const data = await req.body
        const findId = await ps.payment.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data payment tidak ditemukan"
            })
            return
        }

        const result = await ps.payment.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                // total : parseInt(data.total),
                status : data.status,
                method : data.method,
                // order_id : parseInt(data.order_id)
                
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil update order",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// PAYMENT DELETE
payment_controller.delete("/payment_delete/:id", async(req,res)=>{
    try {
        const findId = await ps.payment.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data payment tidak ditemukan"
            })
            return
        }
        const result = await ps.payment.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil delete payment",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

export default payment_controller