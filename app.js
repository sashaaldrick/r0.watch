async function init() {
  const resp = await fetch('/api/github')
  const events = await resp.json()
  
  const output = document.getElementById('output')
  output.innerHTML = events.map(event => `
    <div class="event">
      <b>${event.type}</b>: ${event.actor.login} - ${new Date(event.created_at).toLocaleString()}
    </div>
  `).join('')
}

init()
