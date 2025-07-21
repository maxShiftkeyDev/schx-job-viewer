# schx-job-viewer

A web application for viewing and managing ScheduleX integration jobs. This app provides a user-friendly interface to monitor job processing, filter results by company, and download job logs.

## Project Documentation

📋 **[Project Diagram & Architecture](https://miro.com/app/board/uXjVIqTyRNc=/)** - View the complete project design, architecture, and workflow diagrams

## Features

- **Job List View**: Displays all ScheduleX integration jobs in a sortable table
- **Company Filtering**: Filter jobs by company name to focus on specific organizations
- **Job Log Downloads**: Download CSV log files for each job directly from the application
- **Real-time Status**: View job processing statistics including total items processed and invalid items

## What the App Does

The application connects to the ScheduleX API to:

1. **Fetch Job Data**: Calls the `list-jobs` endpoint to retrieve all ScheduleX integration jobs
2. **Display Job Information**: Shows job details including company name, tenant, job type, processing statistics, and timestamps
3. **Filter by Company**: Allows users to filter the job list by company name for easier navigation
4. **Download Job Logs**: Provides functionality to download CSV log files for each job using presigned URLs

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd schx-job-viewer
   ```

2. **Install dependencies:**

   ```bash
   cd frontend
   yarn install
   ```

3. **Create environment file:**
   Create a `.env` file in the `frontend` directory with:

   ```
   VITE_API_URL=https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod
   ```

4. **Run the application:**

   ```bash
   yarn dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application

## Usage

1. **View Jobs**: The application will automatically load and display all available jobs
2. **Filter Jobs**: Use the "Clear Filter" button to reset company filters
3. **Download Logs**: Click the download icon in the Actions column to download job logs as CSV files

## API Endpoints

- `GET /list-jobs` - Retrieves all job data
- `POST /download-job-logs` - Generates presigned URLs for log downloads
