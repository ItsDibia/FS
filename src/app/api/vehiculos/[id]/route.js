import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request, { params }) {
  try {
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('vehiculos')
      .update(body)
      .eq('id', params.id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { error } = await supabase
      .from('vehiculos')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Vehículo eliminado exitosamente' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
