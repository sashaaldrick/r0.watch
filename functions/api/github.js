export async function onRequest(context) {
  const { GITHUB_TOKEN, GEMINI_KEY } = context.env
  const cache = context.env.CACHE

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }

  try {
    // check cache first
    const cached = await cache.get('cached_data', 'json')
    const now = Date.now()
    
    // if cache exists and less than 1 hour old, return it
    if (cached && (now - cached.timestamp) < 3600000) {
      return new Response(JSON.stringify(cached), { headers })
    }

    // if cache miss or old, fetch new data
    const response = await fetch(
      'https://api.github.com/repos/risc0/risc0/pulls?state=closed&sort=updated&direction=desc&per_page=5',
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'r0-watch'
        }
      }
    )
    
    const prs = await response.json()

    // generate new summary
    const prompt = `Summarize these recent RISC Zero merged PRs in 2-3 sentences, focusing on the main themes and important changes:
      ${prs.filter(pr => pr.merged_at).map(pr => `- ${pr.title}: ${pr.body || 'no description'}`).join('\n')}
    `

    const geminiResp = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
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

    const data = await geminiResp.json()
    const summary = data.candidates[0].content.parts[0].text

    // create cache object
    const cacheData = {
      prs,
      summary,
      timestamp: now
    }

    // store in cache
    await cache.put('cached_data', JSON.stringify(cacheData))

    return new Response(JSON.stringify(cacheData), { headers })
  } catch (e) {
    // if there's an error but we have cached data, return it
    const cached = await cache.get('cached_data', 'json')
    if (cached) {
      return new Response(JSON.stringify({
        ...cached,
        error: 'Using cached data due to error: ' + e.message
      }), { headers })
    }

    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers 
    })
  }
}
