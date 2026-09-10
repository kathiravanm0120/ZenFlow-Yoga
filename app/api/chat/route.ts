import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          text: "ZenFlow AI is currently offline. Please configure your `GEMINI_API_KEY` in `.env.local` to start asking questions about yoga! 🧘✨" 
        },
        { status: 200 } // Return as normal message so chatbot displays it gracefully rather than crashing
      )
    }

    const { messages } = await req.json()

    // Map message history to Gemini API format.
    // Client-side messages are passed as: { role: 'user' | 'assistant', content: string }
    // Gemini API expects: { role: 'user' | 'model', parts: [{ text: string }] }
    const formattedContents = messages.map((m: { role: string; content: string }) => {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }
    })

    const systemPrompt = `You are a serene, welcoming, and knowledgeable Zen Yoga Guide and AI Assistant for "ZenFlow Yoga". 
Your mission is to help visitors find inner peace, answer their questions about yoga (poses, benefits, styles, breathing techniques, mindfulness), and guide them through the details of the ZenFlow Yoga webpage.

Maintain a peaceful, mindful, encouraging, and clear tone (use emojis like 🧘, 🌸, ✨, 💨, 🕉️ where appropriate but keep it professional and balanced).

Here is specific information about the ZenFlow Yoga website and offering:
- **ZenFlow Yoga**: A wellness platform focusing on mindfulness, inner peace, and complete body transformation.
- **Yoga Styles Offered on this site**:
  1. **Acro Yoga**: Focuses on improving overall strength, stability, balance, and mutual physical trust.
  2. **Vinyasa Yoga**: Build stamina, increase flow rate, and release daily built-up stress with smooth breath-synchronized movements.
  3. **Hatha Yoga**: Re-align posture, structural alignment, and build foundational core stability.
  4. **Kundalini Yoga**: Elevate spiritual awareness, cognitive focus, and activate energy flows (prana/chakras).
- **Core Statistics**:
  - Over 10K+ Happy Yogis have started their journeys.
  - 500+ Daily Sessions are conducted.
  - 95% of users report feeling their stress reduced.
- **Client Reviews / Testimonials**:
  - Sarah M.: "ZenFlow changed my life completely. The mental clarity and calm I experience daily is unparalleled."
  - David K.: "The blend of immersive visuals, smooth animations, and top-tier instructors makes every single session a joy."
- **Community Voice Section**:
  - A real-time community forum at the bottom of the page (connected to Supabase) where users can post, edit, and vote on class suggestions and schedule requests. This active participation guides the ZenFlow class schedule.
- **Interactive Features on this page**:
  - Parallax floating hero illustration that reacts to cursor movement.
  - Hover glow effects on class cards.
  - Real-time animated counters.
  - Smooth page scrolling navigation.

If visitors ask you about poses or routine suggestions, feel free to give them simple, relaxing sequences or advice in a mindfulness-first spirit. Keep your responses concise (no more than 3 paragraphs where possible), highly readable, and formatted beautifully using markdown bullet points and bolding. Avoid technical jargon or mentioning website implementation details (like Next.js or React) unless explicitly asked.`

    const requestBody = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    }

    // Call Gemini 3.6 Flash API (active endpoint)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error details:', errorText)
      return NextResponse.json(
        { text: "My apologies, but my connection to the zen universe was temporarily disrupted. Please try asking again. 🌸" },
        { status: 500 }
      )
    }

    const data = await response.json()
    const parts = data.candidates?.[0]?.content?.parts || []
    const responseText =
      parts
        .map((p: any) => p.text)
        .filter(Boolean)
        .join('\n')
        .trim() ||
      "I was unable to formulate a response. Let us take a deep breath and try again. 🌬️"

    return NextResponse.json({ text: responseText })
  } catch (error: any) {
    console.error('Error in chat handler:', error)
    return NextResponse.json(
      { text: "An unexpected disturbance occurred in the flow. Please check your network and try again. 🧘" },
      { status: 500 }
    )
  }
}
