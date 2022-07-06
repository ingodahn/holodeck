<template>
  <div class="container">
    <v-row>
      <v-col>
        <h1>MathTrek HoloDeck</h1>
        <h2>Where do you go from here?</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-expansion-panels focusable>
          <v-expansion-panel v-for="(item) in books" :key="item._id">
            <v-expansion-panel-header>
              {{ item.title }} by {{ item.authors }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div>{{ item.description }}</div>
              <v-card-actions>
                <v-btn color="success" @click="openBook(item._id)">Open</v-btn>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
    };
  },
  methods: {
    openBook(id) {
        this.session.set('bookId',id,'Home');
        this.session.set('currentPage',1,'Home');
        this.session.set('mode', 'book','Home');
    }
  },
  meteor: {
    books() {
      return PageCollection.find(
        { type: "book" },
        { sort: { title: 1 } }
      ).fetch();
    },
  },
};
</script>