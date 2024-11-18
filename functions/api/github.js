export async function onRequest(context) {
  const { GITHUB_TOKEN } = context.env
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }

  try {
    const response = await fetch(
      'https://api.github.com/repos/risc0/risc0/events',
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify({
        error: 'GitHub API error',
        status: response.status,
        details: error
      }), { 
        status: response.status, 
        headers 
      })
    }

    const data = await response.json()
    
    // ensure we return an array
    if (!Array.isArray(data)) {
      console.error('unexpected github response:', data)
      return new Response(JSON.stringify([]), { headers })
    }

    return new Response(JSON.stringify(data), { headers })
  } catch (e) {
    console.error('github api error:', e)
    return new Response(JSON.stringify({ 
      error: 'Function error', 
      message: e.message 
    }), { 
      status: 500, 
      headers 
    })
  }
}
