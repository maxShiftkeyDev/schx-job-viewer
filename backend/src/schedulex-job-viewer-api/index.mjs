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
    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "hello world - you requested a list of jobs... well it isnt ready yetbut we're getting there!",
      }),
    };
  }

  if (httpMethod === "GET" && path === "/download-job-logs") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "hello world - you requested job logs... well it isnt ready yetbut we're getting there!",
      }),
    };
  }

  if (httpMethod === "POST" && path === "/create-new-job") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          "hello world - you requested to create a new job... well it isnt ready yetbut we're getting there!",
      }),
    };
  }
};
