<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> gPM </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <q-item clickable to="/">
            <img
              alt="Quasar logo"
              src="~assets/quasar-logo-vertical.svg"
              style="width: 50px; height: 50px"
            /> </q-item
        ></q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Assets",
    caption: "quasar.dev",
    icon: "school",
    link: "/assets",
  },
  {
    title: "Contracts",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "/contracts",
  },
  {
    title: "Tasks",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "/tasks",
  },
  {
    title: "Money",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "/money",
  },
  {
    title: "Insights",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "/insights",
  },
  {
    title: "RentRoll",
    caption: "@QuasarFramework",
    icon: "public",
    link: "/rentroll",
  },
  {
    title: "Profile",
    caption: "Community Quasar projects",
    icon: "favorite",
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

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
