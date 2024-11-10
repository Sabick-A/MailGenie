const googleConf = {
    "type": "service_account",
    "project_id": import.meta.env.VITE_GOOGLE_PROJECT_ID,
    "private_key_id": import.meta.env.VITE_GOOGLE_PRIVATE_KEY_ID,
    "private_key": import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
    "client_email": import.meta.env.VITE_GOOGLE_CLIENT_EMAIL,
    "client_id": import.meta.env.VITE_GOOGLE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": import.meta.env.VITE_GOOGLE_CLIENT_CERT_URL,
    "universe_domain": "googleapis.com"
  }

export default googleConf;