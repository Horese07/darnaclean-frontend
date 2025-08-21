// Social Authentication Service
// This service handles OAuth flows for Google, Facebook, and Apple

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';

// Facebook OAuth Configuration
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';
const FACEBOOK_REDIRECT_URI = import.meta.env.VITE_FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/callback';

// Apple OAuth Configuration
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID || '';
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';

export class SocialAuthService {
  /**
   * Initialize Google OAuth
   */
  static initGoogleAuth(): void {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  /**
   * Google Sign-In using Google Identity Services
   */
  static async googleSignIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid profile email',
        callback: async (response) => {
          try {
            if (response.error) {
              reject(new Error(response.error));
              return;
            }

            // Get user info using the access token
            const userInfo = await this.getGoogleUserInfo(response.access_token);
            
            // Send to our backend
            const result = await this.authenticateWithBackend('google', {
              access_token: response.access_token,
              id_token: response.id_token || '',
            });

            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
      });

      client.requestAccessToken();
    });
  }

  /**
   * Get Google user information
   */
  private static async getGoogleUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    if (!response.ok) {
      throw new Error('Failed to get Google user info');
    }
    return response.json();
  }

  /**
   * Initialize Facebook OAuth
   */
  static initFacebookAuth(): void {
    if (!window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      script.onload = () => {
        window.FB.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };
    }
  }

  /**
   * Facebook Sign-In
   */
  static async facebookSignIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK not loaded'));
        return;
      }

      window.FB.login(async (response) => {
        try {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
            
            // Send to our backend
            const result = await this.authenticateWithBackend('facebook', {
              access_token: accessToken,
            });

            resolve(result);
          } else {
            reject(new Error('Facebook login failed'));
          }
        } catch (error) {
          reject(error);
        }
      }, {
        scope: 'email,public_profile',
        return_scopes: true
      });
    });
  }

  /**
   * Initialize Apple OAuth
   */
  static initAppleAuth(): void {
    if (!window.AppleID) {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  /**
   * Apple Sign-In
   */
  static async appleSignIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window.AppleID) {
        reject(new Error('Apple ID SDK not loaded'));
        return;
      }

      const appleId = new window.AppleID({
        clientId: APPLE_CLIENT_ID,
        scope: 'email name',
        redirectURI: APPLE_REDIRECT_URI,
        state: 'origin:web',
        usePopup: true,
      });

      appleId.signIn().then(async (response) => {
        try {
          // Send to our backend
          const result = await this.authenticateWithBackend('apple', {
            identity_token: response.authorization.id_token,
            authorization_code: response.authorization.code,
          });

          resolve(result);
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Authenticate with our backend
   */
  private static async authenticateWithBackend(provider: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `${provider} authentication failed`);
    }

    return response.json();
  }

  /**
   * Get user's connected social accounts
   */
  static async getSocialAccounts(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/social-accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get social accounts');
    }

    return response.json();
  }

  /**
   * Disconnect social account
   */
  static async disconnectSocial(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/disconnect-social`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect social account');
    }

    return response.json();
  }
}

// Type declarations for global objects
declare global {
  interface Window {
    google: any;
    FB: any;
    AppleID: any;
  }
}

export default SocialAuthService;
