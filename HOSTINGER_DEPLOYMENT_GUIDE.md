# Production Deployment Guide for Hostinger

## Updated Reset Password Configuration

The reset password functionality has been updated to handle both local and production environments. Here's what you need to do for Hostinger deployment:

## 1. Supabase Configuration (CRITICAL)

### Update Redirect URLs in Supabase Dashboard:
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update the following fields:

**Site URL:**
```
https://yourdomain.com
```

**Redirect URLs:** (Add both)
```
https://yourdomain.com/reset-password
https://yourdomain.com/#/reset-password
```

Replace `yourdomain.com` with your actual Hostinger domain.

## 2. Environment Variables

### Create `.env.production` file:
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_APP_URL=https://yourdomain.com
```

### Hostinger Environment Variables:
Set these in your Hostinger hosting panel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`

## 3. Build Configuration

### Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
```

## 4. Server Configuration for Hostinger

### .htaccess file (already created):
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Optional: Enable HTTPS redirect
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Set cache headers for static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>
```

## 5. Build and Deploy Commands

### Local build:
```bash
npm run build
```

### Upload to Hostinger:
1. Upload the `dist` folder contents to your domain's public_html directory
2. Make sure `.htaccess` is in the root directory
3. Ensure environment variables are set in Hostinger panel

## 6. Testing the Reset Password

### Test URL Structure:
- **Local:** `http://localhost:5173/reset-password#type=recovery&access_token=...`
- **Production:** `https://yourdomain.com/reset-password?type=recovery&access_token=...`

### Debug Steps:
1. Check browser console for logs on production
2. Verify the email contains correct production URL
3. Test the exact URL from email in a new browser tab
4. Check Supabase logs for any authentication errors

## 7. Common Issues and Solutions

### Issue: "Invalid reset link" error on production
**Solution:** 
- Verify Supabase redirect URLs include your production domain
- Check that environment variables are correctly set in production

### Issue: 404 error when accessing reset-password URL directly
**Solution:** 
- Ensure `.htaccess` file is properly uploaded and configured
- Verify server supports URL rewriting

### Issue: Works locally but not in production
**Solution:** 
- Check browser console for CORS errors
- Verify environment variables match between local and production
- Ensure build process includes all necessary files

## 8. Security Considerations

### Production Security:
- Enable HTTPS (should be automatic on Hostinger)
- Set proper CORS policies in Supabase
- Use environment variables for all sensitive data
- Regularly update dependencies

## 9. Monitoring and Logging

### Production Debugging:
The updated code includes enhanced logging that will help you debug issues in production:

```javascript
console.log('Reset password debug info:', {
  currentUrl: window.location.href,
  hash: hash,
  search: search,
  type: type,
  isAuthenticated: isAuthenticated,
  environment: process.env.NODE_ENV
});
```

Check browser console on production for these logs.

## 10. Email Template Verification

### Supabase Email Template:
In Supabase Dashboard → Authentication → Email Templates → Reset Password:

Ensure the template uses:
```html
<a href="{{ .ConfirmationURL }}">Reset Password</a>
```

The `ConfirmationURL` should automatically use your configured redirect URL.

---

## Quick Checklist:

- [ ] Supabase redirect URLs updated with production domain
- [ ] Environment variables set in Hostinger
- [ ] `.htaccess` file uploaded to root directory
- [ ] Build deployed to public_html
- [ ] Test reset password email on production
- [ ] Check browser console for any errors

If you're still having issues after following this guide, check the browser console logs and let me know what specific errors you're seeing.
