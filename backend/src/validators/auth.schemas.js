const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(128)
});


// middleware generico
function validate(schema) {
  return (req, res, next) => {
    const data = req.method === 'GET' ? req.query : req.body;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const err = new Error('Validation error');
      err.status = 400;
      err.details = parsed.error.flatten();
      return next(err);
    }
    req.validated = parsed.data;
    return next();
  };
}

module.exports = { registerSchema, loginSchema, deleteAccountSchema, validate };
