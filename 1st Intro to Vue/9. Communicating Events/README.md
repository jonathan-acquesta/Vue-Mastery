# What’d we learn
- A component can let its parent know that an event has happened with $emit
- A component can use an event handler with the v-on directive ( @ for short) to listen for an event emission, which can trigger a method on the parent
- A component can $emit data along with the announcement that an event has occurred
- A parent can use data emitted from its child

# Learn by doing
## Challenge:
Add a button that removes the product from the cart array by emitting an event with the id of the product to be removed.