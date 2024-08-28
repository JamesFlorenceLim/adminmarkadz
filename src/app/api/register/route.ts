import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function POST(req: NextRequest) {
  const { username, password, role_id } = await req.json();

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const [result] = await pool.query('INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)', [username, hashedPassword, role_id]);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Failed to register user', error: error.message }, { status: 500 });
  }
}
