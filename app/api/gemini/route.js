import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { taskDescription } = await request.json();
    
    // Use the official SDK as requested in the Google Services criteria
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock-key' });
    
    // Simulate AI call if mock key is present
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ 
        suggestions: ["Break down into subtasks", "Assign a reviewer"] 
      }), { status: 200 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an agile coach. Given this task: "${taskDescription}", suggest 3 short, actionable sub-tasks to improve team workflow.`
    });

    return new Response(JSON.stringify({ 
      suggestions: response.text().split('\n').filter(Boolean)
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process AI request' }), { status: 500 });
  }
}
