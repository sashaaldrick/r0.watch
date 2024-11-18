async function init() {
  const output = document.getElementById('output')
  const summaryDiv = document.getElementById('summary')
  output.innerHTML = '<div class="loading">Loading...</div>'
  
  const resp = await fetch('/api/github')
  const { prs, summary, timestamp, error } = await resp.json()
  
  // display summary if available
  if (summary) {
    summaryDiv.innerHTML = `
      <h2>TLDR;</h2>
      ${summary}
      <div class="last-updated">
        Last updated: ${new Date(timestamp).toLocaleString()}
        ${error ? `<br><span class="error">${error}</span>` : ''}
      </div>
    `
    summaryDiv.classList.add('active')
  }
  
  output.innerHTML = prs
    .filter(pr => pr.merged_at)
    .map(pr => `
      <div class="event">
        <b>Merged PR <a href="${pr.html_url}" target="_blank">#${pr.number}</a></b>: 
        <a href="https://github.com/${pr.user.login}" target="_blank">${pr.user.login}</a> 
        - ${new Date(pr.merged_at).toLocaleString()}
        <div class="title">${pr.title}</div>
        ${pr.body ? `<div class="description">${pr.body}</div>` : ''}
      </div>
    `).join('')
}

init()
