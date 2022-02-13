import express from "express";
import ps from "../prisma/connection";

const categories_controller = express.Router()

// CATEGORIES CREATE
categories_controller.post("/categories_create", async(req,res)=>{
    try {
        const data = await req.body
        const result = await ps.categories.create({
            data : {
                name : data.name,
                description : data.description,
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil buat categories",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// CATEGORIES READ
categories_controller.get("/categories_read", async(req,res)=>{
    try {
        const result = await ps.categories.findMany({
            include : {
                sub_category : {
                    select : {
                        id : true,
                        name : true,
                    }
                }
            }
        })
        res.status(200).json({
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

// CATEGORIES UPDATE 
categories_controller.put("/categories_update/:id", async(req,res)=>{
    try {
        const data = await req.body
        const findId = await ps.categories.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data categories tidak ditemukan"
            })
            return
        }

        const result = await ps.categories.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                name : data.name,
                description : data.description,
                
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil update categories",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// CATEGORIES DELETE 
categories_controller.delete("/categories_delete/:id", async(req,res)=>{
    try {
        const findId = await ps.categories.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data categories tidak ditemukan"
            })
            return
        }
        const result = await ps.categories.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })

        res.status(201).json({
            success : false,
            msg : "berhasil delete categories"
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

export default categories_controller