import express from "express";
import ps from "../prisma/connection";

const sub_categories_controller = express.Router()

// SUB_CATEGORIES CREATE 
sub_categories_controller.post("/sub_categories_create", async(req, res)=>{
    try {
        const data = await req.body
        const result = await ps.sub_Categories.create({
            data : {
                name : data.name,
                category_id : parseInt(data.category_id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil tambah sub categories"
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
        
    }
})

// SUB_CATEGORIES READ 
sub_categories_controller.get("/sub_categories_read", async(req, res)=>{
    try {
        const result = await ps.sub_Categories.findMany()
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

// SUB_CATEGORIES_UPDATE
sub_categories_controller.put("/sub_categories_update/:id", async(req, res)=>{
    try {
        const data = await req.body
        const findId = await ps.sub_Categories.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(401).json({
                success : false,
                msg : "data sub categories tidak ditemukan"
            })
            return
        }

        const result = await ps.sub_Categories.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                name : data.name,
                
                
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil update sub categories",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// SUB_CATEGORIES DELETE 
sub_categories_controller.delete("/sub_categories_delete/:id", async(req,res)=>{
    try {
        const findId = await ps.sub_Categories.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(401).json({
                success : false,
                msg : "data sub categories tidak ditemukan"
            })
            return
        }

        const result = await ps.sub_Categories.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil delete sub categories",
            query : result
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})


export default sub_categories_controller