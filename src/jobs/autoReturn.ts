import { pool } from "../config/db";

export const autoReturnExpiredBookings = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const expiredBookings = await pool.query(`
            SELECT b.id, b.vehicle_id 
            FROM bookings b 
            WHERE b.status = 'active' 
            AND b.rent_end_date < $1
        `, [today]);
        
        if (expiredBookings.rows.length > 0) {
            
            for (const booking of expiredBookings.rows) {
                
                await pool.query(`
                    UPDATE bookings SET status = 'returned' WHERE id = $1
                `, [booking.id]);
                
                await pool.query(`
                    UPDATE vehicles SET availability_status = 'available' WHERE id = $1
                `, [booking.vehicle_id]);
            }
            
            
        }
        
        return expiredBookings.rows.length;
    } catch (error) {
        return 0;
    }
};
