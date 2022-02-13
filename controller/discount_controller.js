import express from "express";
import moment from "moment";
import ps from "../prisma/connection";

const discount_controller = express.Router()


// DISCOUNT CREATE
discount_controller.post("/discount_create", async(req,res)=>{
    try {
        const data = await req.body

        var discountExpired = new Date(moment().add(1, "w").toDate())
        
        const result = await ps.discount.create({
            data : {
                product_id : parseInt(data.product_id),
                expired : data.expired  ,
                percentage : parseInt(data.percentage)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil buat discount"
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// DISCOUNT READ 
discount_controller.get("/discount_read", async(req,res)=>{
    try {
        const result = await ps.discount.findMany()
        res.status(201).json({
            success : false,
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// DISCOUNT UPDATE 
discount_controller.put("/discount_update/:id", async(req,res)=>{
    try {
        const data = await req.body
        const findId = await ps.discount.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data discount tidak ditemukan"
            })
            return
        }

        const result = await ps.discount.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                product_id : parseInt(data.product_id),
                expired : data.expired,
                percentage : parseInt(data.percentage)
                
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil update discount",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// DISCOUNT DELETE 
discount_controller.delete("/discount_delete/:id", async(req,res)=>{
    try {
        const findId = await ps.discount.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data discount tidak ditemukan"
            })
            return
        }
        const result = await ps.discount.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil delete discount",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})


export default discount_controller