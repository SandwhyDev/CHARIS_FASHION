import express from "express";
import ps from "../prisma/connection";

const order_controller = express.Router()

// ORDER CREATE
order_controller.post("/order_create/:id", async(req, res)=>{
    try {
        const data = await req.body
  
        const result = await ps.order.create({
            data : {
                product_id : parseInt(req.params.id),
                qty : parseInt(data.qty),
                user_id : parseInt(data.user_id),
                orderStatus : data.orderStatus,
                shipping : data.shipping,
                address : data.address
            }
        })
        


        res.status(201).json({
            success : true,
            msg : "berhasil buat order"
        })
        
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message,
        })
        

    }
})


// CEK QTY
order_controller.get("/cekQtyProduct/:id", async(req,res)=>{
    try {
        const findQty = await ps.products.findMany({
            where : {
                id : parseInt(req.params.id)
            },
            select : {
                price : true
            }
        })

        res.status(201).json({
            success : true,
            // query : result,
            price : findQty
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message,
        })
    }
})

// ORDER READ 
order_controller.get("/order_read", async(req, res)=>{
    try {
        const result = await ps.order.findMany({
            include : {
                payment : true
            }
        })

        res.status(201).json({
            success : true,
            query : result,
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// ORDER UDPATE 
order_controller.put("/order_update/:id", async(req, res)=>{
    try {
        const data = await req.body
        const findId = await ps.order.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(401).json({
                success : false,
                msg : "data order tidak ditemukan"
            })
            return
        }

        const result = await ps.order.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                // product_id : parseInt(data.product_id),
                qty : parseInt(data.qty),
                // user_id : parseInt(data.user_id),
                orderStatus : data.orderStatus,
                shipping : data.shipping,
                address : data.address
                
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

// ORDER DELETE 
order_controller.delete("/order_delete/:id", async(req, res)=>{
    try {
        const findId = await ps.order.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(401).json({
                success : false,
                msg : "data order tidak ditemukan"
            })
            return
        }
        const result = await ps.order.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil delete order",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

export default order_controller