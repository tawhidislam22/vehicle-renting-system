
import { Pool } from 'pg';
import config from '.';

export const pool= new Pool({
    connectionString:`${config.connectionString}`
})

const initDb=async()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,        
        email VARCHAR(150) UNIQUE NOT NULL lowercase,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL 
        
        )
        `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(10) NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10,2) NOT NULL,
        availability_status BOOLEAN DEFAULT TRUE
        )
        `)
}