<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="modern-header">
      <q-toolbar class="toolbar-container">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="menu-btn"
        />

        <div class="logo-section">
          <div class="logo-container">
            <div class="logo-icon">
              <q-icon name="flight_takeoff" size="2rem" color="primary" />
            </div>
            <div class="logo-text">
              <span class="logo-title">gPM</span>
              <span class="logo-subtitle">Property Management</span>
            </div>
          </div>
        </div>

        <q-space />

        <div class="user-section">
          <q-btn-dropdown
            flat
            color="white"
            icon="account_circle"
            class="user-dropdown"
          >
            <q-list class="user-menu">
              <q-item
                clickable
                v-close-popup
                @click="goToProfile"
                class="user-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="person" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="user-name">{{ userName }}</q-item-label>
                  <q-item-label caption class="user-email">{{
                    userEmail
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item
                clickable
                v-close-popup
                @click="logout"
                class="user-menu-item"
              >
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="modern-drawer"
    >
      <q-list class="navigation-list">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthStore } from "../stores/auth-store";

const linksList = [
  {
    title: "Dashboard",
    caption: "Overview & Quick Actions",
    icon: "dashboard",
    link: "/",
  },
  {
    title: "Assets",
    caption: "Property Management",
    icon: "home",
    link: "/assets",
  },
  {
    title: "RentRoll",
    caption: "Financial Transactions",
    icon: "account_balance_wallet",
    link: "/rentroll",
  },
  {
    title: "Tasks",
    caption: "Maintenance & Management",
    icon: "assignment",
    link: "/tasks",
  },
  {
    title: "Leases",
    caption: "Lease Agreements",
    icon: "description",
    link: "/lease",
  },
  {
    title: "Insights",
    caption: "Analytics & Reports",
    icon: "analytics",
    link: "/insights",
  },
  {
    title: "Profile",
    caption: "User & Role Management",
    icon: "person",
    link: "/user",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const $q = useQuasar();
    const authStore = useAuthStore();

    const goToProfile = () => {
      router.push("/user");
    };

    const logout = async () => {
      try {
        await authStore.logout();
        $q.notify({
          type: "positive",
          message: "Successfully logged out",
        });
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
        $q.notify({
          type: "negative",
          message: "Logout failed: " + error.message,
        });
      }
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      userName: authStore.userName,
      userEmail: authStore.userEmail,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goToProfile,
      logout,
    };
  },
});
</script>

<style scoped>
/* Modern Header */
.modern-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.toolbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.menu-btn {
  color: white;
  margin-right: 1rem;
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
}

.user-dropdown {
  color: white;
}

.user-menu {
  min-width: 200px;
  padding: 0.5rem 0;
}

.user-menu-item {
  padding: 0.75rem 1rem;
  transition: background-color 0.2s;
}

.user-menu-item:hover {
  background-color: #f8fafc;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.user-email {
  color: #6b7280;
}

/* Modern Drawer */
.modern-drawer {
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
}

.drawer-header {
  padding: 2rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.drawer-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.drawer-logo-text {
  flex: 1;
}

.drawer-logo-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.drawer-logo-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

/* Navigation List */
.navigation-list {
  padding: 1rem 0;
}

/* Page Container */
.page-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .toolbar-container {
    padding: 0 1rem;
  }

  .logo-container {
    padding: 0.25rem 0.75rem;
  }

  .logo-title {
    font-size: 1.25rem;
  }

  .logo-subtitle {
    font-size: 0.625rem;
  }

  .drawer-header {
    padding: 1.5rem 1rem;
  }

  .drawer-logo-icon {
    width: 50px;
    height: 50px;
  }

  .drawer-logo-title {
    font-size: 1.5rem;
  }
}
</style>
