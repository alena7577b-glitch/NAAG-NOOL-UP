# MASTER GOOGLE ANTIGRAVITY DEVELOPMENT PROMPT
## NAAG NOOL UP — COMPLETE WEBSITE

You are the lead product architect, senior UX/UI designer, senior full-stack engineer, database architect, QA engineer, security engineer, and deployment engineer responsible for designing and developing the complete **Naag Nool UP website** from beginning to production.

This is a real production website, not a prototype, static mockup, or visual demonstration.

Your responsibility is to take this specification, make sensible implementation decisions where details are not explicitly defined, build the complete system, test it, fix issues, and prepare it for production deployment.

Do not stop after creating the UI.

The final result must be a functional, maintainable, responsive, secure, production-ready website.

---

# 1. PROJECT IDENTITY

## Brand

**Naag Nool UP**

## Brand positioning

Naag Nool UP is a women's empowerment brand and movement.

The website must communicate the brand as a meaningful movement and lifestyle/empowerment brand while also functioning as a premium e-commerce website for its journal products.

The website should NOT feel like a generic online store.

The experience should communicate:

- confidence
- self-worth
- personal growth
- femininity
- resilience
- intentional living
- warmth
- community
- premium quality

## Core brand values

**Resilient**  
**Worthy**  
**In Charge**

## Brand tagline

**“The time to be ALIVE is now.”**

---

# 2. PROJECT SCOPE

IMPORTANT:

Build ONLY the **Naag Nool UP WEBSITE**.

Do NOT build the Naag Nool UP affirmation application.

The following are explicitly OUT OF SCOPE:

- iOS app
- Android app
- affirmation app
- daily affirmation engine
- app notifications
- mobile application screens
- App Store integration
- Google Play integration
- app-specific functionality

The website may mention a future app if client content requires it, but the app itself must NOT be developed.

---

# 3. PRIMARY WEBSITE OBJECTIVES

The website has five primary objectives:

1. Introduce Naag Nool UP.
2. Communicate the movement and brand story.
3. Sell Naag Nool UP journal products.
4. Explain and showcase the Ayeyo Koris initiative.
5. Build the Naag Nool UP community.

The experience should follow this conceptual journey:

**Discover → Understand → Connect → Explore → Purchase → Join**

Do not make the website feel like the user has entered a marketplace before understanding the brand.

Brand experience comes first.

Commerce should feel naturally integrated into the brand.

---

# 4. BRAND DESIGN SYSTEM

Use the established Naag Nool UP visual direction.

## Color direction

Use the following established palette:

- Dusk
- Terracotta
- Amber
- Sage
- Sand

Do not randomly introduce unrelated colors.

Create a complete design-token system from these colors.

Use the palette with restraint.

The website should feel sophisticated rather than colorful for the sake of being colorful.

## Typography

Use:

### Primary editorial heading font
**Playfair Display**

### Secondary elegant/accent font
**Cormorant Upright**

### UI/body font
**DM Sans**

Establish a consistent typography hierarchy:

- Display
- H1
- H2
- H3
- H4
- Body large
- Body
- Small text
- Caption
- Button text
- Navigation

Typography should be responsive.

---

# 5. DESIGN PHILOSOPHY

The visual language must feel:

**Feminine without being cliché.**

**Premium without being intimidating.**

**Warm without looking childish.**

**Editorial without sacrificing usability.**

**Modern without becoming generic.**

**Empowering without relying on generic motivational design.**

Use:

- strong editorial typography
- high-quality photography
- generous whitespace
- organic shapes
- elegant composition
- subtle borders
- refined product cards
- intentional spacing
- subtle micro-interactions
- restrained animations
- warm neutral backgrounds

Avoid:

- generic Shopify templates
- generic SaaS UI
- excessive gradients
- excessive glassmorphism
- excessive rounded cards
- excessive shadows
- excessive animations
- cliché women's empowerment graphics
- random stock photography
- unnecessary icons
- visually noisy layouts

---

# 6. TECHNOLOGY REQUIREMENTS

Before implementation, inspect the available development environment and choose a modern, maintainable production stack.

The architecture must support:

- responsive frontend
- backend/API
- relational database
- authentication
- product management
- inventory
- orders
- payments
- content management
- media management
- community signups
- contact submissions
- admin dashboard
- SEO
- analytics
- secure deployment

