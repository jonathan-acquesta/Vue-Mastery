var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        inventory: 12,
        image: './assets/vmSocks-green-onWhite.jpg',
        onSale: true,
        cart: 0,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        sizes: ["P", "M", "G"],
        variants: [
            { id: 1, color: "green", image: './assets/vmSocks-green-onWhite.jpg' },
            { id: 2, color: "blue", image: './assets/vmSocks-blue-onWhite.jpg' }
        ]
    },
    computed: {
        hasStock() {
            return this.inventory == 0;
        },
        emptyCart() {
            return this.cart == 0;
        }
    },
    methods: {
        addToCart() {
            if (this.inventory > 0) {
                ++this.cart;
                --this.inventory;
            }
        },
        removeFromCart() {
            if (this.cart > 0) {
                --this.cart;
                ++this.inventory;
            }
        },
        updateProduct(image) {
            this.image = image;
        }
    }
})