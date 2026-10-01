# NAAG NOOL UP
## Website Product Blueprint

### 1. PRODUCT DEFINITION

**Naag Nool UP** is a universal women’s empowerment brand and movement built around helping women live with greater intention, confidence, self-worth, and agency.

The website should therefore feel like **more than an online shop**. It should communicate the movement first, while making the journals and other products easy to discover and purchase.

### Brand Foundation

**Values**
- Resilient
- Worthy
- In Charge

**Tagline**
> The time to be ALIVE is now.

**Brand palette**
- Dusk
- Terracotta
- Amber
- Sage
- Sand

**Typography**
- Playfair Display — expressive/editorial headlines
- Cormorant Upright — elegant accent typography
- DM Sans — body text, navigation, buttons, UI

---

# 2. WEBSITE OBJECTIVES

The website has five primary jobs:

1. **Introduce the Naag Nool UP movement**
2. **Tell the brand story**
3. **Sell the six journal products**
4. **Show the social impact through Ayeyo Koris**
5. **Build a community around the brand**

The website must balance:

**Emotion → Story → Product → Purchase → Community**

It should never feel like a generic e-commerce template.

---

# 3. PRIMARY WEBSITE STRUCTURE

### Main navigation

**Home**
**Shop**
**About**
**Ayeyo Koris**
**Community**
**Contact**

Navigation should also contain a prominent **Cart** icon.

On mobile:
- Logo
- Menu
- Cart

---

# 4. HOMEPAGE

The homepage should function as the main brand experience.

### Section 1 — Hero

Large, emotionally powerful visual.

Headline centered around the brand message:

**The time to be ALIVE is now.**

Supporting message explaining Naag Nool UP in a concise, human way.

Primary CTA:

**Shop the Journals**

Secondary CTA:

**Discover Naag Nool UP**

The hero should use strong photography supplied by the client.

---

### Section 2 — The Movement

Introduce Naag Nool UP as a movement rather than immediately selling products.

Possible structure:

**You are resilient.  
You are worthy.  
You are in charge.**

Brief brand story underneath.

CTA:

**Our Story**

---

### Section 3 — The Journals

Introduce the six journal products.

Display:

- Product image
- Journal name
- Short description
- Price
- View product
- Add to cart

CTA:

**Explore All Journals**

The six products should be managed dynamically from the CMS/admin rather than hard-coded.

---

### Section 4 — Why Journaling?

A visually editorial section explaining the role of journaling in the Naag Nool UP philosophy.

This should educate rather than feel like aggressive sales copy.

---

### Section 5 — Ayeyo Koris

Dedicated impact section.

Explain:

**What is Ayeyo Koris?**

Explain how Naag Nool UP connects purchases/community participation with its broader impact.

There should be two clear actions:

**Learn More**

**Donate**

The Donate button redirects to the external donation destination.

Naag Nool UP does **not** need to recreate the external donation platform inside this website.

---

### Section 6 — Community

Invite visitors to become part of the Naag Nool UP community.

Possible CTA:

**Join the Community**

Capture:
- Name
- Email

Optional future marketing consent should be handled appropriately.

---

### Section 7 — Social Presence

Connect the brand's social platforms:

- TikTok
- Instagram
- Facebook
- YouTube

Use actual client-provided URLs.

---

### Section 8 — Final CTA

Strong closing statement connected to the brand philosophy.

Example direction:

**Your life is yours to live.**

CTA:

**Explore Naag Nool UP**

---

# 5. SHOP

The Shop page is the main commerce catalogue.

### Product grid

Each product card should contain:

- Product image
- Product name
- Short description
- Price
- Availability
- Add to Cart
- View Details

### Shop functionality

- Search
- Category/filter if categories exist
- Sorting
- Product availability
- Responsive grid
- Pagination or load-more if necessary

The six journals are the initial products.

The architecture should nevertheless allow additional products to be added later without rebuilding the website.

---

# 6. PRODUCT DETAIL PAGE

Each journal gets its own product page.

### Required sections

**Product gallery**
- Main image
- Additional images
- Zoom/lightbox

**Product information**
- Product name
- Description
- Price
- Availability
- Quantity selector
- Add to Cart

**Additional information**
- What the journal is
- Who it is for
- What makes it different
- Relevant specifications
- Shipping information

### Purchase experience

The user should be able to:

**Add to Cart → Continue Shopping**

or

**Add to Cart → Checkout**

---

# 7. CART

Cart should clearly show:

- Product
- Product image
- Quantity
- Unit price
- Subtotal
- Remove
- Cart total

Actions:

**Continue Shopping**

**Proceed to Checkout**

The cart must work properly across desktop and mobile.

---

# 8. CHECKOUT

Checkout should be simple and conversion-focused.

### Customer information