Prefer a modern production-ready architecture rather than a collection of disconnected frontend mockups.

If a framework is already established in the project, respect it unless there is a strong technical reason to change it.

Do not introduce unnecessary technologies.

Keep the architecture understandable and maintainable.

---

# 7. BEFORE CODING

Before writing the main implementation:

1. Inspect the project directory.
2. Identify existing files and configuration.
3. Identify available assets.
4. Identify existing dependencies.
5. Determine the appropriate architecture.
6. Establish the database schema.
7. Establish routing.
8. Establish authentication and authorization strategy.
9. Establish the design system.
10. Establish the component architecture.

Create a clear internal implementation plan.

Do not destroy existing useful work without understanding it first.

---

# 8. WEBSITE SITEMAP

Build the following public website structure:

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

Also create an administration area:

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

# 9. HOMEPAGE

Build the homepage as the primary brand experience.

## Section 1 — Hero

Create a visually powerful hero section.

Primary message:

**The time to be ALIVE is now.**

Include supporting brand copy supplied by the client when available.

Primary CTA:

**Shop the Journals**

Secondary CTA:

**Discover Naag Nool UP**

Use high-quality client-provided photography.

Do not generate fake product photography.

Do not invent testimonials or statistics.

---

# 10. MOVEMENT SECTION

Introduce Naag Nool UP as a movement.

Feature the three core values:

**Resilient**

**Worthy**

**In Charge**

Create a visually distinctive editorial composition.

CTA:

**Our Story**

which routes to the About page.

---

# 11. JOURNAL PRODUCT SECTION

Create a premium product showcase section.

The initial product collection contains six journals.

Products must come from the database.

Do not hard-code the products into the frontend.

Each product card should support:

- product image
- product name
- short description
- price
- availability
- View Product
- Add to Cart

Primary CTA:

**Explore All Journals**

The architecture must allow additional products to be added later through the admin panel without changing source code.

---

# 12. JOURNALING SECTION

Create an editorial section explaining the philosophy behind journaling.

The purpose is to help visitors understand the product and connect it to the Naag Nool UP philosophy.

Do not invent medical, psychological, scientific, or therapeutic claims.

Use only client-approved copy.

If content has not been supplied, create a clearly marked CMS placeholder rather than presenting invented claims as official brand content.

---

# 13. AYEYO KORIS SECTION

Create a prominent homepage section for **Ayeyo Koris**.

The section should explain the initiative using client-approved information.

Include:

**Learn More**

and

**Donate**

The Donate action must redirect to the external donation destination provided by the client.

Do not create a fake internal donation system unless specifically instructed later.

Do not invent:

- beneficiaries
- statistics
- impact numbers
- financial claims
- stories

---

# 14. COMMUNITY SECTION

Create a community invitation section.

Purpose:

Turn website visitors into members of the wider Naag Nool UP community.

Include a concise explanation and signup form.

Initial fields:

- Name
- Email

Store submissions securely.

Display a clear success state after submission.

Example direction:

**You're in. Welcome to Naag Nool UP.**

Do not use this exact copy if the client provides different approved wording.

---

# 15. SOCIAL MEDIA SECTION

Provide links to the official social media channels.

Potential platforms:

- TikTok
- Instagram
- Facebook
- YouTube

Do not invent URLs.

Store social URLs in the admin/CMS so administrators can update them without code changes.

---

# 16. FINAL HOMEPAGE CTA

Create a strong closing CTA that returns the visitor to the brand purpose.

Possible direction:

**Your life is yours to live.**

CTA:

**Explore Naag Nool UP**

If the client provides final copy, use that instead.

---

# 17. SHOP PAGE

Create a dedicated premium shop page.

Features:

- product grid
- search
- sorting
- filtering where relevant
- product availability
- responsive layout
- pagination or load-more when necessary

Initial collection:

Six journals.

The product architecture must be scalable for future products.

---

# 18. PRODUCT DETAIL PAGE

Each product must have its own dynamic page.

Include:

## Product gallery

- main image
- additional images
- image zoom/lightbox where appropriate

## Product information

- product name
- description
- price
- stock/availability
- quantity selector
- Add to Cart

## Additional information

Support CMS-managed sections for:

