// the createnew job request will have metadata about the job.
// this function needs to use the metadata to:
// 1. create an new entry in the dynamodb table for the job - with all the metadata
// 2. generate a pro-signed url for the job to be uploaded to s3
// 3. return the pro-signed url to the client

// her are the fields I'll have as part of the metadata:
// jobId, company_name, job_type, tenant_name, total_items_processed, total_invalid_items, job_timestamp

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.PROJECT_REGION,
});

const dynamoDBClient = new DynamoDBClient({
  region: process.env.PROJECT_REGION,
});

const jobTable = process.env.SCHEDULEX_JOB_METADATA_TABLE_NAME;
const s3Bucket = "schx-job-view-test-bucket";

export const createNewJob = async (event, context) => {
  try {
    // get the job metadata from the request body
    const jobMetadata = JSON.parse(event.body);
    console.log("jobMetadata", jobMetadata);

    const s3ObjectKey = `${jobMetadata.jobId}-${jobMetadata.company_name.toLowerCase()}.json`;

    // create a new entry in the dynamodb table for the job
    const newJob = await createJobInDynamoDB(jobMetadata, s3ObjectKey);

    // generate a pro-signed url for the job to be uploaded to s3
    const presignedUrl = await generatePresignedUrlForJob(newJob, s3ObjectKey);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "hello there! your job has been created and a presigned url has been generated for you to upload your job logs to s3",
        presignedUrl: presignedUrl,
      }),
    };
  } catch (error) {
    console.error("Error in createNewJob:", error);

    // Handle different types of errors
    if (error.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: "Job with this ID already exists",
          message: "A job with this ID has already been created",
        }),
      };
    }

    if (error.name === "SerializationException") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid data format",
          message: "The job metadata contains invalid data types",
        }),
      };
    }

    // Generic error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while creating the job",
      }),
    };
  }
};

const createJobInDynamoDB = async (jobMetadata, s3ObjectKey) => {
  // create a new entry in the dynamodb table for the job
  const command = new PutItemCommand({
    TableName: jobTable,
    Item: {
      jobId: { S: jobMetadata.jobId },
      companyName: { S: jobMetadata.company_name },
      jobType: { S: jobMetadata.job_type },
      tenantName: { S: jobMetadata.tenant_name },
      totalItemsProcessed: { N: jobMetadata.total_items_processed.toString() },
      totalInvalidItems: { N: jobMetadata.total_invalid_items.toString() },
      jobTimestamp: { S: jobMetadata.job_timestamp },
      s3ObjectKey: { S: s3ObjectKey },
    },
    ConditionExpression: "attribute_not_exists(jobId)",
  });

  const response = await dynamoDBClient.send(command);
  console.log("response", response);
  return jobMetadata; // Return the original metadata for the presigned URL
};

const generatePresignedUrlForJob = async (job, s3ObjectKey) => {
  // generate a presigned url for the job to be uploaded to s3
  const command = new PutObjectCommand({
    Bucket: s3Bucket,
    Key: s3ObjectKey,
  });

  try {
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 5 * 60, // 5 minutes
    });
    console.log("Generated presigned URL for job:", job.jobId);
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL for upload");
  }
};
