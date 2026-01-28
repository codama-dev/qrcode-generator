import { getViteEnvVar } from './utils'

// Base URL for any future API; defaults to empty for front-end-only QR generation
const API_BASE_URL = getViteEnvVar('API_BASE_URL', '')

export { API_BASE_URL }
