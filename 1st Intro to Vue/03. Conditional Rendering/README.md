# What’d we learn
- There are Vue directives to conditionally render elements:
    - v-if
    - v-else-if
    - v-else
    - v-show

- If whatever is inside the directive’s quotes is truthy, the element will display.
- You can use expressions inside the directive’s quotes.
- V-show only toggles visibility, it does not insert or remove the element from the DOM.

# Learn by doing
## Challenge:
Add an onSale property to the product’s data that is used to conditionally render a span that says “On Sale!”