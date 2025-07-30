<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h4>Google Login Test Page</h4>
      <p>This page is specifically for testing Google login functionality.</p>

      <div class="q-mt-lg">
        <q-btn
          color="primary"
          label="Test Google Login"
          @click="testGoogleLogin"
          :loading="loading"
          size="lg"
        />
      </div>

      <div class="q-mt-md">
        <q-btn
          color="secondary"
          label="Check Auth State"
          @click="checkAuthState"
          class="q-mr-sm"
        />
        <q-btn color="warning" label="Clear Console" @click="clearConsole" />
      </div>

      <div class="q-mt-lg">
        <h6>Debug Information:</h6>
        <div class="text-left q-pa-md bg-grey-2 rounded">
          <p><strong>Firebase Auth:</strong> {{ authStatus }}</p>
          <p><strong>Google Provider:</strong> {{ googleProviderStatus }}</p>
          <p><strong>Current User:</strong> {{ currentUser }}</p>
          <p><strong>Last Error:</strong> {{ lastError }}</p>
        </div>
      </div>

      <div class="q-mt-md">
        <q-btn
          flat
          color="primary"
          label="Back to Login"
          @click="$router.push('/login')"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth-store";
import { useQuasar } from "quasar";
import firebase from "../firebase";

export default defineComponent({
  name: "GoogleTestView",
  setup() {
    const authStore = useAuthStore();
    const $q = useQuasar();

    const loading = ref(false);
    const authStatus = ref("Checking...");
    const googleProviderStatus = ref("Checking...");
    const currentUser = ref("None");
    const lastError = ref("None");

    const checkAuthState = () => {
      try {
        authStatus.value = firebase.auth ? "Available" : "Not available";
        googleProviderStatus.value = firebase.googleProvider
          ? "Available"
          : "Not available";
        currentUser.value = firebase.auth.currentUser
          ? `${firebase.auth.currentUser.email} (${firebase.auth.currentUser.displayName})`
          : "No user logged in";
        console.log("Auth state check completed");
      } catch (error) {
        console.error("Auth state check error:", error);
        lastError.value = error.message;
      }
    };

    const clearConsole = () => {
      console.clear();
      lastError.value = "Console cleared";
    };

    const testGoogleLogin = async () => {
      loading.value = true;
      lastError.value = "Testing...";

      try {
        console.log("Starting Google login test...");
        console.log("Firebase auth:", firebase.auth);
        console.log("Google provider:", firebase.googleProvider);

        const result = await authStore.loginWithGoogle();
        console.log("Google login result:", result);

        $q.notify({
          type: "positive",
          message: "Google login test successful!",
        });

        lastError.value = "Success";
        checkAuthState();
      } catch (error) {
        console.error("Google login test failed:", error);
        lastError.value = error.message;

        $q.notify({
          type: "negative",
          message: `Google login test failed: ${error.message}`,
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      checkAuthState();
      console.log("GoogleTestView mounted");
    });

    return {
      loading,
      authStatus,
      googleProviderStatus,
      currentUser,
      lastError,
      testGoogleLogin,
      checkAuthState,
      clearConsole,
    };
  },
});
</script>
