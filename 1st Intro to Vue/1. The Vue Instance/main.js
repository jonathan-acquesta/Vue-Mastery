var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        description: 'A pair of warm, fuzzy socks'
    },
    created() {
        document.title = "Vue Mastery - Intro to Vue - The Vue Instance";
    },
})