<template>
  <v-app>
    <v-app-bar app>
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
      <v-btn
        color="warning"
        class="mx-1 my-1"
        v-on:click="session.clear()"
      >
        Reset
      </v-btn>
       <v-btn
        color="warning"
        class="mx-1 my-1"
        v-on:click="session.pinboard=[]"
        :disabled="session.pinboard.length == 0"
      >
        Clear Pinboard
      </v-btn>
      <v-btn
        color="warning"
        class="mx-1 my-1"
        @click="session.set('mode', 'admin', 'App')"
        >Tools</v-btn
      >
    </v-app-bar>
    <v-main>
      <Home v-if="session.mode == 'home'"></Home>
      <Book v-if="session.mode == 'book'"></Book>
      <Admin v-if="session.mode == 'admin'"></Admin>
    </v-main>
  </v-app>
</template>

<script>
//import Vue from "vue";
import Home from "./components/Home.vue";
import Book from "./components/Book.vue";
import { PageCollection } from "../api/PageCollection";
import Admin from "./components/Admin.vue";
export default {
  components: {
    Home,
    Book,
    Admin,
  },
  data() {
    return {
      session: {
        mode: "book",
        bookId: "none",
        currentPage: 1,
        pre: -1,
        post: 0,
        pinboard: [],
        evaluated: new Set(),
        debug: true,
        saveSession: true,
        set(item, newValue, by = "anonymous") {
          if (this.debug)
            console.log("Session setting", item, "to", newValue, "by", by);
          this[item] = newValue;
        },
        clear () {
          this.mode = "book";
          this.bookId = "none";
          this.currentPage = 1;
          this.pre = -1;
          this.post = 0,
          this.pinboard = [],
          this.evaluated = new Set();
          PageCollection.findOne({type: 'book',title: "|| Free Pages"})._id;
        }

      }
    };
  },
  mounted () {
    this.resumeSession();
  },
  methods: {
    resumeSession() {
      let savedSession = localStorage.getItem("mtHolodeckSession");
      if (savedSession) {
        this.session.set("saveSession", false);
        this.session.mode = "book";
        let newSession = JSON.parse(savedSession);
        for (let k of Object.keys(newSession)) {
          if (k != "debug" && k != "mode" && k != "saveSession" && k != "evaluated")
            this.session.set(k, newSession[k], "Book resume");
        }
        this.session.saveSession = true;
      } else {
        alert("No session yet");
      }
    },
  },
  computed: {
    sessionString() {
      return JSON.stringify(this.session);
    },
  },
  meteor: {
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
