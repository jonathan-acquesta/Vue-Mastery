var app = new Vue({
    el: '#app',
    data: {
        brand: 'Vue Mastery',
        product: 'Socks',
        selectedProductID: 1,
        cartProducts: [
            { productId: 1, quantity: 0 },
            { productId: 2, quantity: 0 }
        ],
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        sizes: ["P", "M", "G"],
        variants: [
            { id: 1, color: "green", image: './assets/vmSocks-green-onWhite.jpg', inventory: 12, onSale: true },
            { id: 2, color: "blue", image: './assets/vmSocks-blue-onWhite.jpg', inventory: 3, onSale: false }
        ]
    },
    created() {
        document.title = "Vue Mastery - Intro to Vue - Computed Properties";
    },
    computed: {
        hasEnoughStock() {
            return this.getInventory > 10;
        },
        hasMinStockLevel() {
            return this.getInventory <= 10 && this.getInventory > 0;
        },
        hasStock() {
            return this.getInventory == 0;
        },
        emptyCart() {
            return this.getCartQuantity == 0;
        },
        getInventory() {
            return this.variants.find(x => x.id == this.selectedProductID).inventory;
        },
        getImage() {
            return this.variants.find(x => x.id == this.selectedProductID).image;
        },
        getCartQuantity() {
            return this.cartProducts.find(x => x.productId == this.selectedProductID).quantity;
        },
        getCartAllQuantity() {
            return this.cartProducts.reduce((a, b) => ({ allQuantity: a.quantity + b.quantity })).allQuantity
        },
        getTitle() {
            let onSale = this.variants.find(x => x.id == this.selectedProductID).onSale;
            let title = this.brand + " " + this.product;
            if (onSale) {
                title += " on Sale!"
            }

            return title;
        }
    },
    methods: {
        addToCart() {
            if (this.getInventory > 0) {
                ++this.cartProducts.find(x => x.productId == this.selectedProductID).quantity;
                --this.variants.find(x => x.id == this.selectedProductID).inventory;
            }
        },
        removeFromCart() {
            if (this.getCartQuantity > 0) {
                --this.cartProducts.find(x => x.productId == this.selectedProductID).quantity;
                ++this.variants.find(x => x.id == this.selectedProductID).inventory;
            }
        },
        updateProduct(variant) {
            this.selectedProductID = variant.id;
        }
    }
})