// this function should expect a s3ObjectName as a body parameter
// it should then check that the s3ObjectName is valid / that the object exists
// then if so it should generate a presigned url to download the object
// it should then return the presigned url

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.PROJECT_REGION,
});

const s3Bucket = "schx-job-view-test-bucket";

const downloadJobLogs = async (event, context) => {
  const s3ObjectName = JSON.parse(event.body).s3ObjectName;
  console.log("s3ObjectName", s3ObjectName);

  const command = new GetObjectCommand({
    Bucket: s3Bucket,
    Key: s3ObjectName,
  });

  const response = await s3Client.send(command);
  console.log("response", response);

  // if the response is not found, return a 404
  if (response.Body === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Job logs not found" }),
    };
  }

  // if the response is found, generate a presigned url to download the object
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 5, // 5 mins
  });
  console.log("url", url);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "hello world - you requested job logs... well here is a link to get them logs baby!",
      presignedUrl: url,
    }),
  };
};

export default downloadJobLogs;
