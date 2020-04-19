Vue.filter('money', function(value, ignore) {
    if (ignore) return value;
    if (isNaN(value)) return 'NaN';
    return "$ " + value.toFixed(2);
});

Vue.component('product-card-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">    
        <p><b>Would you recommend this product?</b></p>
        <input type="radio" id="yes" v-model="newReview.recommend" value="yes">Yes</input>
        <input type="radio" id="no" v-model="newReview.recommend" value="no">No</input>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="newReview.name" placeholder="name">
        </p>
        
        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="newReview.review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="newReview.rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
            </select>
        </p>
            
        <p>
            <input type="submit" value="Submit">  
        </p>    

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
    
    </form>
    `,
    data() {
        return {
            newReview: {
                name: null,
                review: null,
                rating: null,
                recommend: null
            },
            emptyReview: {
                name: null,
                review: null,
                rating: null,
                recommend: null
            },
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];

            if (!this.newReview.recommend) { this.errors.push("Your opinion required."); }
            if (!this.newReview.name) { this.errors.push("Name required."); }
            if (!this.newReview.review) { this.errors.push("Review required."); }
            if (!this.newReview.rating) { this.errors.push("Rating required."); }

            if (this.errors.length == 0) {
                this.$emit("post-review", this.newReview);

                this.newReview = this.emptyReview;
            }
        }
    }
})

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
                <div v-for="variant in this.product.variants" :key="variant.variantId" class="color-box" :style="{ backgroundColor: variant.color }" @click="updateProduct(variant)">
                </div>
                <br />
                <span>Sizes:</span>
                    <label v-for="size in this.product.sizes">{{ size + " " }}</label>
                <div>
                    <button @click="addToCart" :disabled="emptyStock" :class="{ disabledButton: emptyStock}">Add to Cart</button>
                    <button @click="removeFromCart" :disabled="emptyCart" :class="{ disabledButton: emptyCart}">Remove from Cart</button>
                </div>

                <br />
                <div class="tabArea">
                    <div class="tabTitle">
                        <span class="tab" v-for="(tab, index) in tabs" :class="{ activeTab: selectedTab === tab }" @click="selectedTab = tab" :key="index">{{ tab }}</span>
                    </div>

                    <product-card-review v-if="selectedTab === 'Make a Review'" @post-review="postReview"></product-card-review>
                    <div class="reviews" v-if="selectedTab === 'Reviews'">
                        <h2>Reviews</h2>
                        <p v-if="reviews.length == 0" >There are no reviews yet.</p>
                        <div v-else>
                            <ul>
                                <li v-for="item in reviews">{{ showReview(item) }}<p>{{ "Review: " + item.review }}</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            reviews: [],
            selectedTab: 'Reviews',
            tabs: ['Reviews', 'Make a Review']
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
        },
        postReview(review) {
            this.reviews.push(review);
        },
        showReview(review) {
            if (review.recommend === "yes") {
                return review.name + " recommended this product and rated it with " + review.rating + " stars";
            } else {
                return review.name + " did not recommend this product and rated it with " + review.rating + " stars";
            }
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
    created() {
        document.title = "Vue Mastery - Intro to Vue - Forms";
    },
    computed: {
        getTotalCart() {
            if (this.cart.length == 0) return 0;

            var totalItems = 0;
            var totalCosts = 0;

            for (var i = 0; i < this.cart.length; i++) {
                totalItems += this.cart[i].quantity;
                totalCosts += this.cart[i].quantity * this.cart[i].price;
            }

            return "Items: " + totalItems + " - Price $ " + totalCosts.toFixed(2);
        }
    },
    methods: {
        addToCart(variant) {
            let cartItem = this.cart.find(w => w.skuCode == variant.skuCode)
            if (cartItem) {
                ++cartItem.quantity;
            } else {
                this.cart.push({ skuCode: variant.skuCode, quantity: 1, price: variant.price });
            }
        },
        removeFromCart(variant) {
            let cartItem = this.cart.find(w => w.skuCode == variant.skuCode)

            if (cartItem.quantity > 1) {
                --cartItem.quantity;
            } else {
                this.cart.pop(cartItem);
            }

        },
    }
});