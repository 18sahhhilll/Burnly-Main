const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Please provide a valid full name' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  if (!password || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  next();
};

export const validateCreateScenario = (req, res, next) => {
  const { title, data } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Scenario title is required' });
  }

  if (data !== undefined && (typeof data !== 'object' || data === null || Array.isArray(data))) {
    return res.status(400).json({ error: 'Scenario data must be an object' });
  }

  next();
};

export const validateUpdateScenario = (req, res, next) => {
  const { title, data } = req.body || {};

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Scenario title cannot be empty' });
  }

  if (data !== undefined && (typeof data !== 'object' || data === null || Array.isArray(data))) {
    return res.status(400).json({ error: 'Scenario data must be an object' });
  }

  next();
};

export const validateCreateVenture = (req, res, next) => {
  const { name } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Venture name is required' });
  }

  next();
};

export const validateUpdateVenture = (req, res, next) => {
  const { name } = req.body || {};

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return res.status(400).json({ error: 'Venture name cannot be empty' });
  }

  next();
};
