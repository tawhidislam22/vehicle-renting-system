
import { Pool } from 'pg';
import config from '.';

export const pool = new Pool({
    connectionString: `${config.connectionString}`
})

const initDb = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Users  (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    phone VARCHAR(20) NOT NULL, 
    role VARCHAR(10) NOT NULL,
    
    CONSTRAINT chk_role CHECK (role IN ('admin', 'customer')),

    CONSTRAINT chk_email_lowercase CHECK (email = LOWER(email)),

    CONSTRAINT chk_password_length CHECK (LENGTH(password) >= 6)
      );
        `)

    await pool.query(`
    CREATE TABLE IF NOT EXISTS Vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
    availability_status VARCHAR(15) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked'))
    );
        `)

    await pool.query(`
    CREATE TABLE IF NOT EXISTS Bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status VARCHAR(15) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE,
    CONSTRAINT chk_booking_dates CHECK (rent_end_date > rent_start_date)
    );
        `)

}

export default initDb;