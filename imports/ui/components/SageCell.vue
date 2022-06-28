<template>
  <div class="container">
    <v-row>
      <v-col>
        <div :class="isCurrent">
          <div v-html="makeCell"></div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script src="https://sagecell.sagemath.org/embedded_sagecell.js"></script>

<script>
export default {
  props: {
    "script": {
      type: String,
      default: "1+1"
    },
    "currentPage": {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {
    // Make *any* div with class 'compute' a Sage cell
    sagecell.makeSagecell({
      inputLocation: "div.compute",
      //languages: sagecell.allLanguages,
      //languages: ["maxima","sage","singular","r"],
      languages: ["sage"],
      evalButtonText: "Evaluate",
      linked: true,
      linkKey: 'Holodeck'
    });
  },
  computed: {
    makeCell() {
      return (
        '<div class="compute"><script type="text/x-sage">' +
        this.script +
        "<\/script></div>"
      );
    },
    isCurrent () {
      return (this.currentPage)?"currentPage":"";
    }
  },
};
</script>

<style scoped>
.currentPage {
  padding: 1em;
  border-style: none solid none solid;
  border-left-color: blue;
  border-right-color: blue;
}
</style>