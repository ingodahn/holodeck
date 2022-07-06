<template>
  <div class="container">
    <v-row>
      <v-col>
        <h1>Book: {{ bookObject.title }}</h1>
        <h2>{{ bookObject.authors }}</h2>
        <h3>{{ bookObject.description }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Pinboard  ref="pinboard"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="bookObject">
        <v-btn
          color="primary"
          @click="session.set('currentPage',1,'Book')"
          :disabled="session.currentPage == 1"
          >|&lt;&lt;</v-btn
        >
        <v-btn
          color="primary"
          @click="backOnePage"
          :disabled="session.currentPage == 1"
          >&lt;</v-btn
        >
        <input v-model="session.pre" type="number" size="3" max="0" min="-3" outlined />
        Page
        <input
          v-model="session.currentPage"
          type="number"
          min="1"
          :max="bookPageIds.length"
          size="3"
          outlined
        />
        <input v-model="session.post" type="number" min="0" max="3" outlined />
        <v-btn
          color="primary"
          @click="forwardOnePage"
          :disabled="session.currentPage == bookPageIds.length"
          >&gt;</v-btn
        >
        <v-btn
          color="primary"
          @click="session.set('currentPage', bookPageIds.length,'Book')"
          :disabled="session.currentPage == bookPageIds.length"
          >&gt;&gt;|</v-btn
        >
        <v-btn color='primary' @click="pageToPinboard()">To Pinboard</v-btn>
      </v-col>
    </v-row>
    <v-row v-for="item in pageIds.pre" :key="item">
      <v-col>
        <page-content :pageId="item"></page-content>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <page-content :pageId="pageIds.cur" currentPage></page-content>
      </v-col>
    </v-row>
    <v-row v-for="item in pageIds.post" :key="item">
      <v-col>
        <page-content :pageId="item"></page-content>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import PageContent from "./PageContent.vue";
import Pinboard from "./Pinboard.vue";
export default {
  mounted() {},
  data() {
    return {
      session: this.$root.$data.session,
    };
  },
  components: { PageContent, Pinboard },
  methods: {
    pageToPinboard () {
      let currentPages=document.getElementsByClassName('currentPage');
      let node=currentPages[0];
      let clone=node.cloneNode(true);
      clone.classList.remove('currentPage');
      clone.querySelectorAll('.sagecell_evalButton').forEach(bt => {bt.remove()});
      let cloneString=clone.innerHTML;
      let title=PageCollection.findOne({_id: this.pageIds.cur}).title;
      this.session.pinboard.push({title: title, content: cloneString, pageNr: this.session.currentPage});
    },
    backOnePage () {
      this.session.set('currentPage',parseInt(this.session.currentPage)-1,'Book')
    },
    forwardOnePage () {
      this.session.set('currentPage',parseInt(this.session.currentPage)+1,'Book')
    }
  },
  computed: {
    bookPageIds() {
      return this.bookObject.pages;
    },
    pageIds() {
      //Need to pasein since input yields strings
      let cur0 = parseInt(this.session.currentPage),
        pre0 = parseInt(this.session.pre),
        post0 = parseInt(this.session.post);
      let cur = cur0 < 1 ? 1 : cur0 - 1;
      (preIds = []),
        (postIds = []),
        (preMin = pre0 > 0 ? cur0 : cur + pre0),
        (postMax = post0 < 0 ? cur0 : cur0 + post0);
      for (let i = preMin; i < cur; i++) {
        if (i >= 0) preIds.push(this.bookPageIds[i]);
      }
      for (let i = cur + 1; i < postMax; i++) {
        if (i < this.bookObject.pages.length) postIds.push(this.bookPageIds[i]);
      }
      return { pre: preIds, cur: this.bookPageIds[cur], post: postIds };
    },
    
  },
  meteor: {
    bookObject() {
      const bo = PageCollection.findOne({ _id: this.session.bookId });
      return bo ? bo : { title: "No Book Found", pages: [] };
    },
  },
};
</script>

<style scoped>
</style>