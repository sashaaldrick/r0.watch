export async function onRequest(context) {
  console.log('function called')
  const { GITHUB_TOKEN } = context.env
  console.log('token exists:', !!GITHUB_TOKEN)
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
  
  return new Response(JSON.stringify({ 
    test: true,
    hasToken: !!GITHUB_TOKEN 
  }), { headers })

  // try {
  //   const response = await fetch(
  //     'https://api.github.com/repos/risc0/risc0/events',
  //     {
  //       headers: {
  //         'Authorization': `Bearer ${GITHUB_TOKEN}`,
  //         'Accept': 'application/vnd.github.v3+json',
  //       }
  //     }
  //   )
  //   const data = await response.json()
  //   return new Response(JSON.stringify(data), { headers })
  // } catch (e) {
  //   return new Response(JSON.stringify({ error: e.message }), { 
  //     status: 500, 
  //     headers 
  //   })
  // }
}

