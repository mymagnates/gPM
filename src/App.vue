<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useAuthStore } from "./stores/auth-store";

export default defineComponent({
  name: "App",
  setup() {
    const authStore = useAuthStore();

    onMounted(() => {
      // Initialize authentication listener
      authStore.initAuthListener();
    });
  },
});
</script>
