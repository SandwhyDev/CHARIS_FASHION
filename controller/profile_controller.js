import express from "express";
import ps from "../prisma/connection";

const profile_controller = express.Router()

// PROFILE CREATE 
profile_controller.post("/profile_create", async(req,res)=>{
    try {
        const data = await req.body
        const result = await ps.profile.create({
            data : {
                full_name : data.full_name,
                phone : data.phone,
                address : data.address,
                bio : data.bio,
                user_id : parseInt(data.user_id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil tambah profile"
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

// PROFILE READ 
profile_controller.get("/profile_read", async(req,res)=>{
    try {
        const result = await ps.profile.findMany()
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

// PROFILE UPDATE 
profile_controller.put("/profile_update/:id", async(req,res)=>{
    try {
        const data = await req.body
        const findId = await ps.profile.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data profile tidak ditemukan"
            })
            return
        }

        const result = await ps.profile.update({
            where : {
                id : parseInt(req.params.id)
            },
            data : {
                full_name : data.full_name,
                phone : data.phone,
                address : data.address,
                bio : data.bio,
                // user_id : parseInt(data.user_id)
                
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil update profile",
            query : result
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})


// PROFILE DELETE 
profile_controller.delete("/profile_delete/:id", async(req,res)=>{
    try {
        const findId = await ps.profile.findUnique({
            where : {
                id : parseInt(req.params.id)
            }
        })

        if(!findId){
            res.status(404).json({
                success : false,
                msg : "data profile tidak ditemukan"
            })
            return
        }
        const result = await ps.profile.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })

        res.status(201).json({
            success : true,
            msg : "berhasil delete profile",
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})


export default profile_controller