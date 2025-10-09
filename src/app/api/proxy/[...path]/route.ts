import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_TARGET || 'http://5.223.78.37:8001';

function buildTargetUrl(pathArray: string[]) {
  const path = pathArray.join('/');
  // Preserve trailing slash for frameworks that require it
  const hasTrailing = pathArray.length > 0 && pathArray[pathArray.length - 1] === '';
  return `${API_BASE_URL}/${path}${hasTrailing ? '/' : ''}`;
}

async function forward(request: NextRequest, method: string, pathArray: string[]) {
  const url = buildTargetUrl(pathArray);
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  };

  if (method !== 'GET' && method !== 'HEAD') {
    try {
      init.body = JSON.stringify(await request.json());
    } catch {
      // no body
    }
  }

  const response = await fetch(url, init);
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    return NextResponse.json({ error: 'API request failed' }, { status: response.status });
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  } as Record<string, string>;

  if (contentType.includes('application/json')) {
    const data = await response.json();
    return NextResponse.json(data, { headers });
  }
  const text = await response.text();
  return new NextResponse(text, { headers });
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await forward(request, 'GET', params.path);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await forward(request, 'POST', params.path);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await forward(request, 'PUT', params.path);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    return await forward(request, 'DELETE', params.path);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
