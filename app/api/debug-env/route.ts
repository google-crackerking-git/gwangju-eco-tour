import { NextResponse } from 'next/server';

export async function GET() {
  const serviceKey = process.env.BUS_API_SERVICE_KEY;
  let busResponse = '';
  try {
    const res = await fetch('http://apis.data.go.kr/6290000/busrouteinfo/getrouteinfo?serviceKey=' + serviceKey);
    busResponse = await res.text();
  } catch(e: any) {
    busResponse = e.message;
  }
  return NextResponse.json({
    busResponse: busResponse.substring(0, 500)
  });
}
