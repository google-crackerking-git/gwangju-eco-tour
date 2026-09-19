import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const serviceType = searchParams.get('type') || 'WFS'; // WMS or WFS

  try {
    if (serviceType === 'WFS') {
      // WFS Parameter forwarding
      const wfsParams = new URLSearchParams();
      searchParams.forEach((val, key) => {
        if (key !== 'type') wfsParams.append(key, val);
      });
      
      const url = `https://www.gis-heritage.go.kr/openapi/xmlService/spca.do?${wfsParams.toString()}`;
      
      const response = await fetch(url, {
        // next: { revalidate: 3600 }
      });
      
      const xml = await response.text();
      return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
    } else {
      return NextResponse.json({ success: false, error: 'WMS must be integrated via direct Tile rendering on client side.' });
    }
  } catch (error) {
    console.error('[Heritage API Error]', error);
    return NextResponse.json({ success: false, error: 'Heritage API call failed' }, { status: 500 });
  }
}

