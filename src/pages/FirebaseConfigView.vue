<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h4>Firebase Configuration Check</h4>
      <p>
        This page helps you verify your Firebase configuration and
        authentication settings.
      </p>

      <div class="q-mt-lg">
        <q-card class="config-check-card">
          <q-card-section>
            <div class="text-left q-gutter-md">
              <div
                v-for="(check, index) in configChecks"
                :key="index"
                class="config-item"
              >
                <div class="row items-center">
                  <q-icon
                    :name="
                      check.status === 'success'
                        ? 'check_circle'
                        : check.status === 'error'
                        ? 'error'
                        : 'help'
                    "
                    :color="
                      check.status === 'success'
                        ? 'positive'
                        : check.status === 'error'
                        ? 'negative'
                        : 'warning'
                    "
                    class="q-mr-sm"
                  />
                  <div>
                    <div class="text-weight-medium">{{ check.name }}</div>
                    <div class="text-caption">{{ check.description }}</div>
                    <div v-if="check.value" class="text-caption text-grey">
                      {{ check.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-mt-md">
        <q-btn
          color="primary"
          label="Refresh Checks"
          @click="runChecks"
          :loading="loading"
          class="q-mr-sm"
        />
        <q-btn color="secondary" label="Copy Config" @click="copyConfig" />
      </div>

      <div class="q-mt-lg">
        <h6>Firebase Configuration:</h6>
        <div class="text-left q-pa-md bg-grey-2 rounded">
          <pre class="text-caption">{{ firebaseConfig }}</pre>
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
import firebase from "../firebase";

export default defineComponent({
  name: "FirebaseConfigView",
  setup() {
    const loading = ref(false);
    const configChecks = ref([]);
    const firebaseConfig = ref("");

    const runChecks = () => {
      loading.value = true;

      const checks = [
        {
          name: "Firebase App",
          description: "Check if Firebase app is initialized",
          status: "pending",
          value: null,
        },
        {
          name: "Firebase Auth",
          description: "Check if Firebase Auth is available",
          status: "pending",
          value: null,
        },
        {
          name: "Firebase Config",
          description: "Check Firebase configuration",
          status: "pending",
          value: null,
        },
        {
          name: "Google Provider",
          description: "Check Google Auth Provider",
          status: "pending",
          value: null,
        },
        {
          name: "Facebook Provider",
          description: "Check Facebook Auth Provider",
          status: "pending",
          value: null,
        },
        {
          name: "Email/Password Auth",
          description: "Check Email/Password authentication functions",
          status: "pending",
          value: null,
        },
      ];

      // Check 1: Firebase App
      try {
        if (firebase.auth && firebase.auth.app) {
          checks[0].status = "success";
          checks[0].value = `App: ${firebase.auth.app.name}`;
        } else {
          checks[0].status = "error";
          checks[0].value = "Firebase app not found";
        }
      } catch (error) {
        checks[0].status = "error";
        checks[0].value = error.message;
      }

      // Check 2: Firebase Auth
      try {
        if (firebase.auth) {
          checks[1].status = "success";
          checks[1].value = "Auth service available";
        } else {
          checks[1].status = "error";
          checks[1].value = "Auth service not available";
        }
      } catch (error) {
        checks[1].status = "error";
        checks[1].value = error.message;
      }

      // Check 3: Firebase Config
      try {
        if (firebase.auth && firebase.auth.app && firebase.auth.app.options) {
          const config = firebase.auth.app.options;
          checks[2].status = "success";
          checks[2].value = `Project: ${config.projectId}`;
        } else {
          checks[2].status = "error";
          checks[2].value = "Configuration not found";
        }
      } catch (error) {
        checks[2].status = "error";
        checks[2].value = error.message;
      }

      // Check 4: Google Provider
      try {
        if (firebase.googleProvider) {
          checks[3].status = "success";
          checks[3].value = "Google provider configured";
        } else {
          checks[3].status = "error";
          checks[3].value = "Google provider not found";
        }
      } catch (error) {
        checks[3].status = "error";
        checks[3].value = error.message;
      }

      // Check 5: Facebook Provider
      try {
        if (firebase.facebookProvider) {
          checks[4].status = "success";
          checks[4].value = "Facebook provider configured";
        } else {
          checks[4].status = "error";
          checks[4].value = "Facebook provider not found";
        }
      } catch (error) {
        checks[4].status = "error";
        checks[4].value = error.message;
      }

      // Check 6: Email/Password Auth
      try {
        if (
          firebase.createUserWithEmailAndPassword &&
          firebase.signInWithEmailAndPassword
        ) {
          checks[5].status = "success";
          checks[5].value = "Email/Password functions available";
        } else {
          checks[5].status = "error";
          checks[5].value = "Email/Password functions not found";
        }
      } catch (error) {
        checks[5].status = "error";
        checks[5].value = error.message;
      }

      configChecks.value = checks;
      loading.value = false;
    };

    const copyConfig = () => {
      const config = {
        apiKey: firebase.auth?.app?.options?.apiKey || "Not found",
        authDomain: firebase.auth?.app?.options?.authDomain || "Not found",
        projectId: firebase.auth?.app?.options?.projectId || "Not found",
        storageBucket:
          firebase.auth?.app?.options?.storageBucket || "Not found",
        messagingSenderId:
          firebase.auth?.app?.options?.messagingSenderId || "Not found",
        appId: firebase.auth?.app?.options?.appId || "Not found",
      };

      navigator.clipboard
        .writeText(JSON.stringify(config, null, 2))
        .then(() => {
          alert("Configuration copied to clipboard!");
        })
        .catch(() => {
          alert("Failed to copy configuration");
        });
    };

    onMounted(() => {
      runChecks();

      // Get Firebase config for display
      if (firebase.auth?.app?.options) {
        const config = firebase.auth.app.options;
        firebaseConfig.value = JSON.stringify(
          {
            apiKey: config.apiKey
              ? `${config.apiKey.substring(0, 10)}...`
              : "Not found",
            authDomain: config.authDomain || "Not found",
            projectId: config.projectId || "Not found",
            storageBucket: config.storageBucket || "Not found",
            messagingSenderId: config.messagingSenderId || "Not found",
            appId: config.appId
              ? `${config.appId.substring(0, 10)}...`
              : "Not found",
          },
          null,
          2
        );
      } else {
        firebaseConfig.value = "Configuration not available";
      }
    });

    return {
      loading,
      configChecks,
      firebaseConfig,
      runChecks,
      copyConfig,
    };
  },
});
</script>

<style scoped>
.config-check-card {
  max-width: 600px;
  margin: 0 auto;
}

.config-item {
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.config-item:last-child {
  border-bottom: none;
}
</style>
