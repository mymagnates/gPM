<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h4>Registration Test Page</h4>
      <p>
        This page is specifically for testing user registration functionality.
      </p>

      <div class="q-mt-lg">
        <q-card class="register-test-card">
          <q-card-section>
            <q-form @submit="testRegistration" class="q-gutter-md">
              <q-input
                v-model="testEmail"
                type="email"
                label="Test Email"
                outlined
                :rules="[
                  (val) => !!val || 'Please enter email',
                  (val) => isValidEmail(val) || 'Please enter valid email',
                ]"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                v-model="testPassword"
                :type="isPwd ? 'password' : 'text'"
                label="Test Password"
                outlined
                :rules="[
                  (val) => !!val || 'Please enter password',
                  (val) =>
                    val.length >= 6 || 'Password must be at least 6 characters',
                ]"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-btn
                :loading="loading"
                type="submit"
                color="primary"
                label="Test Registration"
                size="lg"
                class="full-width"
              />
            </q-form>
          </q-card-section>
        </q-card>
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
          <p>
            <strong>Email/Password Enabled:</strong> {{ emailPasswordStatus }}
          </p>
          <p><strong>Current User:</strong> {{ currentUser }}</p>
          <p><strong>Last Error:</strong> {{ lastError }}</p>
          <p><strong>Test Email:</strong> {{ testEmail }}</p>
          <p><strong>Password Length:</strong> {{ testPassword.length }}</p>
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
  name: "RegisterTestView",
  setup() {
    const authStore = useAuthStore();
    const $q = useQuasar();

    const loading = ref(false);
    const isPwd = ref(true);
    const testEmail = ref("");
    const testPassword = ref("");
    const authStatus = ref("Checking...");
    const emailPasswordStatus = ref("Checking...");
    const currentUser = ref("None");
    const lastError = ref("None");

    const isValidEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };

    const checkAuthState = () => {
      try {
        authStatus.value = firebase.auth ? "Available" : "Not available";
        emailPasswordStatus.value = firebase.createUserWithEmailAndPassword
          ? "Available"
          : "Not available";
        currentUser.value = firebase.auth.currentUser
          ? `${firebase.auth.currentUser.email} (${
              firebase.auth.currentUser.displayName || "No name"
            })`
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

    const testRegistration = async () => {
      loading.value = true;
      lastError.value = "Testing registration...";

      try {
        console.log("Starting registration test...");
        console.log("Email:", testEmail.value);
        console.log("Password length:", testPassword.value.length);
        console.log("Firebase auth:", firebase.auth);
        console.log(
          "Create user function:",
          firebase.createUserWithEmailAndPassword
        );

        const result = await authStore.register(
          testEmail.value,
          testPassword.value
        );
        console.log("Registration result:", result);

        $q.notify({
          type: "positive",
          message: "Registration test successful!",
        });

        lastError.value = "Success";
        checkAuthState();

        // Clear form after successful registration
        testEmail.value = "";
        testPassword.value = "";
      } catch (error) {
        console.error("Registration test failed:", error);
        lastError.value = error.message;

        $q.notify({
          type: "negative",
          message: `Registration test failed: ${error.message}`,
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      checkAuthState();
      console.log("RegisterTestView mounted");
    });

    return {
      loading,
      isPwd,
      testEmail,
      testPassword,
      authStatus,
      emailPasswordStatus,
      currentUser,
      lastError,
      isValidEmail,
      testRegistration,
      checkAuthState,
      clearConsole,
    };
  },
});
</script>

<style scoped>
.register-test-card {
  max-width: 400px;
  margin: 0 auto;
}
</style>
