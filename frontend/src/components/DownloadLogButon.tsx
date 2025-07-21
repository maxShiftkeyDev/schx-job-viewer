// this component should be a button that when clicked will download the logs for a given job
// to download logs, first we call this endpoint - https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod/download-job-logs
// this returns a presigned url that we can use to download the logs
// the logs should automatically download for the user

import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useState } from "react";

interface DownloadLogButtonProps {
  s3ObjectName: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const DownloadLogButton = ({ s3ObjectName }: DownloadLogButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`${API_URL}/download-job-logs`, {
        method: "POST",
        body: JSON.stringify({ s3ObjectName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Download response data:", data);

        // If the response contains a presigned URL, trigger the download
        if (data.presignedUrl) {
          // Open the presigned URL directly - S3 will handle the download
          window.open(data.presignedUrl, "_blank");
        } else {
          setError("No presigned URL found in response");
        }
      } else {
        setError(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isDownloading) {
    return <div>Downloading logs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Button onClick={handleDownload}>
      <Download />
    </Button>
  );
};
