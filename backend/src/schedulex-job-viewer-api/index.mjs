import listJobs from "./routes/list-jobs/app.mjs";
import downloadJobLogs from "./routes/download-job-logs/app.mjs";
import createNewJob from "./routes/create-new-job/app.mjs";

export const handler = async (event, context) => {
  // handle cors options here
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    };
  }

  // handle the actual request here
  const { httpMethod, path } = event;

  if (httpMethod === "GET" && path === "/") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello world - you didnt get an error, so that's a good sign!",
      }),
    };
  }

  if (httpMethod === "GET" && path === "/list-jobs") {
    return listJobs(event, context);
  }

  if (httpMethod === "GET" && path === "/download-job-logs") {
    return downloadJobLogs(event, context);
  }

  if (httpMethod === "POST" && path === "/create-new-job") {
    return createNewJob(event, context);
  }
};
