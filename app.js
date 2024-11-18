async function init() {
  const resp = await fetch('/api/github')
  const events = await resp.json()
  
  const output = document.getElementById('output')
  output.innerHTML = events
    // filter only merged PRs
    .filter(event => 
      event.type === 'PullRequestEvent' && 
      event.payload.pull_request.merged
    )
    .map(event => {
      const pr = event.payload.pull_request
      return `
        <div class="event">
          <b>Merged PR #${pr.number}</b>: ${event.actor.login} - ${new Date(event.created_at).toLocaleString()}
          <div class="details">${pr.title}</div>
        </div>
      `
    }).join('')
}

init()
