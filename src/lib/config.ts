import { getViteEnvVar } from './utils'

// Official Joke API configuration
const JOKE_API_BASE_URL = 'https://official-joke-api.appspot.com'

// Allow override via environment variable for development/testing
const API_BASE_URL = getViteEnvVar('API_BASE_URL', JOKE_API_BASE_URL)

export { API_BASE_URL, JOKE_API_BASE_URL }
