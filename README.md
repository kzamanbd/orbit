Orbit 🌌

Orbit is a seamless, minimalist interface for managing your cloud files, built on top of the Google Drive API. It provides a modern way to upload, organize, and access your digital assets from anywhere.

🚀 Overview

Orbit bridges the gap between complex cloud storage requirements and simple user experience. Designed for efficiency, it allows users to authenticate securely with their Google accounts and manage their Drive contents within a sleek, custom environment.

✨ Features

Secure Authentication: OAuth 2.0 login via Google.

Drag & Drop Uploads: Effortlessly upload files to your personal cloud.

File Management: Browse, search, and organize folders.

Real-time Sync: Changes in Orbit reflect instantly in Google Drive.

Responsive Design: Works beautifully on desktop and mobile.

🛠️ Getting Started

Prerequisites

Node.js (v14+)

Google Cloud Console Project with Google Drive API enabled.

client_id and API_KEY from Google Developer Console.

Installation

Clone the repository:

git clone [https://github.com/yourusername/orbit.git](https://github.com/yourusername/orbit.git)


Install dependencies:

npm install


Configure Environment:
Create a .env file and add your Google API credentials:

REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_API_KEY=your_api_key


Run the application:

npm start


🔐 Permissions

Orbit requires the following Google Drive scopes:

https://www.googleapis.com/auth/drive.file (Recommended for app-specific access)

https://www.googleapis.com/auth/drive.readonly (If viewing all files is required)

🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
