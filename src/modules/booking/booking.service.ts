import jwt,{ JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config";


const addNewBooking=async(payload:Record<string,unknown>)=>{
    const {customer_id,vehicle_id,rent_start_date,rent_end_date}=payload;
    const daily_rent_price= await pool.query(`
        SELECT daily_rent_price FROM vehicles WHERE id=$1
    `,[vehicle_id]);


    const total_price= daily_rent_price.rows[0].daily_rent_price *
    (new Date(rent_end_date as string).getTime() - new Date(rent_start_date as string).getTime())/(1000*3600*24);

    const status="booked"

    const result= await pool.query(`
        INSERT INTO bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `,[customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status]);
    return result;
}

const getBooking=async(token:string)=>{
    const decoded=jwt.verify(token,config.secretKey as string) as JwtPayload;
    
    
    if(decoded.role==='admin'){
        const result= await pool.query(`
            SELECT * FROM bookings
        `);
        return result;
    } else {
        const result= await pool.query(`
            SELECT * FROM bookings WHERE customer_id=$1
        `,[decoded.userId]);
        return result;
    }
}


export const bookingService={
    addNewBooking,
    getBooking
};
