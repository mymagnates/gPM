<template>
  <q-page class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <!-- Header -->
        <div class="signup-header">
          <h1 class="signup-title">Create Your Account</h1>
          <p class="signup-subtitle">
            Join magnatesPM to manage your property portfolio with ease
          </p>
        </div>

        <!-- Social Login Options -->
        <div class="social-login-section">
          <div class="social-buttons">
            <q-btn
              class="social-btn google-btn"
              @click="signUpWithGoogle"
              :loading="loading.google"
              :disable="loading.email || loading.facebook"
            >
              <q-icon name="fab fa-google" class="social-icon" />
              <span>Continue with Google</span>
            </q-btn>

            <q-btn
              class="social-btn facebook-btn"
              @click="signUpWithFacebook"
              :loading="loading.facebook"
              :disable="loading.email || loading.google"
            >
              <q-icon name="fab fa-facebook-f" class="social-icon" />
              <span>Continue with Facebook</span>
            </q-btn>
          </div>

          <div class="divider">
            <span class="divider-text">or</span>
          </div>
        </div>

        <!-- Email Signup Form -->
        <q-form @submit="signUpWithEmail" class="signup-form">
          <div class="form-section">
            <h3 class="section-title">Sign up with Email</h3>

            <!-- Basic Information -->
            <div class="form-row">
              <q-input
                v-model="form.firstName"
                label="First Name *"
                outlined
                required
                :rules="[(val) => !!val || 'First name is required']"
                class="form-field"
              />
              <q-input
                v-model="form.lastName"
                label="Last Name *"
                outlined
                required
                :rules="[(val) => !!val || 'Last name is required']"
                class="form-field"
              />
            </div>

            <q-input
              v-model="form.email"
              label="Email Address *"
              type="email"
              outlined
              required
              :rules="[
                (val) => !!val || 'Email is required',
                (val) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                  'Please enter a valid email',
              ]"
              class="form-field"
            />

            <q-input
              v-model="form.password"
              label="Password *"
              type="password"
              outlined
              required
              :rules="[
                (val) => !!val || 'Password is required',
                (val) =>
                  val.length >= 8 || 'Password must be at least 8 characters',
                (val) =>
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val) ||
                  'Password must contain uppercase, lowercase, and number',
              ]"
              class="form-field"
            />

            <q-input
              v-model="form.confirmPassword"
              label="Confirm Password *"
              type="password"
              outlined
              required
              :rules="[
                (val) => !!val || 'Please confirm your password',
                (val) => val === form.password || 'Passwords do not match',
              ]"
              class="form-field"
            />

            <!-- Additional Information -->
            <div class="form-row">
              <q-input
                v-model="form.phone"
                label="Phone Number"
                outlined
                mask="(###) ###-####"
                class="form-field"
              />
              <q-select
                v-model="form.userType"
                :options="userTypeOptions"
                label="I am a *"
                outlined
                required
                :rules="[(val) => !!val || 'Please select your user type']"
                class="form-field"
              />
            </div>

            <q-input
              v-model="form.company"
              label="Company/Organization (Optional)"
              outlined
              class="form-field"
            />

            <!-- Terms and Conditions -->
            <div class="terms-section">
              <q-checkbox
                v-model="form.acceptTerms"
                label="I agree to the Terms of Service and Privacy Policy"
                required
                :rules="[(val) => val || 'You must accept the terms']"
              />
              <q-checkbox
                v-model="form.marketingEmails"
                label="I would like to receive marketing emails about new features and updates"
              />
            </div>

            <!-- Submit Button -->
            <q-btn
              type="submit"
              label="Create Account"
              color="primary"
              size="lg"
              class="submit-btn"
              :loading="loading.email"
              :disable="loading.google || loading.facebook"
            />
          </div>
        </q-form>

        <!-- Login Link -->
        <div class="login-link">
          <p>
            Already have an account?
            <router-link to="/login" class="link">Sign in here</router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Success Dialog -->
    <q-dialog v-model="showSuccessDialog" persistent>
      <q-card class="success-dialog">
        <q-card-section class="text-center">
          <q-icon name="check_circle" color="positive" size="4rem" />
          <h3 class="success-title">Account Created Successfully!</h3>
          <p class="success-message">
            Welcome to magnatesPM! Your account has been created and you're now
            signed in.
          </p>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            label="Go to Dashboard"
            color="primary"
            @click="goToDashboard"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth-store";
import firebase from "src/firebase";

