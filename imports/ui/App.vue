<template>
  <v-app>
    <MtNavigation/>
    <router-view :key="$route.fullPath"></router-view>
    <v-footer app bottom fixed padless>
      <v-btn
        class="mx-1"
        onclick="window.location.href='https://dahn-research.eu/impressum.htm'"
        >Impressum</v-btn
      >
      <v-btn
        class="mx-1"
        onclick="window.location.href='https://dahn-research.eu/privacy.htm'"
        >Privacy</v-btn
      >
    </v-footer>
  </v-app>
</template>

<script>
import MtNavigation from './components/MtNavigation.vue';
export default {
  components: { MtNavigation },
  data() {
    return {
      session: {
        //drawer: true,
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
        tocLevel: 4,
        saveSession: true,
        pinboard: [],
        modifiedScripts: {},
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
          this.tocLevel=4;
          this.books = {};
          this.currentBook = dbid;
          this.books[dbid] = 1;
          this.saveSession = true;
          this.pinboard = [];
          this.sidebar = true;
          this.evaluated = new Set();
          this.modifiedScripts = {};
        },
        currentPage() {
          if (this.currentBook && this.books[this.currentBook]) {
            return this.books[this.currentBook];
          } else return 0;
        },
        setCurrentPage(n) {
          if (this.currentBook) {
            this.books[this.currentBook] = n;
          }
        },
      },
      homeMenuItems: ["Home", "Library", "Settings"],
    };
  },
  mounted() {
    this.resumeSession();
    window.onbeforeunload = () => {
      this.session.evaluated = new Set();
      if (this.session.saveSession) {
        localStorage.setItem("mtHolodeckSession", this.sessionString);
      }
    };
  },
  watch: {},
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
        let cp = this.session.currentPage;
        if (cp) {
          this.$router.push('/read/'+this.session.currentBook+'/'+cp.toString());
        } else {
          this.session.currentBook == null;
          this.$router.push('/');
        }
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
