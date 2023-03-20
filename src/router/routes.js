const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/", component: () => import("pages/IndexPage.vue") },
      { path: "/assets", component: () => import("pages/AssetView.vue") },
      { path: "/insights", component: () => import("pages/InsightsView.vue") },
      { path: "/money", component: () => import("pages/MoneyView.vue") },
      { path: "/tasks", component: () => import("pages/TaskView.vue") },
      { path: "/contracts", component: () => import("pages/ContractView.vue") },
      { path: "/rentroll", component: () => import("pages/RentRoll.vue") },
      { path: "/user", component: () => import("pages/ProfileView.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
