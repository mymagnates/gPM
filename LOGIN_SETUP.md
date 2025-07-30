# gPM Login System Setup Guide

## Features

✅ Email/Password Login
✅ Google OAuth Login
✅ Facebook OAuth Login
✅ User Registration
✅ Route Protection
✅ Responsive Design
✅ Modern UI

## Firebase Configuration

### 1. Enable Authentication Service

1. Login to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Authentication" in the left menu
4. Click "Get started"

### 2. Enable Sign-in Methods

#### Email/Password Login

1. In the "Sign-in method" tab
2. Click "Email/Password"
3. Enable "Email/Password" and "Email link (passwordless sign-in)"
4. Click "Save"

#### Google Login

1. In the "Sign-in method" tab
2. Click "Google"
3. Enable Google sign-in
4. Add your project support email
5. Click "Save"

#### Facebook Login

1. In the "Sign-in method" tab
2. Click "Facebook"
3. Enable Facebook sign-in
4. Add Facebook App ID and App Secret
5. Click "Save"

### 3. Get Facebook App Credentials

1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing app
3. Get App ID and App Secret from app settings
4. Add OAuth redirect URI: `https://your-project-id.firebaseapp.com/__/auth/handler`

## Project Configuration

### 1. Install Dependencies

The project has already configured necessary dependencies:

- Firebase v9.18.0
- Quasar v2.6.0
- Pinia v2.0.11

### 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Update Firebase Configuration

Update the configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

## Usage

### 1. Start Development Server

```bash
quasar dev
```

### 2. Access Login Page

Open browser and visit `http://localhost:9000/login`

### 3. Test Login Features

- **Email Login**: Enter valid email and password
- **Google Login**: Click "Sign in with Google" button
- **Facebook Login**: Click "Sign in with Facebook" button
- **Register**: Click "Sign Up" to create new account

## File Structure

```
src/
├── pages/
│   └── LoginView.vue          # Login page
├── stores/
│   └── auth-store.js          # Authentication state management
├── firebase.js                # Firebase configuration
├── App.vue                    # Main app component
└── router/
    ├── index.js               # Router configuration and guards
    └── routes.js              # Route definitions
```

## Main Features

### Login Page (`LoginView.vue`)

- Email/password login form
- Google and Facebook social login buttons
- User registration dialog
- Form validation and error handling
- Responsive design

### Authentication Store (`auth-store.js`)

- User state management
- Login/logout methods
- Authentication state listener
- Computed properties (username, email, etc.)

### Route Protection

- Automatically redirect unauthenticated users to login page
- Redirect authenticated users to home page when accessing login page
- Protect pages that require authentication

### Main Layout Integration

- User information display
- Logout functionality
- User dropdown menu

## Custom Styling

The login page uses modern gradient background and card design. You can customize styles by modifying CSS in `LoginView.vue`:

```css
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Troubleshooting

### Common Issues

1. **Google Login Fails**

   - Ensure Google sign-in is properly configured in Firebase Console
   - Check if domain is in authorized domains list

2. **Facebook Login Fails**

   - Ensure Facebook App is configured correctly
   - Check if OAuth redirect URI is correct

3. **Route Guards Not Working**

   - Ensure authentication listener is initialized in `App.vue`
   - Check if route meta information is set correctly

4. **Styling Issues**
   - Ensure Font Awesome icons are enabled
   - Check extras settings in Quasar configuration

### Debugging Tips

1. Open browser developer tools to check console errors
2. Check authentication logs in Firebase Console
3. Use Vue DevTools to inspect component state

## Security Notes

1. Don't expose Firebase private keys in client-side code
2. Use environment variables to manage sensitive configuration
3. Set appropriate authentication rules in Firebase Console
4. Regularly update dependencies to fix security vulnerabilities

## Deployment

1. Build production version:

   ```bash
   quasar build
   ```

2. Deploy to Firebase Hosting:

   ```bash
   firebase deploy
   ```

3. Ensure your production domain is added to authorized domains list in Firebase Console
