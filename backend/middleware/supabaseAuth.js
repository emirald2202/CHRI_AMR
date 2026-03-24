const jwt = require('jsonwebtoken');

/**
 * Middleware to verify Supabase JWT
 * Supabase JWTs are signed with the project's JWT Secret (found in API settings)
 */
const verifySupabaseToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // SUPABASE_JWT_SECRET must be in your .env
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    
    // Supabase stores user info in the token
    // sub is the supabaseId, email is the user's email
    req.supabaseUser = {
      id: decoded.sub,
      email: decoded.email,
      phone: decoded.phone || decoded.phone_number
    };
    
    next();
  } catch (error) {
    console.error('Supabase token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifySupabaseToken;
