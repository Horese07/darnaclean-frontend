# Social Authentication Setup Guide

This guide explains how to set up social authentication (Google, Facebook, Apple) for the DarnaClean application.

## Prerequisites

- Google Cloud Console account
- Facebook Developer account
- Apple Developer account (for Apple Sign-In)

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API and Google Identity Services API

### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "DarnaClean"
   - User support email: Your email
   - Developer contact information: Your email

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
5. Copy the Client ID

### Step 4: Add to Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details

### Step 2: Add Facebook Login Product
1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" platform
4. Add your site URL: `http://localhost:3000`

### Step 3: Configure OAuth Settings
1. Go to "Facebook Login" > "Settings"
2. Add Valid OAuth Redirect URIs:
   - `http://localhost:3000/auth/callback`
3. Copy the App ID

### Step 4: Add to Environment Variables
```env
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
VITE_FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/callback
```

## 3. Apple Sign-In Setup

### Step 1: Apple Developer Account
1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Accept the Apple Developer Agreement

### Step 2: Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" > "+"
3. Choose "App IDs" > "App"
4. Fill in app details
5. Enable "Sign In with Apple" capability

### Step 3: Create Service ID
1. Go to "Identifiers" > "+"
2. Choose "Services IDs" > "Services"
3. Fill in details and enable "Sign In with Apple"
4. Configure domains and redirect URLs

### Step 4: Add to Environment Variables
```env
VITE_APPLE_CLIENT_ID=your_apple_client_id_here
VITE_APPLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

## 4. Backend Configuration

The backend is already configured to handle social authentication. Make sure you have:

1. Run the migration: `php artisan migrate`
2. The social authentication routes are active
3. Your `.env` file has the correct database configuration

## 5. Testing Social Authentication

### Development Testing
1. Start the backend: `php artisan serve`
2. Start the frontend: `npm run dev`
3. Navigate to `/auth` and test social login buttons
4. Check browser console for any errors

### Production Considerations
1. Update redirect URIs to your production domain
2. Ensure HTTPS is enabled
3. Configure proper CORS settings
4. Set up proper error logging

## 6. Security Notes

### Important Security Measures
1. **Never expose OAuth secrets in frontend code**
2. **Always verify tokens on the backend**
3. **Use HTTPS in production**
4. **Implement proper CSRF protection**
5. **Rate limit authentication attempts**

### Token Verification
The current implementation includes basic token verification. For production:
- Implement proper JWT verification for Google and Apple
- Use Facebook's Graph API to verify Facebook tokens
- Add token expiration handling
- Implement refresh token logic

## 7. Troubleshooting

### Common Issues
1. **"Invalid redirect URI"**: Check your OAuth app configuration
2. **"App not configured"**: Ensure your app is properly set up in the provider's console
3. **CORS errors**: Check backend CORS configuration
4. **Token validation failures**: Verify your OAuth app settings

### Debug Mode
Enable debug logging in your browser console to see detailed error messages.

## 8. Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Apple Sign-In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your OAuth app configuration
3. Ensure all environment variables are set correctly
4. Check the Laravel logs for backend errors
