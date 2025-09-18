import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('transportes')
      .select(`
        *,
        vehiculo:vehiculos(placa, dueño, tipo_vehiculo),
        cliente:clientes(nombre, ruc)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('transportes')
      .insert([body])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
