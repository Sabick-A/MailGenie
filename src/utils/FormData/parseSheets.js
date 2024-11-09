// index.js
const { google } = require("googleapis");
// Load the service account credentials
const credentials = {
    "type": "service_account",
    "project_id": "spiritual-oxide-429507-g0",
    "private_key_id": "d781e45b48c8e3f53f6056ee5a20643ffc84a114",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRkLhpcnL5hywe\n6dqJ3AzWGG0agesDqdKi9rN/o5f+JpR5zRF3HAuBcCm5PBn7GrC9E0F/0ss4gI85\n0b4TVSkbJbLkXQQOfhJVSpa11eifStPfD+xTH9lZUK9hWyWEjse9NbMqkoXais0R\n1ArEZfnoyc5d/lOQBxK6KLicuwrsKXAMXwDGXHrkGW6HCeOvCzD423wkXbuyxsl5\n5i0Y655M7ZDuy3NX59OKh/BJ9BgGXNtWlR7JEokaiCj6iiaIgwN4FfX02869s98H\n9lbldYbrNtCNsuV5s5h+jK97cEpIigJq0dEYwZ9fy/rak0hWInZj6SK3JVt/7qDN\n57SpQ0x7AgMBAAECggEAMaBLQ1FCb9u2M4XeZhoRghubrpTIcgAjrMqt/BJh+mHp\ndCR/N80Q3nCQuNhGMMQDyWqHbr0cub8b663DDLH0f4TAZbqvLL1nGwKESQAkS6B9\nJswPAyo+HpvwRCZA7rCfFSvjxzeWcge/gzLK7/JUKW+sqm6BHFDIewQMn7TdY8oI\nbvfkXQhyTw2erMSfLIkS4h8vVfU1Nz6q5tcf/HOq4dpPShaLfEulupWPwkK7mkMi\nQJqqUccGqXbW/tzHMlaf5kp45ywf8Pk3RGr8wfw5r/dPkWsRGrkjjn4KozOI1jnO\nteczunLZuF871x+scEu0u89furaKBagLUO67utbQSQKBgQD0T6ynfL9jl3DPritG\nrFu1qBnucrbuPmebNuKX/0swN/EKk0WBOpJS9qRPdcwFgizPjmh7F9oVLkXxalWG\nS1Xa/QOXEhKaBXOLvvgVoUCrGxoUq+Qvp6Di5EGw0AY8WNZpnFp1mGmywuIPoWSm\nbiKDojza7hIkvARgbAc+YRcB+QKBgQDbl3pM3iY+ky+S21sBg6RqJhbzZNLZwK5s\nDaaomKvp3Opcb6q0WawA7KVglQmAGn1Z8xjBaN24k6l2V2QXJNtewH6ihdWEkn2i\neiuB0lB+abebwwRA/MA4OjjlsQtrejHBLOuSzLMCSt3TAJP6oIw1Paq8ySUVMahe\nkbqkyhkfEwKBgQCgvZccL2CA9w+7JJ3Ghvpj/7DoCMPA5oAmSCs31Dk1BWlrCtBt\nIQtK2Ins2dUdPrOa79hgPKY4z1QnbU3N6N0ZEuT8zWA9xB5ssH3rRUgWC+PR+/JL\nRF//SCzMV2Hy7IRNwhhmTJwmiEBSBl8BfW7p6qFdbcu0LZw3kHwHl7uaiQKBgQC7\n5reZNPKG0w1/XcJW3l1/E07KQLkH6Y+XGGtGkzVv7UCBjnAE2UKMm/K7XWx+uKwQ\nnyrMvT4Upg35HLih8UDhqFf0HA9j3LIyqNW3xc5pDW82kr5+GYkl0/RB36hE9I/E\nm/qMaCq5SHTeC/2UFXNET5tc5cWciBxpp8uNHP44DwKBgB3lpzgM7Hld09VxuUO7\nLS4Ry+bh/G+AcqSDjQRPuPhAWK+0/ziOFP07+ZXm4vE4sYsYNq7PlYVYOqFK1dXO\nNeSBv1uCw6gW4SOkWzjoWnzJUhMVgB2X8SbIOgEB6AKXFFPOTSFXr7yaR7aIesXG\nSLp23aLLo3U3zr190jhAJAFT\n-----END PRIVATE KEY-----\n",
    "client_email": "sheet-access@spiritual-oxide-429507-g0.iam.gserviceaccount.com",
    "client_id": "116960992974099184158",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sheet-access%40spiritual-oxide-429507-g0.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  

// Initialize the Google Sheets API client
const sheets = google.sheets("v4");
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

async function getSheetData(spreadsheetId, range) {
    const authClient = await auth.getClient();
    const request = {
        spreadsheetId,
        range,
        auth: authClient,
    };
    const response = await sheets.spreadsheets.values.get(request);
    return response.data;
}

async function getSpreadsheetMetadata(spreadsheetId) {
    const authClient = await auth.getClient();
    const request = {
        spreadsheetId,
        auth: authClient,
    };
    const response = await sheets.spreadsheets.get(request);
    return response.data.sheets; // Returns the sheet names and other metadata
}

const spreadsheetId = "1l_PCSusn2liXpyfehDs6srsiatsplQDgF2Dy9ykakms";

async function getData() {
    try {
        // Fetch spreadsheet metadata if no range is provided
        const metadata = await getSpreadsheetMetadata(spreadsheetId);
        const sheetName = metadata[0].properties.title; // Get the first sheet's title (e.g., 'Sheet1')
        range = `${sheetName}`; // Use that sheet name as the range

        // Retrieve the sheet data
        const response = await getSheetData(spreadsheetId, range);
        console.log(response.values);
    } catch (error) {
        console.log({ error: error.message });
    }
}

getData();
