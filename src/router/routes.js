const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/home", component: () => import("pages/IndexPage.vue") },
      { path: "/assets", component: () => import("pages/AssetView.vue") },
      { path: "/insights", component: () => import("pages/InsightsView.vue") },
      { path: "/money", component: () => import("pages/MoneyView.vue") },
      { path: "/tasks", component: () => import("pages/TaskView.vue") },
      { path: "/lease", component: () => import("pages/LeaseView.vue") },
      { path: "/rentroll", component: () => import("pages/RentRoll.vue") },
      { path: "/user", component: () => import("pages/ProfileView.vue") },
      { path: "/entry", component: () => import("pages/entryView.vue") },
      {
        path: "/newproperty",
        component: () => import("pages/propertyEntry.vue"),
      },
      {
        path: "/newEquipment",
        component: () => import("pages/equipEntry.vue"),
      },
      {
        path: "/newTask",
        component: () => import("pages/taskEntry.vue"),
      },
      {
        path: "/test",
        component: () => import("pages/TestView.vue"),
      },
      {
        path: "/google-test",
        component: () => import("pages/GoogleTestView.vue"),
      },
      {
        path: "/register-test",
        component: () => import("pages/RegisterTestView.vue"),
      },
      {
        path: "/firebase-config",
        component: () => import("pages/FirebaseConfigView.vue"),
      },
    ],
  },
  // Login pages don't require authentication, use dedicated layout
  {
    path: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginView.vue") }],
  },
  {
    path: "/signup",
    component: () => import("layouts/AuthLayout.vue"),
    children: [{ path: "", component: () => import("pages/SignupView.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
