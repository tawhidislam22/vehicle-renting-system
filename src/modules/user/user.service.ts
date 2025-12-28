import jwt,{ JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db"


const getAllUsers=async()=>{
    const result= await pool.query(`
        SELECT * FROM users
    `);
    const users=result.rows.map(user=>{
        delete user.password;
        return user;
    });
    return users;
}

const updateUser= async(id:string,token:string,payload: Record<string,unknown>)=>{
    const decoded=jwt.verify(token,config.secretKey as string) as JwtPayload;
    
    if(decoded.role === 'customer' && decoded.id != id){
        throw new Error('Unauthorized: Customers can only update their own profile');
    }
    
    const currentUser = await pool.query(`
        SELECT * FROM users WHERE id=$1
    `,[id]);
    
    if(currentUser.rows.length === 0){
        throw new Error('User not found');
    }
    
    const name = payload.name ?? currentUser.rows[0].name;
    const email = payload.email ?? currentUser.rows[0].email;
    const phone = payload.phone ?? currentUser.rows[0].phone;
    const role = payload.role ?? currentUser.rows[0].role;
    
    const result= await pool.query(`
        UPDATE users SET name=$1,email=$2,phone=$3,role=$4
        WHERE id=$5 RETURNING *
    `,[name,email,phone,role,id]);
    
    delete result.rows[0].password;
    return result;
}

const deleteUser= async(id:string)=>{
    const user = await pool.query(`
        SELECT * FROM users WHERE id=$1
    `,[id]);
    
    if(user.rows.length === 0){
        throw new Error('User not found');
    }
    
    const activeBookings = await pool.query(`
        SELECT * FROM bookings WHERE customer_id=$1 AND status='active'
    `,[id]);
    
    if(activeBookings.rows.length > 0){
        throw new Error('Cannot delete user with active bookings');
    }
    
    const result= await pool.query(`
        DELETE FROM users WHERE id=$1 RETURNING *
    `,[id]);
    return result;
}

export const userService={
    getAllUsers,
    updateUser,
    deleteUser
};