<template>
  <v-app>
    <v-app-bar fixed app>
      <v-btn
        color="primary"
        class="mx-1 my-1"
        @click="session.set('mode', 'home', 'App')"
        >Home</v-btn
      >
      <v-btn
        color="primary"
        class="mx-1 my-1"
        @click="session.set('mode', 'book', 'App')"
        >Book</v-btn
      >
      <v-btn color="warning" class="mx-1 my-1" v-on:click="session.clear()">
        Reset
      </v-btn>
      <v-btn
        color="warning"
        class="mx-1 my-1"
        v-on:click="session.pinboard = []"
        :disabled="session.pinboard.length == 0"
      >
        Clear Pinboard
      </v-btn>
      <v-btn
        color="success"
        class="mx-1 my-1"
        v-on:click="session.set('mode', 'edit', 'App')"
        v-if="currentUser"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="isAdmin"
        color="warning"
        class="mx-1 my-1"
        @click="session.set('mode', 'admin', 'App')"
        >Tools</v-btn
      >
      <div class="loading" v-if="!$subReady.AllItems">Loading...</div>
    </v-app-bar>
    <v-main>
      <Home v-if="session.mode == 'home'"></Home>
      <Book v-if="session.mode == 'book'"></Book>
      <Edit v-if="session.mode == 'edit'"></Edit>
      <Admin v-if="session.mode == 'admin'"></Admin>
      <v-row v-if="session.mode == 'login'">
          <LoginForm />
      </v-row>
    </v-main>
    <v-footer>
      <v-btn class="mx-1" onclick="window.location.href='https://dahn-research.eu/impressum.htm'">Impressum</v-btn>
      <v-btn class="mx-1" onclick="window.location.href='https://dahn-research.eu/privacy.htm'">Privacy</v-btn>
  
      <v-btn class="mx-1" color="primary" @click="logout" v-if="currentUser"
        >Logout as {{ currentUser.username }}</v-btn
      >
      <v-btn class="mx-1" color="primary" @click="session.set('mode', 'login','App')" v-else
        >Login as Author</v-btn
      >
    </v-footer>
  </v-app>
</template>

<script>
//import Vue from "vue";
import Home from "./views/Home.vue";
import Book from "./views/Book.vue";
import { PageCollection } from "../api/collections/PageCollection";
import Edit from "./components/Edit.vue";
import Admin from "./components/Admin.vue";
import LoginForm from "./components/LoginForm.vue";

export default {
  components: {
    Home,
    Book,
    Edit,
    Admin,
    LoginForm
  },
  data() {
    return {
      session: {
        mode: "book",
        bookId: "none",
        pre: -1,
        post: 0,
        pinboard: [],
        evaluated: new Set(),
        debug: true,
        saveSession: true,
        sidebar: true,
        set(item, newValue, by = "anonymous") {
          if (this.debug)
            console.log("Session setting", item, "to", newValue, "by", by);
          this[item] = newValue;
        },
        clear() {
          this.mode = "book";
          this.bookId = "none";
          this.currentPage = 1;
          this.pre = -1;
          this.post = 0, 
          this.pinboard = [],
          this.sidebar = true;
          this.evaluated = new Set();
          PageCollection.findOne({ type: "book", title: "|| Free Pages" })._id;
        },
      },
    };
  },
  mounted() {
    this.resumeSession();
  },
  methods: {
    resumeSession() {
      let savedSession = localStorage.getItem("mtHolodeckSession");
      if (savedSession) {
        this.session.set("saveSession", false);
        this.session.mode = "book";
        let newSession = JSON.parse(savedSession);
        console.log('App-125:',newSession);
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
      this.session.set('mode',"book",'App-logout');
    },
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
