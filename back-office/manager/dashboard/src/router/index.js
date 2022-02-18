import { createRouter, createWebHashHistory } from "vue-router";
import Customer from "../components/Customer.vue";
import Inventory from "../components/Inventory.vue";
import Booking from "../components/Booking.vue";
import Login from "../components/Login.vue";

const routes = [
  { path: "/", component: Customer },
  { path: "/inventory", component: Inventory },
  { path: "/booking", component: Booking },
  { path: "/login", component: Login },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

export default router;
