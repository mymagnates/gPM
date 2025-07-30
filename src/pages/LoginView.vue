<template>
  <q-page class="login-page">
    <div class="login-container">
      <q-card class="login-card">
        <q-card-section class="text-center">
          <div class="logo-section">
            <q-icon name="business" size="4rem" color="primary" />
            <h2 class="text-h4 q-mt-md text-weight-bold">gPM</h2>
            <p class="text-subtitle1 text-grey-6">Asset Management System</p>
          </div>
        </q-card-section>

        <q-card-section>
          <!-- Login Form -->
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="email"
              type="email"
              label="Email Address"
              outlined
              :rules="[
                (val) => !!val || 'Please enter email address',
                (val) =>
                  isValidEmail(val) || 'Please enter a valid email address',
              ]"
              lazy-rules
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
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

            <div class="row justify-between items-center">
              <q-checkbox v-model="rememberMe" label="Remember me" />
              <q-btn flat color="primary" label="Forgot Password?" no-caps />
            </div>

            <q-btn
              :loading="loading"
              type="submit"
              color="primary"
              size="lg"
              class="full-width"
              label="Login"
            />

            <div class="text-center q-mt-md">
              <p class="text-grey-6">Don't have an account?</p>
              <q-btn
                flat
                color="primary"
                label="Sign Up"
                @click="showRegister = true"
                no-caps
              />
            </div>
          </q-form>

          <!-- Divider -->
          <div class="divider q-my-lg">
            <span class="divider-text">or</span>
          </div>

          <!-- Social Login Buttons -->
          <div class="social-login q-gutter-md">
            <q-btn
              :loading="googleLoading"
              @click="signInWithGoogle"
              color="white"
              text-color="dark"
              class="full-width social-btn google-btn"
              size="lg"
              no-caps
            >
              <q-icon
                name="img:https://developers.google.com/identity/images/g-logo.png"
                class="q-mr-sm"
              />
              Sign in with Google
            </q-btn>

            <q-btn
              :loading="facebookLoading"
              @click="signInWithFacebook"
              color="primary"
              class="full-width social-btn facebook-btn"
              size="lg"
              no-caps
            >
              <q-icon
                name="img:https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                class="q-mr-sm"
              />
              Sign in with Facebook
            </q-btn>
          </div>
        </q-card-section>
      </q-card>

      <!-- Register Dialog -->
      <q-dialog v-model="showRegister">
        <q-card class="register-card">
          <q-card-section class="text-center">
            <h3 class="text-h5 text-weight-bold">Create New Account</h3>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onRegister" class="q-gutter-md">
              <q-input
                v-model="registerEmail"
                type="email"
                label="Email Address"
                outlined
                :rules="[
                  (val) => !!val || 'Please enter email address',
                  (val) =>
                    isValidEmail(val) || 'Please enter a valid email address',
                ]"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                v-model="registerPassword"
                :type="isRegPwd ? 'password' : 'text'"
                label="Password"
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
                    :name="isRegPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isRegPwd = !isRegPwd"
                  />
                </template>
              </q-input>

              <q-input
                v-model="confirmPassword"
                :type="isConfirmPwd ? 'password' : 'text'"
                label="Confirm Password"
                outlined
                :rules="[
                  (val) => !!val || 'Please confirm password',
                  (val) => val === registerPassword || 'Passwords do not match',
                ]"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isConfirmPwd = !isConfirmPwd"
                  />
                </template>
              </q-input>

              <div class="row q-gutter-md">
                <q-btn
                  flat
                  label="Cancel"
                  @click="showRegister = false"
                  class="col"
                />
                <q-btn
                  :loading="registerLoading"
                  type="submit"
                  color="primary"
                  label="Register"
                  class="col"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "../stores/auth-store";

