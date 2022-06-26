<template>
    <div class = 'container'>
        <ShowMathDoc v-if="pageType == 'markdown-cell'" :content="getContent"></ShowMathDoc>
        <SageCell v-else-if="pageType == 'code-cell'" :script="getCodeContent"></SageCell>
        <div v-else>Unknown Page Type {{ pageType }}</div>
    </div>
</template>

<script>
import { PageCollection } from "../../api/PageCollection";
import ShowMathDoc from './ShowMathDoc.vue';
import SageCell from './SageCell.vue';
export default {
    props: ['pageId'],
    components: { ShowMathDoc, SageCell },
    computed: {
        getPage () {
            const page = PageCollection.findOne({_id: this.pageId});
            return (page)?page:{type: 'markdown-cell',data: 'Page not found'};
        },
        getContent () {
            return this.getPage.data;
        },
        getCodeContent () {
            if (this.getPage.type == 'code-cell') {
                let tmpCell=document.createElement('tmpCell');
                tmpCell.innerHTML=this.getPage.data;
                return tmpCell.querySelectorAll("code")[0].textContent
            } else
            return '1+1';
        },
        pageType (){
            return this.getPage.type;
        }
    }
}
</script>