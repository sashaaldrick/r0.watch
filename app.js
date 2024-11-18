async function init() {
  const resp = await fetch('/api/github')
  const prs = await resp.json()
  
  const output = document.getElementById('output')
  output.innerHTML = prs
    .filter(pr => pr.merged)
    .map(pr => `
      <div class="event">
        <b>Merged PR #${pr.number}</b>: ${pr.user.login} - ${new Date(pr.merged_at).toLocaleString()}
        <div class="details">${pr.title}</div>
      </div>
    `).join('')
}

init()
