# Deploy Instructions

## Frontend (Netlify)

1. **Netlify Setup:**
   ```bash
   # Build command
   npm run build:frontend
   
   # Publish directory
   dist
   ```

2. **Environment Variables (Netlify):**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://your-backend.vercel.app
   VITE_TELEGRAM_BOT_USERNAME=your_bot_username
   ```

3. **Netlify Configuration:**
   - The `netlify.toml` file is already configured
   - Redirects are set up for SPA routing

## Backend (Vercel)

1. **Vercel Setup:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables (Vercel):**
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   VITE_SUPABASE_URL=your_supabase_url
   NODE_ENV=production
   ```

3. **Vercel Configuration:**
   - The `vercel.json` file is already configured
   - API routes are set up properly
   - Serverless functions are optimized

## Deployment Steps

### 1. Deploy Backend to Vercel
```bash
cd your-project
vercel --prod
```

### 2. Update Frontend Config
Update the `VITE_API_URL` in Netlify environment variables with your Vercel URL.

### 3. Deploy Frontend to Netlify
```bash
# Connect your repo to Netlify
# Set build command: npm run build:frontend
# Set publish directory: dist
# Add environment variables
```

### 4. Update Telegram Webhook
Update the webhook URL in your Telegram bot settings to point to your Vercel backend:
```
https://your-backend.vercel.app/webhook/telegram
```

## Performance Optimizations

1. **Frontend Optimizations:**
   - Code splitting with manual chunks
   - Lazy loading of components
   - Optimized bundle size

2. **Backend Optimizations:**
   - Serverless functions
   - Optimized database queries
   - CORS properly configured

3. **CDN Benefits:**
   - Netlify CDN for frontend assets
   - Vercel Edge Network for API responses
   - Global distribution

## Monitoring

1. **Netlify:**
   - Check build logs
   - Monitor function invocations
   - Set up form handling if needed

2. **Vercel:**
   - Monitor function execution
   - Check error logs
   - Set up analytics

## Troubleshooting

1. **CORS Issues:**
   - Ensure frontend URL is added to CORS origins in backend
   - Check environment variables

2. **API Connection:**
   - Verify VITE_API_URL is correct
   - Check network requests in browser dev tools

3. **Database Connection:**
   - Verify Supabase credentials
   - Check database connection in Vercel logs