Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true,
            default: []
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {

    }
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img :src="getImage">
            </div>
            <div class="product-info">
                <h1>{{ getTitle }}</h1>
                <p v-if="hasEnoghStock">In Stock</p>
                <p v-else-if="hasMinStockLevel">Almost sold out!</p>
                <p v-else class=outOfStock>Out of Stock</p>
                <product-details :details="details"></product-details>
                <p>Shipping: {{ getShipping }}</p>
                <span>Colors:</span>
                <div v-for="variant in variants" :key="variant.id" class="color-box" :style="{ backgroundColor: variant.color }" @mouseover="updateProduct(variant)">
                </div>
                <br />
                <span>Sizes:</span>
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
                <div>
                    <button @click="addToCart" :disabled="hasStock" :class="{ disabledButton: hasStock}">Add to Cart</button>
                </div>
                <div>
                    <button @click="removeFromCart" :disabled="emptyCart" :class="{ disabledButton: emptyCart}">Remove from Cart</button>
                </div>
                <div class="cart">
                    <p>Cart({{getCartAllQuantity}})</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
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
            ],
            defaultShipping: "$ 4,20"
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
    },
    computed: {
        hasEnoghStock() {
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
        },
        getShipping() {
            if (this.premium) {
                return "Free";
            }

            return this.defaultShipping;
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        productsPerPage: 3
    },
    computed: {

    },
    methods: {

    }
});