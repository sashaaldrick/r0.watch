async function init() {
  const resp = await fetch('/api/github')
  const data = await resp.json()
  document.getElementById('output').textContent = JSON.stringify(data, null, 2)
}

init()
