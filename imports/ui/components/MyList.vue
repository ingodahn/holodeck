<template>
    <div>
        <ul>
            <li v-for="(item,index) in listItems" :key="index">{{ item.title}} <button @click="toggleItem(index)">{{ item.changing}}</button></li>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return {
            MyListItems: this.listItems
        }
    },
    props: {
        listItems: {type: Array}
    },
    methods: {
        toggleItem(i) {
            this.listItems[i].changing=(this.listItems[i].changing == 'Close')?"Open":"Close";
        }
    }
}
</script>