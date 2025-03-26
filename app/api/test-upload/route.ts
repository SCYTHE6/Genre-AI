import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Test upload API hit');
    
    const formData = await request.formData();
    console.log('Form data keys:', Array.from(formData.keys()));
    
    // Log details of each entry
    const details: Record<string, any> = {};
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        details[key] = {
          type: 'File',
          name: value.name,
          size: value.size,
          contentType: value.type
        };
      } else {
        details[key] = {
          type: typeof value,
          value: value
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Form data received successfully',
      formDataDetails: details
    });
  } catch (error) {
    console.error('Test upload API error:', error);
    return NextResponse.json({
      error: 'Failed to process request',
      details: String(error)
    }, { status: 500 });
  }
} 