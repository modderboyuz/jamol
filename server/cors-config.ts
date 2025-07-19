// CORS configuration for different environments
export const corsConfig = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://localhost:3000',
      'https://localhost:5000',
      // Add your Netlify domain here
      /\.netlify\.app$/,
      /\.vercel\.app$/,
      // Add your custom domains here
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-telegram-id',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours
};