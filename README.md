# MailGenie

**MailGenie** is a React-based application designed to generate and send personalized emails efficiently. It leverages modern APIs and tools to streamline data processing and email generation.

## Features

- **Authentication**: Secure user login with Google OAuth 2.0.
- **Data Input**: Accepts recipient data via:
  - CSV files
  - Google Sheets URLs
- **Data Parsing**: Processes the input data to extract and structure recipient information.
- **Recommendation Prompt**: Suggests a prompt based on the parsed data, including fields from recipient data.
  - Users can customize the prompt with their data and placeholder columns.
- **Personalized Email Generation**: Creates custom emails using:
  - User-defined prompts with placeholders.
  - GroqLLM for generating high-quality email content.
- **Email Sending**: Delivers emails seamlessly using the Gmail API.
- **Styling**: Built with TailwindCSS for a clean and responsive UI.

## How It Works

1. **User Authentication**: Log in with your Google account.
2. **Input Data**: Upload a CSV file or provide a Google Sheets URL with recipient details.
3. **Data Processing**: Parses and organizes data for generating emails.
4. **Recommendation Prompt**: Suggests a draft prompt based on the parsed data fields.
   - Customize the prompt by modifying it and using placeholder columns.
5. **Email Customization**: Generates personalized email content using the customized prompt.
6. **Email Delivery**: Sends emails directly through the Gmail API.

## Tech Stack

- **Frontend**: React, styled with TailwindCSS.
- **Authentication**: Google OAuth 2.0.
- **Data Processing**: CSV parser and Google Sheets API.
- **Email Generation**: GroqLLM.
- **Email Delivery**: Gmail API.

## Usage

1. **Log in**: Use your Google account to log in securely.
2. **Upload Data**:  
   - Upload a CSV file containing recipient data, or  
   - Provide a Google Sheets URL.
3. **Parse Data**: The application processes the uploaded data and extracts the relevant fields.
4. **Recommendation Prompt**:  
   - Review the automatically generated prompt based on the parsed data fields.  
   - Customize the prompt with your specific data and placeholder columns.
5. **Generate Emails**: Personalized email content is created based on the customized prompt.
6. **Preview and Send**: Review the generated emails and send them via the Gmail API.