- Full name
- Phone number
- Email
- Delivery address
- City/location
- Additional delivery information where required

### Payment

Support:

**Visa**

**Mastercard**

**Somali mobile-money payments**

The exact mobile-money gateway/integration should use the payment provider available to the client.

The architecture must separate:
- Payment initiation
- Payment verification
- Transaction status
- Order status

### Order confirmation

After successful payment:

**Order confirmed**

Show:
- Order number
- Items
- Amount
- Payment status
- Delivery information
- Customer contact/support information

---

# 9. CUSTOMER ORDERS

Customers should be able to receive and/or access:

- Order confirmation
- Order number
- Order status
- Payment status
- Purchased products
- Total amount
- Delivery information

If customer accounts are enabled, they should have an account area containing:

**My Orders**
**Account Information**
**Saved information**

The implementation should keep the account experience simple rather than turning Naag Nool UP into a complex marketplace platform.

---

# 10. ABOUT PAGE

The About page should explain:

### Who is Naag Nool UP?

### Why does it exist?

### What does Naag Nool UP believe?

### The three values

**Resilient**

**Worthy**

**In Charge**

### The meaning behind the movement

This should be highly visual and editorial, using the client's photography and brand voice.

---

# 11. AYEYO KORIS PAGE

This deserves its own dedicated page.

Structure:

### Hero
**Ayeyo Koris**

### Introduction
Explain what Ayeyo Koris means and why it exists.

### Connection to Naag Nool UP
Explain the relationship between the brand and the initiative.

### Impact
Use approved client-provided information, stories, imagery, statistics, or testimonials.

### Get Involved

Two paths:

**Support / Donate**
→ external donation destination

**Join the Movement**
→ Community signup

Important:

The website should **not invent impact statistics, stories, beneficiaries, or financial claims**. Those must come from the client.

---

# 12. COMMUNITY PAGE

Purpose: turn visitors into members of the wider movement.

Content:

- Community introduction
- Why join
- What members can expect
- Signup form

Initial form:

- Name
- Email

Success state:

**You're in. Welcome to Naag Nool UP.**

The backend should store community signups securely.

---

# 13. CONTACT PAGE

Include:

- Contact form
- Email
- Social links
- Any client-provided business contact information
- FAQ link where useful

Contact form fields:

- Name
- Email
- Subject
- Message

Admin should be able to view/manage submissions.

---

# 14. FOOTER

Footer should contain:

### Brand
Naag Nool UP logo + short brand statement.

### Navigation
- Home
- Shop
- About
- Ayeyo Koris
- Community
- Contact

### Customer
- Shipping
- Returns
- Privacy Policy
- Terms & Conditions

### Social
- TikTok
- Instagram
- Facebook
- YouTube

### Newsletter/community signup

### Copyright

---

# 15. ADMIN / CMS

The website must have a proper backend/admin system.

Admin should be able to manage:

### Products
- Create
- Edit
- Delete
- Price
- Images
- Description
- Inventory
- Availability

### Orders
- View orders
- Payment status
- Order status
- Customer information
- Update status

### Customers
- View customer information
- View order history

### Community
- View/export community signups

### Contact
- View contact submissions

### Content
- Homepage sections
- About content
- Ayeyo Koris content
- Blog/content if activated
- Images
- Site settings

### Social links
Admin should be able to update social URLs without changing code.

---

# 16. BLOG / CONTENT SYSTEM

The architecture should support a content section because the brand is a movement, not only a store.

Potential future content:

- Stories
- Journal prompts
- Women's empowerment articles
- Community stories
- Ayeyo Koris updates
- Brand announcements

However, **do not create fake articles or placeholder editorial content and present them as real content**.

The admin should be able to create and publish content when the client supplies it.

---

# 17. PAYMENT ARCHITECTURE

Payment integration should be designed as a proper transaction workflow:

**Customer checkout**
↓
**Payment request**
↓
**Payment provider**
↓
**Payment verification**
↓
**Transaction recorded**
↓
**Order marked paid**
↓
**Customer receives confirmation**

Never mark an order as paid merely because the customer reaches a success URL.

The backend must verify payment status.

---

# 18. ORDER STATUS SYSTEM

Use clear states such as:

**Pending Payment**

→ **Paid**

→ **Processing**

→ **Ready / Shipped**

→ **Delivered**

Possible exception states:

**Payment Failed**

**Cancelled**

**Refunded**

Exact operational statuses can be adjusted once the client's delivery process is confirmed.

---

# 19. NOTIFICATIONS

The system should be architected so notifications can be added cleanly.

Important events:

- New order
- Successful payment
- Order status update
- Contact submission
- Community signup

Email notifications can be implemented where the required provider is available.

---

# 20. DESIGN DIRECTION

The visual identity should feel:

