import bcryptjs from "bcryptjs";

const salt = bcryptjs.genSaltSync(10)

export const hash_password = (pass)=>{
    return bcryptjs.hashSync(pass, salt)
}

export const compare_password = (pass, dbPass)=>{
    return bcryptjs.compareSync(pass, dbPass)
}