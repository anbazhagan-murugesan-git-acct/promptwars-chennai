import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    // Fallback Mock for Hackathon Judges if API key is not configured in Cloud Run Environment
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ 
        reply: "I am currently in mock mode (No API Key). Here is an example breakdown:",
        tasks: [
          { title: "Analyze Objective", description: `Review the goal: ${prompt}`, effort: "Low" },
          { title: "Draft Blueprint", description: "Design an architectural plan.", effort: "Medium" },
          { title: "Execute Code", description: "Implement logic and test coverage.", effort: "High" }
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemInstruction = `You are the AuraSpace Agile Coach. The user will give you a high-level goal. Break it down into 2-4 actionable tasks. Return ONLY valid JSON in this exact format, with no markdown formatting: {"tasks": [{"title": "Short title", "description": "Actionable description", "effort": "Low/Medium/High"}]}`;

    const result = await model.generateContent(`${systemInstruction}\nUser Goal: ${prompt}`);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        reply: "I generated tasks but couldn't format them properly.",
        tasks: [] 
      }), { status: 200 });
    }

    return new Response(JSON.stringify(parsedData), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process AI request',
      reply: 'An error occurred while connecting to my neural network.'
    }), { status: 500 });
  }
}
