import jwt,{ JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config";


const addNewBooking=async(payload:Record<string,unknown>)=>{
    const {customer_id,vehicle_id,rent_start_date,rent_end_date}=payload;
    
    const vehicleAvailability= await pool.query(`
        UPDATE vehicles SET availability_status = 'booked' WHERE id=$1
    `,[vehicle_id]);
    const vehicle= await pool.query(`
        SELECT vehicle_name,daily_rent_price FROM vehicles WHERE id=$1
    `,[vehicle_id]);
    const total_price= vehicle.rows[0].daily_rent_price *
    (new Date(rent_end_date as string).getTime() - new Date(rent_start_date as string).getTime())/(1000*3600*24);

    const status="active"

    const result= await pool.query(`
        INSERT INTO bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `,[customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status]);
    result.rows[0].vehicle=vehicle.rows[0];
    return result;
}

const getBooking=async(token:string)=>{
    const decoded=jwt.verify(token,config.secretKey as string) as JwtPayload;
    
    
    if(decoded.role==='admin'){
        const result= await pool.query(`
            SELECT * FROM bookings
        `);
        const vehicleDetails=result.rows.reduce(async(accP,booking)=>{
            const acc= await accP;
            const customer= await pool.query(`   
                SELECT name,email FROM users WHERE id=$1
            `,[booking.customer_id]);

            booking.customer=customer.rows[0];
            const vehicle= await pool.query(`   
                SELECT vehicle_name,registration_number FROM vehicles WHERE id=$1
            `,[booking.vehicle_id]);
            booking.vehicle=vehicle.rows[0];
            acc.push(booking);
            return acc;
        }, Promise.resolve([]));
        return vehicleDetails;
    } else {
        const result= await pool.query(`
            SELECT * FROM bookings WHERE customer_id=$1
        `,[decoded.userId]);
        const vehicleDetails=result.rows.reduce(async(accP,booking)=>{
            const acc= await accP;
            const vehicle= await pool.query(`   
                SELECT vehicle_name,registration_number,type FROM vehicles WHERE id=$1
            `,[booking.vehicle_id]);
            booking.vehicle=vehicle.rows[0];
            acc.push(booking);
            return acc;
        }, Promise.resolve([]));

        return vehicleDetails;
    }
}


export const bookingService={
    addNewBooking,
    getBooking
};
