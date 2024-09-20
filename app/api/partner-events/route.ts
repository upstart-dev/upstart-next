import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/client";

export async function GET() {
  const supabase = createClient();
  
  try {
    console.log('Iniciando busca de eventos de parceiros');
    const { data, error } = await supabase
      .from('event')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Erro do Supabase:', error);
      throw error;
    }

    console.log('Eventos de parceiros encontrados:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar eventos de parceiros:', error);
    return NextResponse.json({ error: 'Erro ao buscar eventos de parceiros' }, { status: 500 });
  }
}