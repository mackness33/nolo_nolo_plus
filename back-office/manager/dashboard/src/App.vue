<template>
  <div v-cloak id="globalContainer">
    <NavBar @click="test" v-model="currentlyShowing" :logged="logged" />
    <router-view />
    <!-- <CustomerContainer v-if="showCustomer" />
    <InventoryContainer v-if="showInv" />
    <BookingContainer v-if="showBooking" /> -->
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "./components/NavBar.vue";
import CustomerContainer from "./components/Customer.vue";
import InventoryContainer from "./components/Inventory.vue";
import BookingContainer from "./components/Booking.vue";
import Login from "./components/Login.vue";

export default {
  name: "App",

  components: {
    NavBar,
    CustomerContainer,
    InventoryContainer,
    BookingContainer,
    Login,
  },

  data: () => {
    return {
      isVisible: false,
      currentlyShowing: 0,
      showCustomer: true,
      showInv: false,
      showBooking: false,
      logged: false,
    };
  },

  methods: {
    toggleBox() {
      this.isVisible = !this.isVisible;
    },

    async setUser() {
      const res = await axios.get("http://localhost:8000/dash/empl/whoAmI");
      if (res.data.success) {
        this.$store.commit("setUser", res.data.payload._id);
      } else {
        this.$store.commit("setUser", 0);
      }
    },

    test() {
      console.log(this.$store.state.userId);
    },
  },

  async mounted() {
    await this.setUser();
  },

  async updated() {
    console.log("updated");
    await this.setUser();

    if (this.currentlyShowing == 0) {
      this.showCustomer = true;
      this.showInv = false;
      this.showBooking = false;
    } else if (this.currentlyShowing == 1) {
      this.showCustomer = false;
      this.showInv = true;
      this.showBooking = false;
    } else {
      this.showCustomer = false;
      this.showInv = false;
      this.showBooking = true;
    }
  },
};
</script>

<style>
/* @import '@/assets/nav.css'; */
/* @import '@/assets/users.css'; */

/* .general {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#app {
  margin: 0 auto;
  background-color: hsla(160, 100%, 37%, 0.2);
  font-weight: normal;
}

.logo {
  display: block;
}


.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (max-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: flex;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
} */
</style>

<style>
#globalContainer {
  background-color: dimgray;
}
</style>
