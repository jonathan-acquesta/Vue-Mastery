Vue.filter('money', function(value, ignore) {
    if (ignore) return value;
    if (isNaN(value)) return 'NaN';
    return "$ " + value.toFixed(2);
});

Vue.component('product-card-details', {
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

Vue.component('product-card', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        product: {}
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="getProductImage">
            </div>
            <div class="product-info">
                <h1>{{ getTitle }}</h1>
                <p v-if="hasEnoughStock">In Stock</p>
                <p v-else-if="hasMinStockLevel">Almost sold out!</p>
                <p v-else class=outOfStock>Out of Stock</p>
                <product-card-details :details="product.details"></product-card-details>
                <p>Price: {{ this.getSelectedVariant().price | money }} - Shipping: {{ getShipping | money(this.premium) }}</p>
                <span>Options:</span>
                <br />
                <div v-for="variant in this.product.variants" :key="variant.variantId" class="color-box" :style="{ backgroundColor: variant.color }" @mouseover="updateProduct(variant)">
                </div>
                <br />
                <span>Sizes:</span>
                
                    <label v-for="size in this.product.sizes">{{ size + " " }}</label>
                
                <div>
                    <button @click="addToCart" :disabled="emptyStock" :class="{ disabledButton: emptyStock}">Add to Cart</button>
                    <button @click="removeFromCart" :disabled="emptyCart" :class="{ disabledButton: emptyCart}">Remove from Cart</button>
                </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {

        }
    },
    methods: {
        getSelectedVariant() {
            let variant = this.product.variants.find(q => q.skuCode === this.product.selectedSku);
            return variant;
        },
        updateProduct(variant) {
            this.product.selectedSku = variant.skuCode;
        },
        addToCart() {
            let variant = this.getSelectedVariant();
            if (variant.inventory > 0) {
                --variant.inventory;
                this.$emit('add-to-cart', variant);
            }
        },
        removeFromCart() {
            let variant = this.getSelectedVariant();

            ++variant.inventory;
            this.$emit('remove-from-cart', variant);
        }
    },
    computed: {
        getProductImage() {
            return this.getSelectedVariant().image;
        },
        getTitle() {
            let onSale = this.getSelectedVariant().onSale;
            let title = this.product.brand + " " + this.product.name;
            if (onSale) {
                title += " on Sale!"
            }

            return title;
        },
        hasEnoughStock() {
            return this.getSelectedVariant().inventory > 10;
        },
        hasMinStockLevel() {
            return this.getSelectedVariant().inventory <= 10 && this.getSelectedVariant().inventory > 0;
        },
        getShipping() {
            if (this.premium) {
                return "Free";
            }

            return this.product.defaultShipping;
        },
        emptyStock() {
            return this.getSelectedVariant().inventory == 0;
        },
        emptyCart() {
            let variant = this.getSelectedVariant();
            return variant.inventory === variant.inventoryLimite;
        },
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        products: [{
                brand: 'Vue Mastery',
                name: 'Socks',
                details: ["80% cotton", "20% polyester", "Gender-neutral"],
                sizes: ["P", "M"],
                variants: [
                    { skuCode: 1054, color: "green", image: './assets/vmSocks-green-onWhite.jpg', inventory: 12, inventoryLimite: 12, onSale: true, price: 7.20, onSale: true },
                    { skuCode: 1055, color: "blue", image: './assets/vmSocks-blue-onWhite.jpg', inventory: 3, inventoryLimite: 3, onSale: false, price: 7.40, onSale: false }
                ],
                selectedSku: 1054,
                defaultShipping: 4.20
            },
            {
                brand: 'CBF',
                name: 'Football Shirts',
                details: ["40% cotton", "60% polyester", "Gender-man"],
                sizes: ["P", "M", "G", "GG", "XL"],
                variants: [
                    { skuCode: 1023, color: "white", image: './assets/camisa-santos.jpg', inventory: 3, inventoryLimite: 3, onSale: true, price: 99.99, onSale: true },
                    { skuCode: 1024, color: "red", image: './assets/camisa-flamengo.jpg', inventory: 8, inventoryLimite: 8, onSale: true, price: 120.50, onSale: false },
                    { skuCode: 1025, color: "dodgerblue", image: './assets/camisa-gremio.jpg', inventory: 12, inventoryLimite: 12, onSale: true, price: 70.39, onSale: true },
                    { skuCode: 1026, color: "darkblue", image: './assets/camisa-cruzeiro.jpg', inventory: 20, inventoryLimite: 20, onSale: true, price: 40.15, onSale: true }
                ],
                selectedSku: 1023,
                defaultShipping: 7.90
            }
        ],
        cart: []
    },
    computed: {
        getTotalCart() {
            if (this.cart.length == 0) return 0;

            return this.cart.reduce((a, b) => ({ quantity: a.quantity + b.quantity })).quantity;
        }
    },
    methods: {
        addToCart(variant) {
            let cartItem = this.cart.find(w => w.skuCode == variant.skuCode)
            if (cartItem) {
                ++cartItem.quantity;
            } else {
                this.cart.push({ skuCode: variant.skuCode, quantity: 1 });
            }
        },
        removeFromCart(variant) {
            let cartItem = this.cart.find(w => w.skuCode == variant.skuCode)

            if (cartItem.quantity > 1) {
                debugger;
                --cartItem.quantity;
            } else {
                debugger;
                this.cart.pop(cartItem);
            }

        },
    }
});