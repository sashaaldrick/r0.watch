export async function onRequest(context) {
  // add state=closed to get merged PRs
  const response = await fetch(
    'https://api.github.com/repos/risc0/risc0/pulls?state=closed&sort=updated&direction=desc&per_page=5',
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
