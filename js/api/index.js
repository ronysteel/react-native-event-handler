
const API_HOST = `https://us-central1-test-5913c.cloudfunctions.net/api`

export const fetchEpisode = ({ idToken, novelId, episodeId }) => (
  fetch(`${API_HOST}/novels/${novelId}/episodes/${episodeId}`, {
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

export const fetchEpisodeList = ({ idToken, novelId }) => (
  fetch(`${API_HOST}/episodes/${novelId}`, {
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

export const fetchCategories = ({ idToken }) => (
  fetch(`${API_HOST}/categories`, {
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

export const requestGetTicket = ({ idToken }) => (
  fetch(`${API_HOST}/tickets/get_by_tweet`, {
    method: 'POST',
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
