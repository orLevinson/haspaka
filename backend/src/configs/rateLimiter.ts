const rateLimiterConfig = {
  points: process.env.ENV == "testing" ? 1000 : 10, // maximum number of requests allowed
  duration: 1, // time frame in seconds
};

export default rateLimiterConfig;