- journal description
- intended audience
- features
- specifications
- shipping information

Do not invent product specifications.

---

# 19. CART

Create a fully functional shopping cart.

Users must be able to:

- add products
- change quantities
- remove products
- see subtotal
- see total
- continue shopping
- proceed to checkout

The cart must persist appropriately according to the authentication/session architecture.

Handle empty-cart state elegantly.

---

# 20. CHECKOUT

Create a simple, trustworthy checkout experience.

Collect:

- full name
- phone number
- email
- delivery address
- city/location
- additional delivery information where necessary

Payment methods:

- Visa
- Mastercard
- Somali mobile-money payment

The exact payment provider/gateway must be configured from client-provided credentials and documentation.

Never fabricate payment credentials.

Never use fake payment success in production.

---

# 21. PAYMENT ARCHITECTURE

Implement payment as a proper transaction lifecycle.

```text
Customer Checkout
      ↓
Create Order
      ↓
Initiate Payment
      ↓
Payment Provider
      ↓
Verify Payment
      ↓
Record Transaction
      ↓
Mark Order Paid
      ↓
Send Confirmation
```

Important:

Never mark an order as paid merely because the user reaches a success page.

Payment must be verified through the appropriate backend mechanism.

Implement:

- payment initiation
- payment verification
- transaction record
- success/failure state
- error handling
- duplicate-payment protection
- order/payment relationship

Use environment variables for all secrets.

---

# 22. ORDER SYSTEM

Create a proper order system.

Suggested states:

- Pending Payment
- Paid
- Processing
- Ready / Shipped
- Delivered
- Cancelled
- Refunded

Allow the admin to update appropriate order statuses.

Customers must be able to see their order status.

The system must maintain an auditable order history.

---

# 23. CUSTOMER ACCOUNT

Create a clean customer account experience.

Include:

- profile information
- order history
- order details
- account settings

Do not overcomplicate the account system.

The website is not a social network.

---

# 24. ABOUT PAGE

Build an editorial About page.

Sections should communicate:

- Who Naag Nool UP is
- Why it exists
- The movement
- Brand philosophy
- Resilient
- Worthy
- In Charge

Use client-provided story and photography.

Do not invent founder biographies, history, achievements, or claims.

---

# 25. AYEYO KORIS PAGE

Create a dedicated Ayeyo Koris page.

Structure:

### Hero

Ayeyo Koris

### Introduction

What it is.

### Purpose

Why it exists.

### Relationship to Naag Nool UP

How the initiative connects to the brand.

### Impact

Client-provided information only.

### Get Involved

Donation CTA and community CTA.

Donation must redirect to the client-provided external destination.

---

# 26. COMMUNITY PAGE

Create a dedicated Community page.

Include:

- introduction
- reason to join
- community philosophy
- signup form

Initial fields:

- Name
- Email

Store submissions securely.

Provide appropriate consent/privacy language if required.

---

# 27. CONTACT PAGE

Create:

- contact form
- business contact details
- social links
- support information

Contact form:

- name
- email
- subject
- message

Store submissions securely.

Admin must be able to view submissions.

---

# 28. FOOTER

Include:

### Brand

Naag Nool UP logo.

Short brand statement.

### Navigation

- Home
- Shop
- About
- Ayeyo Koris
- Community
- Contact

### Policies

- Privacy Policy
- Terms & Conditions
- Shipping Policy
- Returns Policy

### Social

Official social links.

### Community

Email/signup CTA.

### Copyright

Use current year dynamically.

---

# 29. ADMIN DASHBOARD

Build a real administrative system.

The admin dashboard should not be a fake frontend.

It must connect to the actual database.

## Dashboard

Display useful operational information:

- orders
- sales
- products
- customers
- community signups
- contact messages

Do not create fake analytics numbers.

If there is no real data, display appropriate empty states.

---

# 30. PRODUCT MANAGEMENT

Admin can:

- create product
- edit product
- delete/archive product
- upload product images
- update price
- update description
- update stock
- set availability
- manage product metadata

Products must be database-driven.

---

# 31. ORDER MANAGEMENT

Admin can:

- view all orders
- search orders
- filter orders
- open order details
- see customer information
- see payment status
- see order status
- update order status
- review transaction information

---

# 32. CUSTOMER MANAGEMENT

