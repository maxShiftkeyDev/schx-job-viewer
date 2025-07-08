const createNewJob = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "hello world - you requested to create a new job... well it isnt ready yet but we're getting there!",
    }),
  };
};

export default createNewJob;
