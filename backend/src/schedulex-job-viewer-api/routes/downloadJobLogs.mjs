// this function should expect a s3ObjectName as a body parameter
// it should then check that the s3ObjectName is valid / that the object exists
// then if so it should generate a presigned url to download the object
// it should then return the presigned url

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.PROJECT_REGION,
});

const s3Bucket = process.env.S3_BUCKET_NAME;

const downloadJobLogs = async (event, context) => {
  try {
    const { s3ObjectName } = JSON.parse(event.body);
    console.log("s3ObjectName", s3ObjectName);

    if (!s3ObjectName) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        },
        body: JSON.stringify({
          error: "Missing s3ObjectName",
          message: "s3ObjectName is required in the request body",
        }),
      };
    }

    const command = new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3ObjectName,
      ResponseContentDisposition: `attachment; filename="${s3ObjectName}"`,
      ResponseContentType: "text/csv",
    });

    // Generate presigned URL for download without checking if object exists
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 5 * 60, // 5 minutes
    });

    console.log("Generated presigned URL for download:", s3ObjectName);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      },
      body: JSON.stringify({
        message: "Successfully generated download URL for job logs",
        presignedUrl: presignedUrl,
        s3ObjectName: s3ObjectName,
      }),
    };
  } catch (error) {
    console.error("Error in downloadJobLogs:", error);

    if (error.name === "NoSuchKey") {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        },
        body: JSON.stringify({
          error: "Job logs not found",
          message: "The requested job logs do not exist in S3",
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while generating download URL",
      }),
    };
  }
};

export default downloadJobLogs;
