const errorHandler = (fastify) => {
    // Handle errors that occur during request processing
    fastify.setErrorHandler((error, request, reply) => {
      // Log the error
      fastify.log.error(error);
  
      // Customize error response
      const statusCode = error.statusCode || 500;
      const message = statusCode === 500 ? 'Internal Server Error' : error.message;
  
      reply
        .status(statusCode)
        .send({ success: false, message });
    });
  
    // Handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', (error) => {
      fastify.log.error('Uncaught Exception:', error);
      process.exit(1);
    });
  
    process.on('unhandledRejection', (reason, promise) => {
      fastify.log.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  };
  
  export default errorHandler;