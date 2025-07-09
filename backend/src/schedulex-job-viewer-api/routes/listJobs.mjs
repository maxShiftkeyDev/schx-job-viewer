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

    // Transform DynamoDB items to a more readable format
    const jobs = response.Items.map((item) => ({
      jobId: item.jobId.S,
      companyName: item.companyName.S,
      jobType: item.jobType.S,
      tenantName: item.tenantName.S,
      totalItemsProcessed: parseInt(item.totalItemsProcessed.N),
      totalInvalidItems: parseInt(item.totalInvalidItems.N),
      jobTimestamp: item.jobTimestamp.S,
      s3ObjectKey: item.s3ObjectKey.S,
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
        message: `Successfully retrieved ${jobs.length} jobs`,
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
