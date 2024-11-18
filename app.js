async function init() {
  const resp = await fetch('/api/github')
  const prs = await resp.json()
  
  console.log('total prs:', prs.length)
  console.log('merged prs:', prs.filter(pr => pr.merged_at).length)  // use merged_at instead of merged
  
  const output = document.getElementById('output')
  output.innerHTML = prs
    .filter(pr => pr.merged_at)  // merged PRs have a merged_at timestamp
    .map(pr => `
      <div class="event">
        <b>Merged PR #${pr.number}</b>: ${pr.user.login} - ${new Date(pr.merged_at).toLocaleString()}
        <div class="details">${pr.title}</div>
      </div>
    `).join('')
}

init()
