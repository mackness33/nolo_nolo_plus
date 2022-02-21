import { createApp } from "vue";
import App from "./App.vue";

import { createStore } from "vuex";

import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";

import router from "./router/index";

loadFonts();

const store = createStore({
  state() {
    return {
      logged: true,
      userId: {},
    };
  },
  mutations: {
    logout(state) {
      state.logged = false;
    },
    login(state) {
      state.logged = true;
    },
    setUser(state, u) {
      state.userId = u;
    },
  },
});

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .use(VueChartkick)
  .mount("#app");
