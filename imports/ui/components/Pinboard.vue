<template>
  <div class="container">
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
            <v-btn color="success" @click="goto(i)">Go To</v-btn>
            <v-btn color="warning" @click="remove(i)">Remove from Pinboard</v-btn>
          </v-card-actions>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  data() {
    return {
      session: this.$root.$data.session,
      //items: []
    };
  },
  methods: {
    goto(i) {
      this.session.currentPage=this.items[i].pageNr;
    },
    remove (i) {
      this.session.pinboard.splice(i,1);
    }
  },
  computed: {
    items() {
      return this.session.pinboard;
    },
  },
};
</script>