**Feminine without being cliché.**

**Warm without being childish.**

**Premium without being inaccessible.**

**Editorial without sacrificing usability.**

**Empowering without becoming overly motivational or generic.**

### Visual language

Use:

- Large editorial typography
- Strong photography
- Generous whitespace
- Soft organic shapes
- Elegant cards
- Subtle motion
- Warm neutral backgrounds
- Carefully controlled accent colors

Avoid:

- Generic Shopify-style layouts
- Excessive gradients
- Excessive rounded cards
- Overuse of icons
- Stock-photo aesthetics
- Overly corporate SaaS design
- Excessive animation

---

# 21. RESPONSIVE DESIGN

The website must be designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile is not an afterthought.

The complete shopping journey must work comfortably on a phone:

**Discover → Product → Cart → Checkout → Payment → Confirmation**

---

# 22. PERFORMANCE

The website should prioritize:

- Fast loading
- Optimized images
- Lazy loading
- Responsive images
- Minimal unnecessary JavaScript
- Good Core Web Vitals
- Efficient API/database queries
- Proper caching where appropriate

---

# 23. SEO

Every important public page should have:

- Page title
- Meta description
- Open Graph metadata
- Proper heading hierarchy
- SEO-friendly URLs
- Image alt text
- Canonical URLs where necessary
- Sitemap
- Robots configuration

Products should have structured metadata where appropriate.

---

# 24. SECURITY

The production website must include:

- Secure authentication
- Server-side validation
- Protected admin routes
- Role-based access
- Secure payment handling
- Input sanitization
- Rate limiting where appropriate
- Secure file uploads
- Environment variables for secrets
- No exposed API keys
- Database access controls
- HTTPS in production

Payment card information should **not** be stored directly by Naag Nool UP unless the selected payment architecture explicitly requires and legally supports it.

---

# 25. ANALYTICS

The website should be prepared for analytics covering:

- Visitors
- Product views
- Add to cart
- Checkout initiation
- Successful purchases
- Community signups
- Contact submissions

The exact analytics provider can be connected once the client chooses the account/provider.

---

# 26. INITIAL WEBSITE SITEMAP

```text
/
├── Home
├── Shop
│   ├── All Journals
│   └── Product Details
├── About
├── Ayeyo Koris
├── Community
├── Contact
├── Cart
├── Checkout
├── Order Confirmation
├── Account
│   └── Orders
├── Privacy Policy
├── Terms & Conditions
├── Shipping Policy
└── Returns Policy
```

### Admin

```text
/admin
├── Dashboard
├── Products
├── Orders
├── Customers
├── Community
├── Contact Messages
├── Content
├── Media
├── Social Links
├── Settings
└── Admin Users
```

---

# 27. DEVELOPMENT PRINCIPLE

The website should be built as a **real production system**, not a visual prototype.

That means:

**Real database**

**Real product management**

**Real inventory**

**Real cart**

**Real checkout**

**Real orders**

**Real payment integration**

**Real admin dashboard**

**Real forms**

**Real content management**

**Real authentication where required**

**Real deployment**

No fake buttons.

No hard-coded products.

No simulated checkout.

No mock admin dashboard presented as finished functionality.

---

# 28. OUT OF SCOPE

The following are explicitly **NOT part of this project**:

- Naag Nool UP affirmation app
- iOS application
- Android application
- Daily affirmation system
- App notification system
- App Store / Google Play development
- Mobile-app backend features unrelated to the website

The website may mention a future digital product/app only if the client wants that messaging, but we do not build the app.

---

# 29. CLIENT MATERIALS REQUIRED

Before final production launch, the client needs to provide:

### Brand
- Final logo
- Brand assets
- Approved brand photography
- Final brand copy

### Products
For each of the six journals:
- Product name
- Description
- Price
- Product photos
- Product specifications
- Available quantity
- Shipping information

### Business
- Contact information
- Social media URLs
- Shipping/delivery rules
- Return/refund policy
- Terms & conditions
- Privacy policy

### Payments
- Selected payment gateway
- Merchant credentials
- Required verification information

### Ayeyo Koris
- Approved description
- Approved images
- Impact information
- External donation URL

### Community
- Signup destination/CRM if one exists
- Welcome/confirmation messaging

---

# 30. MVP DEFINITION

The first production release should contain:

**Brand experience**
+  
**Six journals**
+  
**Shop**
+  
**Product pages**
+  
**Cart**
+  
**Checkout**
+  
**Payment**
+  
**Orders**
+  
**Customer experience**
+  
**Admin**
+  
**About**
+  
**Ayeyo Koris**
+  
**Community**
+  
**Contact**
+  
**Policies**
+  
**SEO**
+  
**Responsive design**

That is the actual Naag Nool UP website.

The affirmation app is completely outside this build.