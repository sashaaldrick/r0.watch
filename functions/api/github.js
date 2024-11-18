export async function onRequest(context) {
  // get merged PRs, 100 per page, sorted by updated date
  const response = await fetch(
    'https://api.github.com/repos/risc0/risc0/pulls?state=closed&sort=updated&direction=desc&per_page=100',
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
