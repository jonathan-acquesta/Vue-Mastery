var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        inventory: 8,
        image: './assets/vmSocks-green-onWhite.jpg',
        onSale: true,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        sizes: ["P", "M", "G"],
        variants: [
            { variantId: 1, variantColor: "green" },
            { variantId: 2, variantColor: "blue" }
        ]
    },
    created() {
        document.title = "Vue Mastery - Intro to Vue - List Rendering";
    },
})