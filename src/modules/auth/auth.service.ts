
import { pool } from "../../config/db";
import bycript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../../config";

const signupUser=async(payload: Record<string,unknown>)=>{
    const {name,email,password,phone,role}=payload;
    const hashedPassword= await bycript.hash(password as string,10);
    const result= await pool.query(`
        INSERT INTO users (name,email,password,phone,role)
        VALUES ($1,$2,$3,$4,$5) RETURNING *
    `,[name,email,hashedPassword,phone,role]);

    return result;
}

const loginUser=async(email:string,password:string  )=>{

    const user=await pool.query(`
        SELECT * FROM users WHERE email=$1
        `,[email]);

    if(user.rows.length===0){
        throw new Error('User not found');
    }

    const matchPassword= bycript.compare(password,user.rows[0].password as string);
    if(!matchPassword){
        throw new Error('Invalid password');
    }

    const jwtPayload={
        id:user.rows[0].id,
        name:user.rows[0].name,
        email:user.rows[0].email,
        role:user.rows[0].role
    }

    const token= jwt.sign(jwtPayload,config.secretKey as string,
        {
        expiresIn:'7h'
    });

    return {token,user:user.rows[0]};

}

export const authService={
    signupUser,
    loginUser
};