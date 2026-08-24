export default errorHandler = (error) => {
  const message = error.message || "internal server error";
  const errStatus = error.status || 500;
  return res.status(errStatus).json({ error: message });
};
