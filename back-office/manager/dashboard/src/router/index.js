import { createRouter, createWebHashHistory } from "vue-router";
import Customer from "../components/Customer.vue";
import Inventory from "../components/Inventory.vue";
import Booking from "../components/Booking.vue";
import Employee from "../components/Employee.vue";
import Login from "../components/Login.vue";

import axios from "axios";

const routes = [
  { path: "/", component: Customer },
  { path: "/inventory", component: Inventory },
  { path: "/booking", component: Booking },
  { path: "/employee", component: Employee },
  { path: "/login", component: Login },
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

router.beforeEach(async (to, from) => {
  // console.log("FROM ROUTER");
  // console.log(to.fullPath);
  // console.log("END ROUTER");
  // if (to.fullPath == "/login") {
  //   return true;
  // }
  // try {
  //   const res = await axios.get("http://localhost:8000/dash/protect");
  //   console.log(res);
  // } catch (err) {
  //   console.error("USER NOT LOGGED");
  //   return "/login";
  // }
});

export default router;