Admin can:

- view customers
- search customers
- view customer profile
- view order history

Do not expose sensitive information unnecessarily.

---

# 33. COMMUNITY MANAGEMENT

Admin can:

- view community signups
- search/filter signups
- export data where appropriate

Respect privacy and data protection requirements.

---

# 34. CONTACT MANAGEMENT

Admin can:

- view contact submissions
- mark submissions as handled
- search/filter submissions

---

# 35. CONTENT MANAGEMENT

Build CMS functionality for:

- homepage content
- hero content
- banners
- About content
- Ayeyo Koris content
- community content
- announcements
- blog/news content
- SEO pages
- images
- social links
- site settings

The admin should be able to update content without editing source code.

---

# 36. BLOG / NEWS

Create a content architecture that supports:

- article creation
- title
- slug
- featured image
- body
- excerpt
- author
- publication status
- publication date
- SEO metadata

Support:

Draft

Published

Archived

Do not populate the blog with fake articles.

---

# 37. MEDIA MANAGEMENT

Create secure media handling for:

- product images
- logos
- banners
- blog images
- general documents

Implement:

- file validation
- file size restrictions
- secure storage
- appropriate naming
- image optimization
- deletion/replacement handling

Never expose private storage credentials.

---

# 38. AUTHENTICATION & AUTHORIZATION

Implement secure authentication.

Customer access:

- registration
- login
- logout
- password recovery where applicable

Admin access must be protected.

Use role-based permissions.

At minimum:

### Customer

Customer functionality.

### Admin

Full website management.

### Super Admin

System-level management.

If additional operational roles are required later, design the authorization architecture so they can be added without restructuring the entire system.

---

# 39. DATABASE ARCHITECTURE

Design a normalized relational database.

At minimum consider entities for:

- users
- roles
- permissions
- products
- product images
- inventory
- orders
- order items
- payments
- customers
- community signups
- contact submissions
- content/pages
- blog posts
- media
- social links
- site settings

Create proper:

- primary keys
- foreign keys
- indexes
- timestamps
- status fields
- relationships

Do not duplicate data unnecessarily.

Do not store business logic only in frontend state.

---

# 40. INTERNATIONALIZATION

The website supports:

**English**

**Somali**

**Arabic**

Arabic must support RTL.

Implement internationalization from the beginning.

Do NOT build English first and attempt to manually retrofit Arabic later.

The architecture should allow:

- translated UI
- translated CMS content
- translated navigation
- translated product content where supplied
- translated notifications
- translated metadata

Language preference should persist appropriately.

The language switcher must be accessible.

---

# 41. RESPONSIVE DESIGN

Build mobile-first responsive behavior.

Test at minimum:

- small mobile
- large mobile
- tablet
- laptop
- desktop
- large desktop

Important:

The complete purchase journey must work on mobile.

```text
Homepage
→ Shop
→ Product
→ Cart
→ Checkout
→ Payment
→ Confirmation
```

No horizontal overflow.

No broken layouts.

No tiny unusable controls.

---

# 42. ACCESSIBILITY

Implement sensible accessibility standards.

Include:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible form labels
- meaningful alt text
- sufficient contrast
- accessible buttons
- accessible error messages
- screen-reader-friendly structure

Do not sacrifice accessibility for visual design.

---

# 43. SEO

Implement technical SEO.

Every public page should support:

- title
- meta description
- canonical URL where appropriate
- Open Graph metadata
- structured heading hierarchy
- clean URLs
- image alt text
- sitemap
- robots configuration

Products should have appropriate structured metadata where applicable.

Generate SEO metadata dynamically where appropriate.

---

# 44. PERFORMANCE

Optimize for production performance.

Implement where appropriate:

- optimized images
- responsive images
- lazy loading
- code splitting
- caching
- efficient database queries
- minimal unnecessary JavaScript
- optimized fonts
- CDN/media optimization where available

Do not sacrifice performance for decorative effects.

---

# 45. SECURITY

Treat security as a first-class requirement.

Implement:

- HTTPS in production
- secure authentication
- protected admin routes
- server-side authorization
- input validation
- output sanitization
- secure file uploads
- rate limiting where appropriate
- CSRF protection where applicable
- secure cookies where applicable
- environment variables
- no exposed secrets
- database access controls
- payment security
- audit-friendly transaction records

