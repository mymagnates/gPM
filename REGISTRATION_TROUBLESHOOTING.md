# Registration Troubleshooting Guide

## Common Registration Issues and Solutions

### 1. Firebase Console Configuration

**Check these settings in Firebase Console:**

1. **Enable Email/Password Authentication:**

   - Go to Authentication > Sign-in method
   - Click on "Email/Password"
   - Enable "Email/Password" sign-in
   - Enable "Email link (passwordless sign-in)" if needed
   - Click "Save"

2. **Check Authorized Domains:**
   - Go to Authentication > Settings > Authorized domains
   - Add `localhost` for development
   - Add your production domain when deploying

### 2. Common Error Codes and Solutions

#### `auth/email-already-in-use`

**Problem:** Email address is already registered
**Solution:**

- Use a different email address
- Try signing in instead of registering
- Check if you already have an account

#### `auth/invalid-email`

**Problem:** Email format is invalid
**Solution:**

- Check email format (must include @ and domain)
- Remove any extra spaces
- Use a valid email address

#### `auth/weak-password`

**Problem:** Password doesn't meet Firebase requirements
**Solution:**

- Use at least 6 characters
- Consider using a stronger password with:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters

#### `auth/operation-not-allowed`

**Problem:** Email/password registration is disabled
**Solution:**

- Enable Email/Password in Firebase Console
- Contact administrator if you don't have access

#### `auth/network-request-failed`

**Problem:** Network connectivity issue
**Solution:**

- Check internet connection
- Try again later
- Check if Firebase services are available

### 3. Testing Steps

1. **Use the registration test page:**

   - Visit `http://localhost:9000/register-test`
   - Enter a valid email and password
   - Click "Test Registration"
   - Check debug information

2. **Check browser console:**

   - Open Developer Tools (F12)
   - Look for error messages
   - Check Network tab for failed requests

3. **Verify Firebase configuration:**
   - Check if `firebase.auth` is available
   - Check if `firebase.createUserWithEmailAndPassword` is available

### 4. Code Issues

**Check your registration function:**

```javascript
const register = async (email, password) => {
  try {
    const result = await firebase.createUserWithEmailAndPassword(
      firebase.auth,
      email,
      password
    );
    return result;
  } catch (error) {
    console.error("Registration error:", error);
    // Handle specific errors
    throw error;
  }
};
```

**Verify form validation:**

```javascript
// Email validation
const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// Password validation
const isValidPassword = (password) => {
  return password.length >= 6;
};
```

### 5. Development vs Production

**Development (localhost):**

- Make sure `localhost` is in authorized domains
- Test with valid email addresses
- Check console for detailed error messages

**Production:**

- Add your production domain to authorized domains
- Ensure HTTPS is enabled
- Test with real email addresses

### 6. Debug Information

**Add this to your registration component:**

```javascript
const debugRegistration = async (email, password) => {
  console.log("Registration attempt:");
  console.log("Email:", email);
  console.log("Password length:", password.length);
  console.log("Firebase auth:", firebase.auth);
  console.log("Create user function:", firebase.createUserWithEmailAndPassword);

  try {
    const result = await firebase.createUserWithEmailAndPassword(
      firebase.auth,
      email,
      password
    );
    console.log("Registration successful:", result);
  } catch (error) {
    console.error("Registration failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  }
};
```

### 7. Alternative Solutions

**If registration still doesn't work:**

1. **Check Firebase project settings:**

   - Verify you're using the correct Firebase project
   - Check if the project is active and not suspended

2. **Try different browsers:**

   - Test in Chrome, Firefox, Safari
   - Clear browser cache and cookies

3. **Use Firebase CLI for testing:**
   ```bash
   firebase auth:export users.json
   ```

### 8. Security Considerations

1. **Password requirements:**

   - Minimum 6 characters (Firebase requirement)
   - Consider implementing stronger password policies

2. **Email verification:**

   - Consider enabling email verification
   - Implement email confirmation flow

3. **Rate limiting:**
   - Be aware of Firebase rate limits
   - Implement proper error handling

### 9. Testing Checklist

- [ ] Email/Password enabled in Firebase Console
- [ ] Domain added to authorized domains
- [ ] Valid email format
- [ ] Password meets minimum requirements (6+ characters)
- [ ] No network connectivity issues
- [ ] Browser console shows no errors
- [ ] Firebase configuration is correct
- [ ] Testing on localhost:9000

### 10. Quick Fixes

1. **Clear browser data:**

   - Clear cookies and cache for localhost
   - Try incognito/private mode

2. **Check Firebase status:**

   - Visit [Firebase Status Page](https://status.firebase.google.com/)
   - Check if services are operational

3. **Verify project configuration:**
   - Double-check Firebase config in your code
   - Ensure you're using the correct project ID

### 11. Common Mistakes

1. **Using invalid email format**
2. **Password too short (less than 6 characters)**
3. **Not handling async/await properly**
4. **Missing error handling**
5. **Using wrong Firebase project**
6. **Not checking Firebase Console settings**

### 12. Getting Help

If you're still having issues:

1. **Check Firebase documentation:**

   - [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
   - [Email/Password Authentication](https://firebase.google.com/docs/auth/web/password-auth)

2. **Use Firebase support:**

   - [Firebase Support](https://firebase.google.com/support)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

3. **Check error logs:**
   - Firebase Console > Authentication > Users
   - Check for failed registration attempts
