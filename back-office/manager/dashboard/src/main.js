import { createApp } from "vue";
import App from "./App.vue";

import { createStore } from "vuex";

import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";

import router from "./router/index";
import { Vue3Mq } from "vue3-mq";

loadFonts();

Chartkick.options = {
  colors: [
    "#ff3333",
    "#0066ff",
    "#9933ff",
    "#e6e600",
    "#000099",
    "#994d00",
    "#1aff1a",
    "#00e6e6",
    "#666699",
    "#336600",
    "#ff66cc",
    "#999966",
  ],
};

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
  .use(Vue3Mq, {
    preset: "bootstrap5",
  })
  .mount("#app");
