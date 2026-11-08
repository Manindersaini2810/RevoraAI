export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err.errors) {
      const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    next(err);
  }
};
