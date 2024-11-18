async function init() {
  const output = document.getElementById('output')
  output.innerHTML = '<div class="loading">Loading...</div>'
  
  const resp = await fetch('/api/github')
  const prs = await resp.json()
  
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

  // Setup TLDR button
  const tldrButton = document.getElementById('tldrButton')
  const summaryDiv = document.getElementById('summary')
  
  tldrButton.onclick = async () => {
    tldrButton.disabled = true
    tldrButton.textContent = 'Generating...'
    
    try {
      const summaryResp = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prs })
      })
      const { summary } = await summaryResp.json()
      
      summaryDiv.innerHTML = `
        <h2>TLDR;</h2>
        ${summary}
      `
      summaryDiv.classList.add('active')
    } catch (e) {
      summaryDiv.innerHTML = `
        <h2>Error</h2>
        Failed to generate summary: ${e.message}
      `
      summaryDiv.classList.add('active')
    } finally {
      tldrButton.disabled = false
      tldrButton.textContent = 'Get TLDR'
    }
  }
}

init()
