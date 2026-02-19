# **Capstone 3 Demo App:**

<a id="table-of-contents"></a>
### **Table of Contents**
- [I. Application Name: ECommerce MEVN App](#i-application-name-ecommerce-mevn-app)
- [II. Team Members](#ii-team-members)
- [III. Features](#iii-features)
- [IV. Requirements](#iv-requirements)
- [V. Capstone 3 Timelines](#v-capstone-3-timelines)
- [VI. Stretch Goals](#vi-stretch-goals)

### **I. Application Name: ECommerce App** 

### **II. Team Members:**
- #### **Edryl Palinis**
- #### **Norman Chingcuanco**

### **III. Features:**
[⬆️ Return to Table of Contents](#table-of-contents)

#### Features by Student-1
[⬆️ Return to Table of Contents](#table-of-contents)
- #### lorem ipsum
- #### lorem ipsum

#### Features by Student-2
- #### lorem ipsum
- #### lorem ipsum

### *** IV. Requirements

- Register Page
- Login Page
- Products Catalog Page
  - Retrieve all active products
  - Retrieve single product
- Admin Dashboard
  - Create Product
  - Retrieve all products
  - Update Product information
  - Deactivate/reactivate product

![Expected Output](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/2.png)

- Cart View
  - Add to Cart
  - Get All Cart
  - Update quantity
  - Subtotal for each item
  - Total price for all items
  - Remove Item from cart
  - Clear all items from cart
  - Checkout Order
    - Non-admin User checkout (Create Order)

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/3.png)

- Page Endpoints
  - Register - /register
  - Login - /login
  - Products - /products
    - User Accessible
  - Admin Dashboard - /products
    - Admin Accessible
  - Cart - /cart

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/4.png)

- Inside your capstone 3 repo, create a capstone3.json file. Inside add the following code:

{
  "url": "hostedUrl"
}

- Update the hostedUrl upon AWS hosting.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/5.png)

A Registration Page with proper form validation (all fields must be filled and passwords must match) that must redirect the user to the login page once successfully submitted.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/6.png)

A Login Page that must redirect the user to the either the home page or the products catalog once successfully authenticated.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/7.png)

A Products Catalog Page where you can retrieve all active products.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/8.png)

Must be in Bootstrap Cards.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/9.png)

Must have Details button, upon clicking leads to Product Details.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/10.png)

A Product Catalog Page where you can retrieve specific details of the products and Add to Cart.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/11.png)

This page must be where we can add to cart.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/12.png)

Once the customer check the product, they can see the Add to Cart button.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/13.png)

They can add should be able to add multiple products to the cart.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/14.png)

A Cart View page where you can get all items the user has added to their cart (and their quantities).

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/15.png)

Cart Feature

- A Cart View page with the following features:
  - Show all items the user has added to their cart (and their quantities)
  - Change product quantities
  - Remove products from cart
  - Subtotal for each item
  - Total price for all items
  - Clear all Cart button
  - A working checkout button/functionality.
    - When the user checkout their cart out, redirect them to either the homepage or the Order History page

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/16.png)

Cart Feature

- Cart Page Requirements:
  - Checkout Button
    - Element Text: Checkout
  - Clear Cart Button
    - Element Text: Clear Cart
  - Remove Button
    - Element Text: Remove

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/17.png)

Requirements

An Admin Panel/Dashboard where an admin can retrieve all products.

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/18.png)

Requirements

- An Admin Panel/Dashboard with the following features:
  - Retrieve list of all products (available or unavailable)
  - Create new product
  - Update product information
  - Deactivate/reactivate product

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/19.png)

Requirements

- Admin Dashboard Requirements:
  - Add Product Button
    - Element text: “Add Product”
  - Show Orders Button
    - Element text: “Orders”
  - Update Button
    - Element text: “Update”
  - Disable Button
    - Element text: “Disable”
  - Activate
    - Element text: “Activate”

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/20.png)

Other Requirements

- A fully-functioning Navbar with proper dynamic rendering (Register/Login links for users not logged in, Logout link for users who are, etc)
- App must be single-page and utilize proper routing (no navigating to another page/reloading)
- Registration/Login pages must be inaccessible to users who are logged-in
- Apart from users who are not logged-in, Admin must not be able to add products to their cart
- Do not create a website other than the required e-commerce app
- Do not use templates found in other sites or existing premade NPM packages that replicate a required feature

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Requirements/21.png)

### **V. Capstone 3 Timelines**
[⬆️ Return to Table of Contents](#table-of-contents)

| Session | Deliverables |
|----------|----------|
| Session 70 | ○ Register Page <br> ○ Login Page <br> ○ Products Catalog Page <br> &nbsp;&nbsp;&nbsp;&nbsp;- Add Readme.md and add the name of the members |
| Session 71 | ○ Admin Dashboard Page <br> &nbsp;&nbsp;&nbsp;&nbsp;- Create Product <br> &nbsp;&nbsp;&nbsp;&nbsp;- Retrieve All Products <br> &nbsp;&nbsp;&nbsp;&nbsp;- Update Product Information <br> &nbsp;&nbsp;&nbsp;&nbsp;- Deactivate/reactivate Product |
| Session 72 | ○ Cart View Page <br> &nbsp;&nbsp;&nbsp;&nbsp;- Add to Cart <br> &nbsp;&nbsp;&nbsp;&nbsp;- Get All Cart <br> &nbsp;&nbsp;&nbsp;&nbsp;- Update Quantity |
| Session 73 | ○ Cart View Page <br> &nbsp;&nbsp;&nbsp;&nbsp;- Subtotal for each item <br> &nbsp;&nbsp;&nbsp;&nbsp;- Total price for all items <br> &nbsp;&nbsp;&nbsp;&nbsp;- Remove item from cart <br> &nbsp;&nbsp;&nbsp;&nbsp;- Clear all items from cart |
| Session 74 | ○ Checkout Order <br> &nbsp;&nbsp;&nbsp;&nbsp;- Non-admin User Checkout (Create Order) <br> ○ Stretch Goals <br> ○ Initial Deployment|

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/CSP3%20Timeline/1.png)

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/CSP3%20Timeline/2.png)

### **VI. Stretch Goals**
[⬆️ Return to Table of Contents](#table-of-contents)

#### UI / UX
- Full responsiveness (Mobile / Tablet / Desktop)
- Product images
- Hot / Featured products section
- Light / Dark Mode Toggle

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Stretch%20Goals/1.png)

#### User Features
- View user profile details
- Change password
- Order history
  - View all orders made by a user

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Stretch%20Goals/2.png)  
  
#### Admin Features
- Set a user as Admin
- Order history
  - View all orders made by all users

![Alt Text Here](https://git.zuitt.co/B598/csp3-b598-palinis-chingcuanco/raw/branch/master/s70-s74/Stretch%20Goals/3.png)  

#### Payment Integration
- Integrate Payment Option API (e.g., Stripe, PayPal, GCash)

[⬆️ Return to Table of Contents](#table-of-contents)