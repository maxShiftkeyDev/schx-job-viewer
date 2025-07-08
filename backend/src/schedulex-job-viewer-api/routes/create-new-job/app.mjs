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
  region: process.env.AWS_REGION,
});

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const jobTable = process.env.SCHEDULEX_JOB_METADATA_TABLE_NAME;
const s3Bucket = "schx-job-view-test-bucket";

export const createNewJob = async (event, context) => {
  // get the job metadata from the request body
  const jobMetadata = JSON.parse(event.body);

  // create a new entry in the dynamodb table for the job
  const newJob = await createJobInDynamoDB(jobMetadata);

  // generate a pro-signed url for the job to be uploaded to s3
  const presignedUrl = await generatePresignedUrlForJob(newJob);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "hello there! your job has been created and a presigned url has been generated for you to upload your job logs to s3",
      presignedUrl: presignedUrl,
    }),
  };
};

const createJobInDynamoDB = async (jobMetadata) => {
  // create a new entry in the dynamodb table for the job
  const command = new PutItemCommand({
    TableName: jobTable,
    Item: {
      jobId: { S: jobMetadata.jobId },
      companyName: { S: jobMetadata.company_name },
      jobType: { S: jobMetadata.job_type },
      tenantName: { S: jobMetadata.tenant_name },
      totalItemsProcessed: { N: jobMetadata.total_items_processed },
      totalInvalidItems: { N: jobMetadata.total_invalid_items },
      jobTimestamp: { S: jobMetadata.job_timestamp },
    },
    ConditionExpression: "attribute_not_exists(jobId)",
  });

  const response = await dynamoDBClient.send(command);
  console.log("response", response);
  return response;
};

const generatePresignedUrlForJob = async (job) => {
  // generate a presigned url for the job to be uploaded to s3
  const command = new PutObjectCommand({
    Bucket: s3Bucket,
    Key: `${job.jobId}-${job.companyName}`,
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
