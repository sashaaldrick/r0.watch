export async function onRequest(context) {
  const response = await fetch(
    'https://api.github.com/repos/risc0/risc0/events',
    {
      headers: {
        'Authorization': `token ${context.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'r0-watch'
      }
    }
  )
  
  return new Response(await response.text(), {
    headers: { 'Content-Type': 'application/json' }
  })
}
