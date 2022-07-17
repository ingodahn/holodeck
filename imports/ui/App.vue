<template>
  <v-app>
      <router-view :key="$route.fullPath"></router-view>
  </v-app>
</template>

<script>
/*
import MtNavigation from './components/MtNavigation.vue';
import Home from "./views/Library.vue";
import Book from "./views/Book.vue";
import { PageCollection } from "../api/collections/PageCollection";
import Edit from "./components/Edit.vue";
import Admin from "./components/Admin.vue";
import LoginForm from "./components/LoginForm.vue";
*/
export default {
  components: {
    //MtNavigation,
    //Home,
    //Book,
    //Edit,
    //Admin,
    //LoginForm,
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
          this.saveSession = true;
          this.pinboard = [];
          this.sidebar = true;
          this.evaluated = new Set();
        },
        currentPage() {
          if (this.currentBook && this.books[this.currentBook]) {
            return this.books[this.currentBook]
          } else return 0;
        },
        setCurrentPage(n) {
          if (this.currentBook) {
            this.books[this.currentBook]=n;
          }
        }
      },
      homeMenuItems: ["Home", "Library", "Settings"]
    };
  },
  mounted() {
    this.resumeSession();
  },
  watch: {
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
    gotoRead () {
      this.$router.push('/read/'+this.session.currentBook);
    }
  },
  computed: {
    sessionString() {
      return JSON.stringify(this.session);
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
