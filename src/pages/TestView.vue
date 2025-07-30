<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h4>Login System Test Page</h4>
      <p>
        If you can see this page, it means routing and layout are working
        correctly.
      </p>

      <div class="q-mt-md">
        <q-btn
          color="primary"
          label="Go to Login Page"
          @click="$router.push('/login')"
          class="q-mr-sm"
        />
        <q-btn
          color="secondary"
          label="Back to Home"
          @click="$router.push('/')"
        />
      </div>

      <div class="q-mt-lg">
        <h6>Current User Status:</h6>
        <p v-if="authStore.isAuthenticated">
          Logged in: {{ authStore.userName }}
        </p>
        <p v-else>Not logged in</p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useAuthStore } from "../stores/auth-store";

export default defineComponent({
  name: "TestView",
  setup() {
    const authStore = useAuthStore();

    return {
      authStore,
    };
  },
});
</script>
