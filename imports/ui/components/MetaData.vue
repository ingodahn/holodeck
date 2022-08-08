<template>
    <v-row class="container">
        <v-col>
            <v-textarea v-model="metadata" label="Metadata"></v-textarea>
            <v-btn color="primary" @click="checkMetadata">Check Metadata</v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { PageCollection } from "../../api/collections/PageCollection";
export default {
    data () {
        return {
            metadata: this.data
        }
    },
    props: {
        data: {
            default: "{\
                title: 'No titel',\
                label: '',\
                requires: []\
            }"
        }
    },
    methods: {
        checkMetadata () {
            let md={}, mdnew={};
            try {
                md=JSON.parse(this.metadata)
            } catch(e) {
                alert('Error in Metadata format');
                return
            }
            if (md.requires) {
                let reqErrors=[]
                md.requires.forEach(label => {
                    if (!PageCollection.findOne({name: 'LabelForId',label: label}))reqErrors.push(label)
                });
                if (reqErrors.length) {
                    alert('Error: Reference(s) '+reqErrors.join()+' not found');
                    return;
                } else mdnew.requires=md.requires;
            }
            if (md.title) mdnew.title=md.title;
            if (md.authors) mdnew.authors=md.authors;
            if (md.label) mdnew.label=md.label
            if (md.description) mdnew.description=md.description;
            this.$emit('changedMetaData', mdnew);
        }
    }
}
</script>