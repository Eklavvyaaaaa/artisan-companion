import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// IMPORTANT: Set the GOOGLE_API_KEY environment variable in your Supabase project.
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');

// The main function that handles the request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!GOOGLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'GOOGLE_API_KEY is not set.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    // 1. Extract image URL from the request body
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      throw new Error('Image URL is required.');
    }

    // 2. Fetch the image and convert it to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    // btoa is available in Deno's global scope
    const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageArrayBuffer)));

    // 3. Prepare the prompt for Google's Gemini model
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: "You are an expert brand storyteller for an artisan marketplace. Analyze this image of a handcrafted item and generate a JSON object with the following fields: 'title', 'description', 'tags', and 'socials'. The title should be poetic and enticing. The description should be a short paragraph telling a story about the item, its materials, and the artisan's craft. The tags should be an array of 5-7 relevant lowercase keywords. The socials field should be an object with 'instagram', 'twitter', and 'facebook' properties, each containing a short, engaging post to promote the item. Please return ONLY the JSON object, without any markdown formatting or other text.",
            },
            {
              inline_data: {
                mime_type: 'image/jpeg', // Assuming jpeg, but this could be made more robust
                data: imageBase64,
              },
            },
          ],
        },
      ],
    };

    // 4. Make the API call to Google's Generative AI
    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!googleResponse.ok) {
      const errorBody = await googleResponse.text();
      throw new Error(`Google API error: ${googleResponse.status} ${errorBody}`);
    }

    const responseData = await googleResponse.json();
    
    // 5. Extract and parse the AI-generated text
    // The response from Gemini might be wrapped in markdown, so we need to clean it.
    const jsonString = responseData.candidates[0].content.parts[0].text.replace(/```json\n|```/g, '');
    const generatedContent = JSON.parse(jsonString);

    // 6. Return the structured content
    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Handle any errors that occur during the process
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});