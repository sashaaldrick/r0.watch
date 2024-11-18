const REPO = 'risc0/risc0' // e.g. 'facebook/react'

async function fetchGithubEvents() {
  const resp = await fetch('/api/github')
  const data = await resp.json()
  
  // if we got an error object instead of array
  if (!Array.isArray(data) && data.error) {
    throw new Error(data.error)
  }
  
  // ensure we always return an array
  return Array.isArray(data) ? data : []
}

async function summarizeEvent(event) {
  const resp = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event })
  })
  return (await resp.json()).summary
}

function addToStream(summary) {
  const div = document.createElement('div')
  div.className = 'bg-gray-800 p-4 rounded text-white'
  div.textContent = summary
  document.getElementById('stream').prepend(div)
}

let lastEventId = null

async function checkForUpdates() {
  try {
    const events = await fetchGithubEvents()
    const newEvents = lastEventId
      ? events.filter(e => e.id > lastEventId)
      : events.slice(0, 5)

    if (newEvents.length) {
      lastEventId = newEvents[0].id
      for (const event of newEvents.reverse()) {
        const summary = await summarizeEvent(event)
        addToStream(summary)
      }
    }
  } catch (e) {
    console.error('update failed:', e)
  }
}

setInterval(checkForUpdates, 60000)
checkForUpdates()