Never put API keys or payment secrets into frontend code.

---

# 46. ERROR HANDLING

Every major workflow needs proper error handling.

Examples:

Payment failed

Payment verification failed

Product out of stock

Product deleted while in cart

Invalid checkout information

Network/API failure

Database failure

Image upload failure

Contact form failure

Community signup failure

Show useful human-readable messages.

Do not expose stack traces or internal errors to customers.

---

# 47. EMPTY STATES

Design intentional empty states.

Examples:

No products

Empty cart

No orders

No search results

No blog posts

No community records

No contact messages

Empty admin dashboard

Empty analytics

Empty inventory

Do not leave blank screens.

---

# 48. LOADING STATES

Implement appropriate:

- skeletons
- loading indicators
- disabled button states
- payment processing states
- upload progress where appropriate

Prevent accidental duplicate submissions.

---

# 49. MICRO-INTERACTIONS

Use subtle motion.

Examples:

- hover states
- image transitions
- cart feedback
- button feedback
- page transitions
- menu transitions
- modal transitions

Animations must support the experience.

Do not over-animate the website.

Respect reduced-motion preferences where practical.

---

# 50. PRODUCT IMAGERY

Use client-provided product imagery when available.

Do not replace real product photos with random stock images.

If assets are missing during development:

Use clearly identifiable temporary placeholders.

Do not present placeholder content as final production content.

---

# 51. CONTENT RULE

This is extremely important.

Do not invent:

- company history
- founder information
- customer testimonials
- product specifications
- prices
- statistics
- impact numbers
- donation claims
- social media URLs
- payment credentials
- business addresses
- phone numbers
- email addresses
- legal claims

When information is missing:

Create a CMS-managed placeholder or clearly identify the missing client input.

The client owns the business content.

Your responsibility is to build the system that displays and manages it.

---

# 52. ANALYTICS

Prepare the website for analytics.

Track events such as:

- page view
- product view
- add to cart
- remove from cart
- begin checkout
- payment initiation
- purchase
- community signup
- contact submission

Do not fabricate analytics data.

Use the client's analytics provider/account when supplied.

---

# 53. TESTING

Do not consider the project complete when the page visually renders.

Test:

## Functional

- registration
- login
- logout
- product creation
- product editing
- inventory
- cart
- checkout
- payment
- orders
- admin
- community signup
- contact form
- CMS
- blog
- language switching

## Responsive

Test all major screen sizes.

## Browser

Test current major browsers.

## Security

Test:

- authorization
- protected routes
- input validation
- file uploads
- payment verification

## Edge cases

Test:

- out-of-stock product
- empty cart
- failed payment
- duplicate payment attempt
- invalid form
- missing image
- deleted product
- expired session
- network failure

---

# 54. PAYMENT TESTING

Do not use real payment credentials during development unless explicitly authorized.

Build a test/sandbox flow when the payment provider supports it.

Before production:

- configure production credentials securely
- test payment verification
- test failure states
- test duplicate transactions
- test webhook/callback handling
- confirm order/payment synchronization

---

# 55. ADMIN TESTING

Verify that:

Admin can manage products.

Admin can manage orders.

Admin can manage customers.

Admin can manage community submissions.

Admin can manage contact messages.

Admin can edit content.

Admin can manage media.

Admin can manage social links.

Admin cannot accidentally expose secrets.

---

# 56. CODE QUALITY

Write clean, maintainable code.

Use:

- reusable components
- consistent naming
- clear folder structure
- typed data where supported
- reusable validation
- reusable UI components
- service/API abstraction
- environment configuration
- proper error handling

Avoid:

- massive components
- duplicated code
- hard-coded business logic
- hard-coded products
- hard-coded prices
- fake API calls presented as production
- unnecessary dependencies

---

# 57. DESIGN SYSTEM

Create reusable components for:

- Navbar
- Footer
- Buttons
- Inputs
- Selects
- Cards
- Product cards
- Product gallery
- Modal
- Drawer
- Toast
- Alerts
- Tabs
- Breadcrumbs
- Pagination
- Tables
- Dashboard cards
- Status badges
- Empty states
- Loading states
- Forms

The design system must remain visually consistent throughout the website.

---

