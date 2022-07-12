<template>
  <div class="container">
    <v-row>
      <h2>Settings</h2>
    </v-row>

    <v-row>
      <v-col md="auto">
        <v-select
          class="select"
          v-model="session.settings.pre"
          :items="preItems"
          label="Show pages before current page"
        />
      </v-col>
      <v-col md="auto">
        <v-select
          class="select"
          v-model="session.settings.post"
          :items="postItems"
          label="Show pages after current page"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Booklist
      </v-col>
    </v-row>
    <v-row
      ><v-col md="auto">
        <v-btn color="warning" @click="reset">Reset</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
export default {
  data() {
    return {
      session: this.$root.$data.session,
      preItems: [
        { text: "0", value: 0 },
        { text: "1", value: -1 },
        { text: "2", value: -2 },
        { text: "3", value: -3 },
        { text: "All", value: -999 },
      ],
      postItems: [
        { text: "0", value: 0 },
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "All", value: 999 },
      ],
    };
  },
  components: {},
  methods: {
    reset() {
      if (
        confirm(
          "Are you sure you would like to to clear all settings, including your pinboard and book selections?"
        )
      ) {
        this.session.clear(this.defaultBookId);
      }
    },
  },
  computed: {
    defaultBookId() {
      return PageCollection.findOne({ type: "book", title: "|| Free Pages" })
        ._id;
    },
  },
};
</script>

<style scoped>
.select {
  max-width: 12em;
}
</style>