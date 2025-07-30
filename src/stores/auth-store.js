import { defineStore } from "pinia";
import { ref, computed } from "vue";
import firebase from "../firebase";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const loading = ref(false);

  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email || "");
  const userName = computed(
    () => user.value?.displayName || user.value?.email || ""
  );

  // Listen for authentication state changes
  const initAuthListener = () => {
    firebase.auth.onAuthStateChanged((authUser) => {
      user.value = authUser;
      console.log("Auth state changed:", authUser);
    });
  };

  // Login method
  const login = async (email, password) => {
    loading.value = true;
    try {
      const result = await firebase.signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      return result;
    } finally {
      loading.value = false;
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    loading.value = true;
    try {
      const result = await firebase.signInWithPopup(
        firebase.auth,
        firebase.googleProvider
      );
      return result;
    } catch (error) {
      console.error("Google login error:", error);

      // Handle specific Google login errors
      if (error.code === "auth/popup-blocked") {
        throw new Error(
          "Popup was blocked by browser. Please allow popups for this site."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Login was cancelled by user.");
      } else if (error.code === "auth/unauthorized-domain") {
        throw new Error(
          "This domain is not authorized for Google login. Please contact administrator."
        );
      } else if (error.code === "auth/operation-not-allowed") {
        throw new Error(
          "Google sign-in is not enabled. Please contact administrator to enable Google authentication."
        );
      } else if (error.code === "auth/network-request-failed") {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Facebook login
  const loginWithFacebook = async () => {
    loading.value = true;
    try {
      const result = await firebase.signInWithPopup(
        firebase.auth,
        firebase.facebookProvider
      );
      return result;
    } catch (error) {
      console.error("Facebook login error:", error);

      // Handle specific Facebook login errors
      if (error.code === "auth/popup-blocked") {
        throw new Error(
          "Popup was blocked by browser. Please allow popups for this site."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Login was cancelled by user.");
      } else if (error.code === "auth/unauthorized-domain") {
        throw new Error(
          "This domain is not authorized for Facebook login. Please contact administrator."
        );
      } else if (error.code === "auth/operation-not-allowed") {
        throw new Error(
          "Facebook sign-in is not enabled. Please contact administrator to enable Facebook authentication."
        );
      } else if (error.code === "auth/network-request-failed") {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Register
  const register = async (email, password) => {
    loading.value = true;
    try {
      const result = await firebase.createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      return result;
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific registration errors
      if (error.code === "auth/email-already-in-use") {
        throw new Error(
          "Email already in use. Please try a different email or sign in."
        );
      } else if (error.code === "auth/invalid-email") {
        throw new Error(
          "Invalid email format. Please enter a valid email address."
        );
      } else if (error.code === "auth/weak-password") {
        throw new Error(
          "Password is too weak. Please use at least 6 characters."
        );
      } else if (error.code === "auth/operation-not-allowed") {
        throw new Error(
          "Email/password registration is not enabled. Please contact administrator."
        );
      } else if (error.code === "auth/network-request-failed") {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }

      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    loading.value = true;
    try {
      await firebase.signOut(firebase.auth);
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    user,
    loading,

    // Computed properties
    isAuthenticated,
    userEmail,
    userName,

    // Methods
    initAuthListener,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
  };
});
