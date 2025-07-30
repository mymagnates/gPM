# Google Login Troubleshooting Guide

## Common Issues and Solutions

### 1. Popup Blocked by Browser

**Symptoms:**

- No popup appears when clicking Google login button
- Console shows "auth/popup-blocked" error

**Solutions:**

1. **Allow popups for localhost:9000**

   - Click the popup blocker icon in your browser's address bar
   - Select "Always allow popups from localhost:9000"

2. **Disable popup blocker temporarily**

   - Chrome: Settings > Privacy and security > Site Settings > Pop-ups and redirects
   - Firefox: Settings > Privacy & Security > Permissions > Block pop-up windows

3. **Use incognito/private mode**
   - Sometimes popup blockers are less aggressive in private mode

### 2. Firebase Console Configuration

**Check these settings in Firebase Console:**

1. **Enable Google Sign-in:**

   - Go to Authentication > Sign-in method
   - Click on Google
   - Enable Google sign-in
   - Add your project support email

2. **Authorized Domains:**

   - Go to Authentication > Settings > Authorized domains
   - Add `localhost` for development
   - Add your production domain when deploying

3. **OAuth 2.0 Client IDs:**
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Ensure you have a Web application OAuth 2.0 client ID
   - Add `http://localhost:9000` to Authorized JavaScript origins

### 3. Google Cloud Console Configuration

**Required Settings:**

1. **Enable Google+ API:**

   - Go to Google Cloud Console > APIs & Services > Library
   - Search for "Google+ API" and enable it

2. **Configure OAuth Consent Screen:**

   - Go to APIs & Services > OAuth consent screen
   - Set up the consent screen with your app information
   - Add test users if in testing mode

3. **Create OAuth 2.0 Credentials:**
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID for Web application
   - Add authorized origins:
     - `http://localhost:9000`
     - `http://localhost:8080`
     - Your production domain

### 4. Code Issues

**Check your Firebase configuration:**

```javascript
// Make sure your firebaseConfig is correct
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

**Verify Google Provider setup:**

```javascript
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");
googleProvider.setCustomParameters({
  prompt: "select_account",
});
```

### 5. Testing Steps

1. **Use the test page:**

   - Visit `http://localhost:9000/google-test`
   - Click "Check Auth State" to verify Firebase is working
   - Click "Test Google Login" to test the popup

2. **Check browser console:**

   - Open Developer Tools (F12)
   - Look for any error messages
   - Check Network tab for failed requests

3. **Verify Firebase initialization:**
   - Check if `firebase.auth` is available
   - Check if `firebase.googleProvider` is configured

### 6. Development vs Production

**Development (localhost):**

- Use `http://localhost:9000` in authorized origins
- Make sure popup blockers are disabled
- Test in incognito mode if needed

**Production:**

- Add your production domain to Firebase authorized domains
- Update OAuth 2.0 client ID with production domain
- Ensure HTTPS is enabled

### 7. Alternative Solutions

**If popup still doesn't work:**

1. **Use redirect instead of popup:**

   ```javascript
   import { signInWithRedirect } from "firebase/auth";

   const loginWithGoogle = async () => {
     try {
       await signInWithRedirect(firebase.auth, firebase.googleProvider);
     } catch (error) {
       console.error("Google login error:", error);
     }
   };
   ```

2. **Check for browser compatibility:**

   - Test in different browsers (Chrome, Firefox, Safari)
   - Update to latest browser version

3. **Clear browser cache and cookies:**
   - Clear all site data for localhost
   - Try in incognito/private mode

### 8. Debug Information

**Add this to your login component for debugging:**

```javascript
const debugGoogleLogin = async () => {
  console.log("Firebase auth:", firebase.auth);
  console.log("Google provider:", firebase.googleProvider);
  console.log("Current user:", firebase.auth.currentUser);

  try {
    const result = await firebase.signInWithPopup(
      firebase.auth,
      firebase.googleProvider
    );
    console.log("Login successful:", result);
  } catch (error) {
    console.error("Login failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  }
};
```

### 9. Common Error Codes

- `auth/popup-blocked`: Browser blocked the popup
- `auth/popup-closed-by-user`: User closed the popup
- `auth/unauthorized-domain`: Domain not authorized in Firebase
- `auth/network-request-failed`: Network connectivity issue
- `auth/operation-not-allowed`: Google sign-in not enabled in Firebase

### 10. Final Checklist

- [ ] Google sign-in enabled in Firebase Console
- [ ] Domain added to authorized domains
- [ ] OAuth 2.0 client ID configured correctly
- [ ] Popup blockers disabled
- [ ] Testing on localhost:9000
- [ ] Browser console shows no errors
- [ ] Firebase configuration is correct
- [ ] Google+ API is enabled in Google Cloud Console
