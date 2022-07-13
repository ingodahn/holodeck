<template>
  <v-app>
    <v-app-bar fixed app>
      <div class="loading" v-if="!$subReady.AllItems">Loading...</div>
      <div v-else>
        <mtMenu
          menuTitle="Home"
          :menuItems="homeMenuItems"
          v-on:menuSelected="gotoMenu"
        />
        <router-link to="/">Go to Home</router-link>
        <router-link to="/settings">Settings</router-link>
      </div>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
//import Vue from "vue";
import mtMenu from "./components/MtMenu.vue";
import Home from "./components/Library.vue";
import Book from "./components/Book.vue";
//import Settings from "./components/Settings.vue";
import { PageCollection } from "../api/collections/PageCollection";
import Edit from "./components/Edit.vue";
import Admin from "./components/Admin.vue";
import LoginForm from "./components/LoginForm.vue";

export default {
  components: {
    mtMenu,
    Home,
    //Settings,
    Book,
    Edit,
    Admin,
    LoginForm,
  },
  data() {
    return {
      session: {
        mode: "home",
        books: {
          //bookId: "none",
          //currentPage: 1,
        },
        currentBook: null,
        settings: {
          pre: -1,
          post: 0,
          debug: true,
        },
        saveSession: true,
        pinboard: [],
        evaluated: new Set(),
        sidebar: true,
        set(item, newValue, by = "anonymous") {
          if (this.debug)
            console.log("Session setting", item, "to", newValue, "by", by);
          this[item] = newValue;
        },
        clear(dbid) {
          this.mode = "home";
          this.settings = {
            pre: -1,
            post: 0,
            debug: true,
          };
          this.books = {};
          this.currentBook = dbid;
          this.books[dbid] = 1;
          (this.saveSession = true), (this.pinboard = []);
          this.sidebar = true;
          this.evaluated = new Set();
        },
      },
      homeMenuItems: ["Home", "Library", "Settings"]
    };
  },
  mounted() {
    //this.resumeSession();
  },
  methods: {
    resumeSession() {
      let savedSession = localStorage.getItem("mtHolodeckSession");
      if (savedSession) {
        this.session.set("saveSession", false);
        this.session.mode = "book";
        let newSession = JSON.parse(savedSession);
        for (let k of Object.keys(newSession)) {
          if (
            k != "debug" &&
            k != "mode" &&
            k != "saveSession" &&
            k != "evaluated"
          )
            this.session.set(k, newSession[k], "Book resume");
        }
        this.session.saveSession = true;
      } else {
        alert("No session yet");
      }
    },
    logout() {
      Meteor.logout();
      this.session.set("mode", "book", "App-logout");
    },
    gotoMenu(item) {
      switch (item) {
        case "Settings": {
          this.$router.push("/settings");
          break;
        }
        case "Library": {
          this.$router.push("/library");
          break;
        }
        case "Home": {
          this.$router.push("/");
          break;
        }
        default: {
          this.$router.push("/");
        }
      }
    },
  },
  computed: {
    sessionString() {
      return JSON.stringify(this.session);
    },
    homeMenuItemsX() {
      return ["Library", "Settings"];
    },
  },
  meteor: {
    currentUser() {
      return Meteor.user();
    },
    isAdmin() {
      if (this.currentUser) {
        return this.currentUser.username === "admin";
      }
      return false;
    },
    $subscribe: {
      Users: [],
      AllItems: [],
    },
  },
  watch: {
    sessionString(newSessionString) {
      if (this.session.saveSession) {
        localStorage.setItem("mtHolodeckSession", newSessionString);
      }
    },
  },
};
</script>

<style>
body {
  font-family: sans-serif;
  padding: 10px;
}
</style>
