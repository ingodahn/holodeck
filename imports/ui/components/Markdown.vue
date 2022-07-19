<template>
  <div>
    <markdown-it-vue-light class="md-body" :content="content" />
  </div>
</template>

<script>
import MarkdownItVueLight from 'markdown-it-vue/dist/markdown-it-vue-light.umd.min.js'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
export default {
  components: {
    MarkdownItVueLight
  },
  props: {
    content: {
      type: String,
      default: "No markdown content given"
    }
  },
  data() {
    return {
    }
  },
  mounted () {
  }
}
</script>