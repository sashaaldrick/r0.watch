export async function onRequest(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  try {
    const { CLAUDE_KEY } = context.env
    const { event } = await context.request.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01',
        'x-api-key': CLAUDE_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `summarize this github event in one sentence: ${JSON.stringify(event)}`
        }]
      })
    })

    const data = await response.json()
    return new Response(JSON.stringify({ 
      summary: data.content[0].text 
    }), { headers })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers 
    })
  }
}

