# schx-job-viewer

A web application for viewing and managing ScheduleX integration jobs. This app provides a user-friendly interface to monitor job processing, filter results by company, and download job logs.

## Project Overview

This project consists of three main components that work together:

### 🖥️ **Frontend (React/Vite)**

- Web application for viewing and managing ScheduleX jobs
- Connects to the backend API to fetch job data and download logs
- Provides filtering and user interface functionality

### 🔧 **Backend (AWS Lambda)**

- REST API service running on AWS Lambda
- Handles job data retrieval and log file generation
- Provides endpoints for listing jobs and generating download URLs
- **Status**: Already deployed and running in AWS

### 🔌 **Workato SDK Connector**

- Custom Workato connector for ScheduleX integrations
- Provides `create_new_employee_job` action for Workato workflows
- Must be deployed to individual Workato tenants for use

## Project Documentation

📋 **[Project Diagram & Architecture](https://miro.com/app/board/uXjVIqTyRNc=/)** - View the complete project design, architecture, and workflow diagrams

## Features

- **Job List View**: Displays all ScheduleX integration jobs in a sortable table
- **Company Filtering**: Filter jobs by company name to focus on specific organizations
- **Job Log Downloads**: Download CSV log files for each job directly from the application
- **Real-time Status**: View job processing statistics including total items processed and invalid items

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Workato CLI (for SDK deployment)

### Frontend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/maxShiftkeyDev/schx-job-viewer.git
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

4. **Run the frontend application:**

   ```bash
   yarn dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application

### Workato SDK Deployment

To deploy the SDK connector to a Workato tenant:

1. **Navigate to the SDK directory:**

   ```bash
   cd job-viewer-sdk
   ```

2. **Deploy to your Workato tenant:**

   ```bash
   workato push <your-tenant-api-key>
   ```

3. **Verify deployment:**
   - The `create_new_employee_job` action will be available in your Workato tenant
   - You can now use this connector in your Workato workflows

**Note**: The backend API is already deployed and running in AWS, so no additional setup is required for the backend component.

## Usage

1. **View Jobs**: The application will automatically load and display all available jobs
2. **Filter Jobs**: Use the "Clear Filter" button to reset company filters
3. **Download Logs**: Click the download icon in the Actions column to download job logs as CSV files

## API Endpoints

- `GET /list-jobs` - Retrieves all job data
- `POST /download-job-logs` - Generates presigned URLs for log downloads
