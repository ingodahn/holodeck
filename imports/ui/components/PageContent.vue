<template>
  <div class="container">
    <v-row>
      <v-col :class="pageWidth">
        <ShowMathDoc
          v-if="pageType == 'markdown-cell'"
          :content="getContent"
          :currentPage="currentPage"
        ></ShowMathDoc>
        <SageCell
          v-else-if="pageType == 'code-cell'"
          :script="getCodeContent"
          :currentPage="currentPage"
          :pageId="pageId"
          @evaluated="(id) => $emit('evaluated', id)"
        ></SageCell>
        <SageCell
          v-else-if="pageType == 'code'"
          :script="getContent"
          :currentPage="currentPage"
          :pageId="pageId"
          @evaluated="(id) => $emit('evaluated', id)"
        ></SageCell>
        <Markdown
          v-else-if="pageType == 'markdown'"
          :content="getContent"
          :currentPage="currentPage"
        ></Markdown>
        <div v-else>Unknown Page Type {{ pageType }}</div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
import ShowMathDoc from "./ShowMathDoc.vue";
import SageCell from "./SageCell.vue";
import Markdown from "./Markdown.vue";
export default {
  props: {
    pageId: {
      type: String,
      default: "",
    },
    currentPage: {
      type: Boolean,
      default: false,
    },
  },
  components: { ShowMathDoc, SageCell, Markdown },
  data() {
    return {
      session: this.$root.$data.session,
    };
  },
  computed: {
    getPage() {
      const page = PageCollection.findOne({ _id: this.pageId });
      return page ? page : { type: "markdown-cell", data: "Page not found" };
    },
    getContent() {
      return this.getPage.data;
    },
    getCodeContent() {
      return this.getPage.script;
    },
    pageType() {
      return this.getPage.type;
    },
    pageWidth () {
      return (this.session.sidebar)?"col-11":"col-12";
    }
  },
};
</script>