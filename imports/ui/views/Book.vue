<template>
  <div class="container">
    <v-main>
      <div v-if="this.bookObject.pages.length != 0">
      <v-row v-for="item in pageIds.pre" :key="item">
        <v-col>
          <page-content :pageId="item"></page-content>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <page-content
            :pageId="pageIds.cur"
            currentPage
            ref="currentPage"
          ></page-content>
        </v-col>
      </v-row>
      <v-row v-for="item in pageIds.post" :key="item">
        <v-col>
          <page-content :pageId="item"></page-content>
        </v-col>
      </v-row>
      </div>
      <div v-else>No pages to show. Please open a book from the library.</div>
    </v-main>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import PageContent from "../components/PageContent.vue";

export default {
  mounted() {
    this.bookId = this.$route.params.bookId;
    this.session.currentBook = this.bookId;
    this.pageIndex = parseInt(this.$route.params.pageIndex);
    this.session.currentPage = this.pageIndex ? this.pageIndex : 1;
  },
  data() {
    return {
      session: this.$root.$data.session,
      bookId: "",
      pageIndex: 0,
      selectPage: false,
    };
  },

  components: { PageContent },
  methods: {
  },

  computed: {
    bookPageIds() {
      return (this.bookObject.pages.length)?this.bookObject.pages:[];
    },
    pageIds() {
      let cur0 = this.pageIndex,
        //cur0 = this.session.books[this.bookId],
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
    sidebarLabel() {
      return this.session.sidebar ? "Hide Sidebar" : "Show Sidebar";
    },
  },
  meteor: {
    bookObject() {
      const bo = PageCollection.findOne({ _id: this.bookId });
      return bo ? bo : { title: "Book not Found", pages: [] };
    },
  },
};
</script>

<style scoped>
</style>