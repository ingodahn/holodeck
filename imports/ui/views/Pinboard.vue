<template>
  <div class="container">
    <MtNavigation />
    <v-main>
      <v-row v-if="items.length == 0">
        <v-col>
          <div name="pinboard">Pinboard is empty</div>
        </v-col>
      </v-row>
      <v-expansion-panels focusable multiple>
        <v-expansion-panel v-for="(item, i) in items" :key="i">
          <v-expansion-panel-header>
            {{ item.title }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-html="item.content"></div>
            <v-card-actions>
              <v-btn icon title="Go to page" @click="goto(i)"
                ><v-icon>mdi-page-next-outline</v-icon></v-btn
              >
              <v-btn icon title="Remove from pinboard" @click="remove(i)"
                ><v-icon>mdi-pin-off-outline</v-icon></v-btn
              >
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-main>
  </div>
</template>

<script>
import MtMenu from "../components/MtMenu.vue";
import MtNavigation from "../components/MtNavigation.vue";
export default {
  data() {
    return {
      session: this.$root.$data.session,
      //items: []
    };
  },
  methods: {
    goto(i) {
      this.session.books[this.items[i].bookId] = this.items[i].pageNr;
      this.$router.push("/read/" + this.items[i].bookId);
    },
    remove(i) {
      this.session.pinboard.splice(i, 1);
    },
  },
  computed: {
    items() {
      return this.session.pinboard;
    },
  },
  components: { MtMenu, MtNavigation },
};
</script>