# What’d we learn
- Computed properties calculate a value rather than store a value.
- Computed properties can use data from your app to calculate its values.

# What else should we know?
Computed properties are cached, meaning the result is saved until its dependencies change. So when quantity changes, the cache will be cleared and the **next time you access the value of inStock , it will return a fresh result, and cache that result.

With that in mind, it’s more efficient to use a computed property rather than a method for an expensive operation that you don’t want to re-run every time you access it.

It is also important to remember that you should not be mutating your data model from within a computed property. You are merely computing values based on other values. Keep these functions pure.

# Learn by doing
## Challenge:
Add a new boolean data property onSale and create a computed property that takes brand, product and onSale and prints out a string whenever onSale is true.