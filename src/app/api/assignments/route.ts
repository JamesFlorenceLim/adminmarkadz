import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function POST(req: NextRequest) {
  const { van_id, operator_id } = await req.json();

  try {
    const [result] = await pool.query(
      'INSERT INTO assignments (van_id, operator_id) VALUES (?, ?)',
      [van_id, operator_id]
    );

    const insertResult = result as mysql.ResultSetHeader;

    return NextResponse.json({ id: insertResult.insertId, van_id, operator_id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to add assignment', error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query('SELECT * FROM assignments');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to retrieve assignments', error: error.message }, { status: 500 });
  }
}
