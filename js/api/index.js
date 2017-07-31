
const API_HOST = `https://us-central1-test-5913c.cloudfunctions.net/api`

export const fetchScripts = ({ idToken, episodeId }) => (
  fetch(`${API_HOST}/scripts/${episodeId}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
      'Cache-Control': 'no-cache',
    }
  })
  .then(r => r.json())
  .then(r => r.response)
)
