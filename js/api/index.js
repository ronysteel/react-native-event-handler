import firebase from '../firebase'

const API_HOST = `https://us-central1-test-5913c.cloudfunctions.net/api`

export const fetchEpisode = ({ novelId, episodeId }) => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/novels/${novelId}/episodes/${episodeId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const fetchEpisodeList = ({ novelId }) => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/episodes/${novelId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const fetchCategories = () => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/categories`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const requestGetTicket = () => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/tickets/get_by_tweet`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const fetchRecommends = ({ categoryId }) => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/recommends/${categoryId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const fetchTicketCount = () => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/tickets/count`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const fetchTab = ({ tabName }) => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/tabs/${tabName}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const verifyReceipt = ({ body }) => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/verify-receipt`, {
      method: 'POST',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
)

export const fetchUserEnergy = () => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/user_energy`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const updateUserEnergy = (body) => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/user_energy`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)

export const fetchUseTicket = () => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/tickets/use`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => {
    if (!r.ok) {
      return Promise.reject({ err: 'failed to useTicket request', status: r.status })
    }
    return r
  })
  .then(r => r.json())
  .then(r => r.response)
)

export const fetchUser = () => (
  firebase.auth().currentUser.getIdToken()
  .then(token => (
    fetch(`${API_HOST}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    })
  ))
  .then(r => r.json())
  .then(r => r.response)
)
