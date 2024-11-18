// functions/api/summarize.js
export async function onRequest(context) {
  const { GEMINI_KEY } = context.env

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

  try {
    const { prs } = await context.request.json()

    const prompt = `Summarize these recent RISC Zero merged PRs in 2-3 sentences, focusing on the main themes and important changes:

${prs.map(pr => `- ${pr.title}: ${pr.body || 'no description'}`).join('\n')}
`

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    const data = await response.json()
    return new Response(JSON.stringify({
      summary: data.candidates[0].content.parts[0].text
    }), { headers })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers
    })
  }
}
