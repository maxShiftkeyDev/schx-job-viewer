const downloadJobLogs = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "hello world - you requested job logs... well it isnt ready yet but we're getting there!",
    }),
  };
};

export default downloadJobLogs;