# 58. ADMIN UI DESIGN

The admin dashboard should not look like the public website.

It should be:

- clean
- efficient
- information-dense where necessary
- easy to navigate
- responsive
- professional

Prioritize usability over decoration.

---

# 59. PRODUCTION ARCHITECTURE

Separate:

### Development

Local development environment.

### Staging

Testing environment.

### Production

Live website.

Use environment variables for environment-specific configuration.

Never commit secrets.

Create appropriate production documentation.

---

# 60. DEPLOYMENT

Prepare the complete website for production deployment.

Deployment should include:

- frontend
- backend/API
- database
- media storage
- domain configuration
- HTTPS
- environment variables
- database migrations
- production build
- monitoring/logging where appropriate

Do not claim deployment is complete until the production environment is actually configured and tested.

---

# 61. BACKUPS

Implement a practical backup strategy for:

- database
- critical media
- configuration where appropriate

Document restoration procedures where practical.

---

# 62. FINAL ACCEPTANCE CRITERIA

The Naag Nool UP website is considered complete only when:

### Brand

The website accurately communicates Naag Nool UP.

### Design

The website looks premium, intentional, feminine, modern, and editorial.

### Commerce

Products can actually be purchased.

### Database

Real persistent data is used.

### Admin

The client can manage the website.

### Payments

The configured payment system can process and verify transactions.

### Orders

Orders are created and managed correctly.

### Community

Community registrations work.

### Contact

Contact submissions work.

### CMS

The client can manage required content.

### Languages

English, Somali, and Arabic work correctly.

### Arabic

RTL layout works correctly.

### Responsive

Desktop, tablet, and mobile work correctly.

### SEO

Core SEO infrastructure is implemented.

### Security

Sensitive systems are protected.

### Performance

The website is optimized for production.

### Testing

Critical user journeys have been tested.

---

# 63. DEVELOPMENT WORKFLOW

Work through the project in the following order:

## PHASE 1 — Foundation

- inspect project
- establish architecture
- configure project
- establish design tokens
- establish routing
- establish database
- establish environment configuration

## PHASE 2 — Core UI

- navbar
- footer
- global components
- homepage
- responsive system
- typography
- color system

## PHASE 3 — Commerce

- shop
- products
- product detail
- cart
- checkout
- customer account
- orders

## PHASE 4 — Backend

- database
- authentication
- product management
- inventory
- order management
- customer management

## PHASE 5 — Payments

- payment integration
- verification
- transaction records
- failure handling

## PHASE 6 — CMS

- content management
- blog
- media
- social links
- site settings

## PHASE 7 — Brand Pages

- About
- Ayeyo Koris
- Community
- Contact
- Policies

## PHASE 8 — Internationalization

- English
- Somali
- Arabic
- RTL

## PHASE 9 — Admin

- admin dashboard
- permissions
- management interfaces
- reports

## PHASE 10 — QA

- functional testing
- responsive testing
- payment testing
- security testing
- performance testing
- accessibility testing

## PHASE 11 — Production

- production configuration
- deployment
- database migration
- domain
- SSL
- final testing

---

# 64. IMPORTANT DEVELOPMENT RULE

Do not rush through the project by generating the entire website in one pass.

Build incrementally.

After each major phase:

1. Run the application.
2. Inspect the implementation.
3. Test the relevant workflows.
4. Fix errors.
5. Check responsive behavior.
6. Check console/build errors.
7. Continue only when the previous phase is stable.

Do not hide errors.

Do not ignore warnings that could affect production.

---

# 65. FINAL INSTRUCTION TO ANTIGRAVITY

You are not being asked to create a concept, landing-page mockup, or prototype.

You are being asked to build the complete **Naag Nool UP production website**.

Think like a senior product team.

Make reasonable implementation decisions when the specification does not explicitly define a technical detail.

However, do not invent business facts or client content.

Where a business decision is required but has not been provided:

- build the system in a configurable way
- use a sensible temporary development configuration
- clearly document what requires client input
- never present invented information as final

Prioritize:

**Correctness → User experience → Security → Maintainability → Performance → Visual polish**

The final product should feel like a professionally designed and engineered digital home for the Naag Nool UP brand—not a generated template.

Build the system completely.
Test it thoroughly.
Fix issues.
Then prepare it for production deployment.