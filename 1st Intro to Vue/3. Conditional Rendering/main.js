var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        inventory: 8,
        image: './assets/vmSocks-green-onWhite.jpg',
        onSale: true
    },
    created() {
        document.title = "Vue Mastery - Intro to Vue - Conditional Rendering";
    },
})