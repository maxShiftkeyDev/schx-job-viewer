import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const listJobs = async (event, context) => {
  try {
    const dynamoDBClient = new DynamoDBClient({
      region: process.env.PROJECT_REGION,
    });

    const command = new ScanCommand({
      TableName: process.env.SCHEDULEX_JOB_METADATA_TABLE_NAME,
    });

    const response = await dynamoDBClient.send(command);
    console.log("DynamoDB response:", response);

    const jobs = response.Items.map((item) => ({
      jobId: item.jobId && item.jobId.S != null ? item.jobId.S : null,
      companyName:
        item.companyName && item.companyName.S != null
          ? item.companyName.S
          : null,
      jobType: item.jobType && item.jobType.S != null ? item.jobType.S : null,
      tenantName:
        item.tenantName && item.tenantName.S != null ? item.tenantName.S : null,
      totalItemsProcessed:
        item.totalItemsProcessed && item.totalItemsProcessed.N != null
          ? parseInt(item.totalItemsProcessed.N)
          : null,
      totalInvalidItems:
        item.totalInvalidItems && item.totalInvalidItems.N != null
          ? parseInt(item.totalInvalidItems.N)
          : null,
      jobTimestamp:
        item.jobTimestamp && item.jobTimestamp.S != null
          ? item.jobTimestamp.S
          : null,
      s3ObjectKey:
        item.s3ObjectKey && item.s3ObjectKey.S != null
          ? item.s3ObjectKey.S
          : null,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      },
      body: JSON.stringify({
        jobs: jobs,
        count: jobs.length,
      }),
    };
  } catch (error) {
    console.error("Error in listJobs:", error);

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
        message: "An unexpected error occurred while retrieving jobs",
      }),
    };
  }
};

export default listJobs;