export default defineComponent({
  name: "SignupView",

  data() {
    return {
      loading: {
        email: false,
        google: false,
        facebook: false,
      },
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        userType: null,
        company: "",
        acceptTerms: false,
        marketingEmails: false,
      },
      userTypeOptions: [
        { label: "Property Owner", value: "owner" },
        { label: "Property Manager", value: "manager" },
        { label: "Real Estate Agent", value: "agent" },
        { label: "Investor", value: "investor" },
        { label: "Other", value: "other" },
      ],
      showSuccessDialog: false,
    };
  },

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    return { router, authStore };
  },

  methods: {
    async signUpWithGoogle() {
      this.loading.google = true;
      try {
        const result = await firebase.auth.signInWithPopup(
          firebase.auth,
          firebase.googleProvider
        );

        if (result.user) {
          await this.createUserProfile(result.user, "google");
          this.showSuccessMessage();
        }
      } catch (error) {
        console.error("Google signup error:", error);
        this.$q.notify({
          type: "negative",
          message: this.getErrorMessage(error),
          position: "top",
        });
      } finally {
        this.loading.google = false;
      }
    },

    async signUpWithFacebook() {
      this.loading.facebook = true;
      try {
        const result = await firebase.auth.signInWithPopup(
          firebase.auth,
          firebase.facebookProvider
        );

        if (result.user) {
          await this.createUserProfile(result.user, "facebook");
          this.showSuccessMessage();
        }
      } catch (error) {
        console.error("Facebook signup error:", error);
        this.$q.notify({
          type: "negative",
          message: this.getErrorMessage(error),
          position: "top",
        });
      } finally {
        this.loading.facebook = false;
      }
    },

    async signUpWithEmail() {
      this.loading.email = true;
      try {
        const result = await firebase.auth.createUserWithEmailAndPassword(
          firebase.auth,
          this.form.email,
          this.form.password
        );

        if (result.user) {
          // Update user profile with additional information
          await result.user.updateProfile({
            displayName: `${this.form.firstName} ${this.form.lastName}`,
          });

          await this.createUserProfile(result.user, "email");
          this.showSuccessMessage();
        }
      } catch (error) {
        console.error("Email signup error:", error);
        this.$q.notify({
          type: "negative",
          message: this.getErrorMessage(error),
          position: "top",
        });
      } finally {
        this.loading.email = false;
      }
    },

    async createUserProfile(user, provider) {
      try {
        // Create user profile in Firestore
        const userProfile = {
          uid: user.uid,
          email: user.email,
          firstName:
            this.form.firstName || user.displayName?.split(" ")[0] || "",
          lastName:
            this.form.lastName ||
            user.displayName?.split(" ").slice(1).join(" ") ||
            "",
          phone: this.form.phone || "",
          userType: this.form.userType || "other",
          company: this.form.company || "",
          provider: provider,
          marketingEmails: this.form.marketingEmails || false,
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true,
        };

        // Save to Firestore (you'll need to set up Firestore rules)
        // const userRef = doc(firebase.db, "users", user.uid);
        // await setDoc(userRef, userProfile);

        // Update auth store
        this.authStore.setUser({
          ...user,
          profile: userProfile,
        });

        this.$q.notify({
          type: "positive",
          message: "Account created successfully!",
          position: "top",
        });
      } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
      }
    },

    showSuccessMessage() {
      this.showSuccessDialog = true;
    },

    goToDashboard() {
      this.showSuccessDialog = false;
      this.router.push("/");
    },

    getErrorMessage(error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return "An account with this email already exists. Please sign in instead.";
        case "auth/invalid-email":
          return "Please enter a valid email address.";
        case "auth/weak-password":
          return "Password is too weak. Please choose a stronger password.";
        case "auth/popup-closed-by-user":
          return "Signup was cancelled. Please try again.";
        case "auth/popup-blocked":
          return "Popup was blocked. Please allow popups for this site and try again.";
        case "auth/account-exists-with-different-credential":
          return "An account already exists with the same email address but different sign-in credentials.";
        default:
          return "An error occurred during signup. Please try again.";
      }
    },
  },
});
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.signup-container {
  width: 100%;
  max-width: 500px;
}

.signup-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.signup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.signup-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.signup-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.social-login-section {
  margin-bottom: 2rem;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
}

.google-btn {
  background: #fff;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.google-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.facebook-btn {
  background: #1877f2;
  color: white;
}

.facebook-btn:hover {
  background: #166fe5;
}

.social-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  margin-bottom: 1rem;
}

.terms-section {
  margin: 1.5rem 0;
}

.terms-section .q-checkbox {
  margin-bottom: 0.75rem;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.login-link p {
  margin: 0;
  color: #6b7280;
}

.link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

.success-dialog {
  min-width: 400px;
  text-align: center;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 1rem 0 0.5rem 0;
}

.success-message {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .signup-page {
    padding: 1rem;
  }

  .signup-card {
    padding: 1.5rem;
  }

  .signup-title {
    font-size: 1.75rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
