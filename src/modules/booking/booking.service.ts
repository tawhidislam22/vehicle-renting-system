import jwt,{ JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config";

const addNewBooking=async(token:string,payload:Record<string,unknown>)=>{
    const {customer_id,vehicle_id,rent_start_date,rent_end_date}=payload;
    const decoded=jwt.verify(token,config.secretKey as string) as JwtPayload;
    
    if(decoded.role==='customer' && decoded.id != customer_id){
        throw new Error('Unauthorized: Customers can only create bookings for themselves');
    }
    const vehicle= await pool.query(`
        SELECT vehicle_name,daily_rent_price,availability_status FROM vehicles WHERE id=$1
    `,[vehicle_id]);

    if(vehicle.rows[0].availability_status !== 'available'){
        throw new Error('Vehicle is not available for booking');
    }

    const vehicleAvailability= await pool.query(`
        UPDATE vehicles SET availability_status = 'booked' WHERE id=$1
    `,[vehicle_id]);
    
    
    const startDate = new Date(rent_start_date as string);
    const endDate = new Date(rent_end_date as string);
    const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const numberOfDays = daysDifference; 
    const total_price = vehicle.rows[0].daily_rent_price * numberOfDays;

    const status="active"

    const result= await pool.query(`
        INSERT INTO bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `,[customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status]);
    result.rows[0].rent_start_date = new Date(result.rows[0].rent_start_date).toISOString().split('T')[0];
    result.rows[0].rent_end_date = new Date(result.rows[0].rent_end_date).toISOString().split('T')[0];
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
            
            booking.rent_start_date = new Date(booking.rent_start_date).toISOString().split('T')[0];
            booking.rent_end_date = new Date(booking.rent_end_date).toISOString().split('T')[0];
            acc.push(booking);
            return acc;
        }, Promise.resolve([]));
        return vehicleDetails;
    } else {
        const result= await pool.query(`
            SELECT * FROM bookings WHERE customer_id=$1
        `,[decoded.id]);
        const vehicleDetails=result.rows.reduce(async(accP,booking)=>{
            const acc= await accP;
            const vehicle= await pool.query(`   
                SELECT vehicle_name,registration_number,type FROM vehicles WHERE id=$1
            `,[booking.vehicle_id]);
            booking.vehicle=vehicle.rows[0];
            
            booking.rent_start_date = new Date(booking.rent_start_date).toISOString().split('T')[0];
            booking.rent_end_date = new Date(booking.rent_end_date).toISOString().split('T')[0];
            acc.push(booking);
            return acc;
        }, Promise.resolve([]));

        return vehicleDetails;
    }
}


const updateBooking=async(id:string,status:string,token:string)=>{
    const decoded=jwt.verify(token,config.secretKey as string) as JwtPayload;
    const booking= await pool.query(`
        SELECT * FROM bookings WHERE id=$1
    `,[id]);

    

    if(decoded.role==='customer' && booking.rows[0].rent_start_date <= new Date() && status==='cancelled'){  
        if(decoded.id != booking.rows[0].customer_id){
            throw new Error('Unauthorized: Customers can only update their own bookings');
        }
        await pool.query(`
            UPDATE vehicles SET availability_status = 'available' WHERE id=$1
        `,[booking.rows[0].vehicle_id]);
        
        const result= await pool.query(`
            UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
        `,[status,id]);
        
        // Format dates
        result.rows[0].rent_start_date = new Date(result.rows[0].rent_start_date).toISOString().split('T')[0];
        result.rows[0].rent_end_date = new Date(result.rows[0].rent_end_date).toISOString().split('T')[0];
        
        return {message:'Booking cancelled successfully',data:result.rows[0]};
    }
     else{
        await pool.query(`
            UPDATE vehicles SET availability_status = 'available' WHERE id=$1
        `,[booking.rows[0].vehicle_id]);
        
        const result= await pool.query(`
            UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
        `,[status,id]);

        const vehicle= await pool.query(`   
        SELECT availability_status FROM vehicles WHERE id=$1
    `,[booking.rows[0].vehicle_id]);

        result.rows[0].vehicle= vehicle.rows[0];
        // Format dates
        result.rows[0].rent_start_date = new Date(result.rows[0].rent_start_date).toISOString().split('T')[0];
        result.rows[0].rent_end_date = new Date(result.rows[0].rent_end_date).toISOString().split('T')[0];
        
        return {message:"Booking marked as returned. Vehicle is now available",data:result.rows[0]};
    }

    
}


export const bookingService={
    addNewBooking,
    getBooking,
    updateBooking
};
