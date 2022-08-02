<template>
  <div class="container">
    <v-app-bar fixed app dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <template v-if="allSet">
        <v-icon title="Temporary deck" v-if="isSecondary" color="warning"
          >mdi-content-save-off</v-icon
        >
        &nbsp;
        <v-toolbar-title>{{ bookObject.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="gotoPage(1)"
          :disabled="currentPage == 1"
          title="To first page"
        >
          <v-icon>mdi-page-first</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="gotoPage(currentPage - 1)"
          :disabled="currentPage == 1"
          title="To previous page"
        >
          <v-icon>mdi-step-backward</v-icon>
        </v-btn>
        <v-btn icon title="To current page" @click="toCurrentPage()"
          ><v-icon>mdi-map-marker-check-outline</v-icon></v-btn
        >
        <v-btn @click="selectPage = true">
          {{ currentPage }}/{{ bookObject.pages.length }}
        </v-btn>

        <v-autocomplete
          v-if="selectPage"
          :items="selectablePages"
          v-model="myCurrentPage"
          labe="Select page"
        ></v-autocomplete>
        <v-btn v-if="selectPage" icon @click="selectPage = false">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>

        <v-btn
          icon
          @click="forwardOnePage()"
          :disabled="currentPage == bookObject.pages.length"
          title="To next page"
        >
          <v-icon>mdi-step-forward</v-icon>
        </v-btn>
        <v-btn
          icon
          :disabled="currentPage == bookObject.pages.length"
          @click="gotoPage(bookObject.pages.length)"
          title="To last page"
        >
          <v-icon>mdi-page-last</v-icon>
        </v-btn>
        <v-btn icon @click="pageToPinboard()" title="To pinboard">
          <v-icon>mdi-pin-outline</v-icon>
        </v-btn>
        <v-btn icon @click="gotoPath('/edit')" v-if="currentUser" title="Edit">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
      <v-app-bar-title v-else>MathTrek Holodeck</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary fixed>
      <v-list nav dense>
        <v-list-item link @click="gotoPath('/')">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="gotoPath('/opened')">
          <v-list-item-icon>
            <v-icon>mdi-book-open-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Open books</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="gotoPath('/library')">
          <v-list-item-icon>
            <v-icon>mdi-library-shelves</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Library</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="gotoPath('/pinboard')">
          <v-list-item-icon>
            <v-icon>mdi-pin</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Pinboard</v-list-item-title>
        </v-list-item>
        <v-list-item @click="gotoPath('/settings')">
          <v-list-item-icon>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-list-item @click="gotoPath('/login')" v-if="!currentUser">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Sign in</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout" v-else>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title
            >Sign out as {{ currentUser.username }}</v-list-item-title
          >
        </v-list-item>
        <v-list-item @click="gotoPath('/admin')" v-if="isAdmin">
          <v-list-item-icon>
            <v-icon>mdi-hammer-screwdriver</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Admin Tools</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
export default {
  data() {
    return {
      session: this.$root.$data.session,
      drawer: false,
      group: null,
      selectPage: false,
      myCurrentPage: this.currentPage,
      isSecondary: false,
    };
  },
  watch: {
    group() {
      this.drawer = false;
    },
    myCurrentPage(newVal) {
      this.gotoPage(newVal);
    },
  },
  created() {
    if (this.$route.query.deck == "secondary") {
      this.session.set("saveSession", false);
      this.isSecondary = true;
    }
  },
  methods: {
    gotoPage(nr) {
      let path = "/read/" + this.session.currentBook + "/" + nr.toString();
      this.gotoPath(path);
    },
    gotoPath(path) {
      this.$router.push(path);
      this.drawer = false;
    },
    forwardOnePage() {
      if (this.currentPage < this.bookObject.pages.length) {
        let pi = this.currentPage + 1;
        this.gotoPage(pi);
      }
    },
    backwardOnePage() {
      if (this.session.currentPage > 1) this.session.currentPage--;
    },
    toCurrentPage() {
      let mp = document.getElementsByClassName("currentPage")[0];
      if (!mp && this.currentPage) this.gotoPage(this.currentPage);
      else mp.scrollIntoView(false);
    },
    pageToPinboard() {
      let currentPages = document.getElementsByClassName("currentPage");
      let node = currentPages[0];
      let clone = node.cloneNode(true);
      clone.classList.remove("currentPage");
      clone.querySelectorAll(".sagecell_evalButton").forEach((bt) => {
        bt.remove();
      });
      clone.querySelectorAll(".sagecell_messages").forEach((ms) => {
        ms.remove();
      });
      let cloneString = clone.innerHTML;
      let title = PageCollection.findOne({ _id: this.pageIds.cur }).title;
      this.session.pinboard.push({
        title: title,
        content: cloneString,
        bookId: this.session.currentBook,
        pageNr: this.session.currentPage,
      });
    },
    logout() {
      this.gotoPath("/");
      Meteor.logout();
    },
  },
  computed: {
    bookPageIds() {
      return this.bookObject.pages;
    },
    currentPage() {
      return this.session.currentPage;
    },
    pageIds() {
      let cur0 = this.currentPage,
        pre0 = this.session.settings.pre,
        post0 = this.session.settings.post;
      let cur = cur0 < 1 ? 1 : cur0 - 1;
      let preIds = [],
        postIds = [],
        preMin = pre0 > 0 ? cur0 : cur + pre0,
        postMax = post0 < 0 ? cur0 : cur0 + post0;
      for (let i = preMin; i < cur; i++) {
        if (i >= 0) preIds.push(this.bookPageIds[i]);
      }
      for (let i = cur + 1; i < postMax; i++) {
        if (i < this.bookObject.pages.length) postIds.push(this.bookPageIds[i]);
      }
      return { pre: preIds, cur: this.bookPageIds[cur], post: postIds };
    },
    allSet() {
      if (!this.session.currentBook || this.session.currentBook == "null")
        return false;
      if (!this.session.books[this.session.currentBook])
        this.session.books[this.session.currentBook] = 1;
      return true;
    },
  },
  meteor: {
    bookObject() {
      const bo = PageCollection.findOne({ _id: this.session.currentBook });
      return bo ? bo : { title: "Current Book not Found", pages: [] };
    },
    selectablePages() {
      let selPages = [],
        maxLevel = this.session.tocLevel;

      for (let i = 1; i <= this.bookPageIds.length; i++) {
        let pi = this.bookPageIds[i - 1];
        let page = PageCollection.findOne({ _id: pi });
        let title = page.title;
        if (page.level == 0 && maxLevel == 999)
          selPages.push({
            text: "(" + i.toString() + ") " + page.title,
            value: i,
          });
        else if (0 < page.level && page.level <= maxLevel) {
          let pre = new Array(page.level).join("-");
          selPages.push({ text: pre + " " + page.title, value: i });
        }
      }
      return selPages;
    },

    currentUser() {
      return Meteor.user();
    },
    isAdmin() {
      if (this.currentUser) {
        return this.currentUser.username === "admin";
      }
      return false;
    },
  },
};
</script>