const listJobs = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "hello world - you requested a list of jobs... well it isnt ready yet but we're getting there!",
    }),
  };
};

export default listJobs;
