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
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    )
    const data = await response.json()
    return new Response(JSON.stringify(data), { headers })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers 
    })
  }
}

