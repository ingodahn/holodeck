<template>
  <div class="continer">
    <v-row>
      <v-col>
        <h1>Book: {{ bookObject.title }}</h1>
        <h2>{{ bookObject.authors }}</h2>
        <h3>{{ bookObject.description }}</h3>
      </v-col>
    </v-row>
    <v-row>
        <v-col v-if="bookObject">
            <v-btn color='primary' @click="currentPage=1" :disabled="(currentPage == 1)">|&lt;&lt;</v-btn>
            <v-btn color='primary' @click="currentPage--" :disabled="(currentPage == 1)">&lt;</v-btn>
            <input v-model="currentPage" size="3" outlined/>
            <v-btn color='primary' @click="currentPage++" :disabled = "(currentPage == bookObject.pages.length)">&gt;</v-btn>
            <v-btn color='primary' @click="currentPage=bookObject.pages.length" :disabled = "(currentPage == bookObject.pages.length)">&gt;&gt;|</v-btn>
        </v-col>
    </v-row>
    <v-row>
      <v-col>
        <page-content :pageId="pageId"></page-content>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/PageCollection";
import PageContent from './PageContent.vue';
export default {
  mounted() {},
  data() {
    return {
      currentPage: 1,
    };
  },
  components: {PageContent},
  methods: {},
  computed: {
    pageId () {
      return this.bookObject.pages[this.currentPage-1];
    }
  },
  meteor: {
    bookObject() {
      const bo = PageCollection.findOne({ type: "book" });
      return bo ? bo : { title: "No Book Found" ,pages: []};
    },
  },
};
</script>

<style scoped>

</style>