export default {
  name: "LoginView",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const authStore = useAuthStore();

    // Reactive data
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const isPwd = ref(true);
    const loading = ref(false);
    const googleLoading = ref(false);
    const facebookLoading = ref(false);

    // Register related
    const showRegister = ref(false);
    const registerEmail = ref("");
    const registerPassword = ref("");
    const confirmPassword = ref("");
    const isRegPwd = ref(true);
    const isConfirmPwd = ref(true);
    const registerLoading = ref(false);

    // Email validation
    const isValidEmail = (email) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };

    // Email password login
    const onSubmit = async () => {
      loading.value = true;
      try {
        await authStore.login(email.value, password.value);
        showNotification("Login successful!", "positive");
        router.push("/");
      } catch (error) {
        console.error("Login error:", error);
        let message = "Login failed";
        switch (error.code) {
          case "auth/user-not-found":
            message = "User not found";
            break;
          case "auth/wrong-password":
            message = "Wrong password";
            break;
          case "auth/invalid-email":
            message = "Invalid email format";
            break;
          case "auth/user-disabled":
            message = "Account is disabled";
            break;
          default:
            message = error.message;
        }
        showNotification(message, "negative");
      } finally {
        loading.value = false;
      }
    };

    // Helper function for notifications
    const showNotification = (message, type = "info") => {
      try {
        if ($q.notify) {
          $q.notify({
            type: type,
            message: message,
          });
        } else {
          // Fallback to alert if notify is not available
          alert(`${type.toUpperCase()}: ${message}`);
        }
      } catch (error) {
        console.error("Notification error:", error);
        alert(`${type.toUpperCase()}: ${message}`);
      }
    };

    // Google login
    const signInWithGoogle = async () => {
      googleLoading.value = true;
      try {
        await authStore.loginWithGoogle();
        showNotification("Google login successful!", "positive");
        router.push("/");
      } catch (error) {
        console.error("Google login error:", error);
        showNotification("Google login failed: " + error.message, "negative");
      } finally {
        googleLoading.value = false;
      }
    };

    // Facebook login
    const signInWithFacebook = async () => {
      facebookLoading.value = true;
      try {
        await authStore.loginWithFacebook();
        showNotification("Facebook login successful!", "positive");
        router.push("/");
      } catch (error) {
        console.error("Facebook login error:", error);
        showNotification("Facebook login failed: " + error.message, "negative");
      } finally {
        facebookLoading.value = false;
      }
    };

    // Register
    const onRegister = async () => {
      registerLoading.value = true;
      try {
        await authStore.register(registerEmail.value, registerPassword.value);
        showNotification("Registration successful!", "positive");
        showRegister.value = false;
        // Clear register form
        registerEmail.value = "";
        registerPassword.value = "";
        confirmPassword.value = "";
      } catch (error) {
        console.error("Registration error:", error);
        let message = "Registration failed";
        switch (error.code) {
          case "auth/email-already-in-use":
            message = "Email already in use";
            break;
          case "auth/invalid-email":
            message = "Invalid email format";
            break;
          case "auth/weak-password":
            message = "Password is too weak";
            break;
          default:
            message = error.message;
        }
        showNotification(message, "negative");
      } finally {
        registerLoading.value = false;
      }
    };

    return {
      email,
      password,
      rememberMe,
      isPwd,
      loading,
      googleLoading,
      facebookLoading,
      showRegister,
      registerEmail,
      registerPassword,
      confirmPassword,
      isRegPwd,
      isConfirmPwd,
      registerLoading,
      isValidEmail,
      onSubmit,
      signInWithGoogle,
      signInWithFacebook,
      onRegister,
      showNotification,
    };
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.logo-section {
  padding: 20px 0;
}

.divider {
  position: relative;
  text-align: center;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider-text {
  background: white;
  padding: 0 16px;
  color: #666;
  font-size: 14px;
}

.social-login {
  margin-top: 20px;
}

.social-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.google-btn {
  border: 1px solid #e0e0e0;
}

.google-btn:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.facebook-btn:hover {
  transform: translateY(-2px);
}

.register-card {
  min-width: 400px;
  border-radius: 16px;
}

@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }

  .register-card {
    min-width: 90vw;
  }
}
</style>
