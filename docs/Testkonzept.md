# Test Concept and Test Procedures – Techmodule E‑Commerce Platform

This document explains how the Techmodule E‑Commerce Platform is tested to ensure functionality and quality.  
It combines the practical testing instructions (how to run tests) with a wider **test concept** covering:

- Test object, user stories, architecture and criticality of different parts
- Test strategy, types of tests and the environments used
- Release and repository management and code‑quality practices
- Concrete test cases, including **blackbox tests** and example **test logs**

The focus is on **local developer workflow on Windows** and alignment with our repository and branch conventions.

**Technology overview**

- **Backend:** Spring Boot 3 (Java 21), JUnit 5, Spring Test, Mockito
- **Frontend:** Angular 20, Jasmine/Karma unit tests
- **E2E:** Playwright (planned/basic scaffold)
- **Orchestration:** Docker Compose for local dev (not needed for unit tests)

---

## 1. Test Object

**Project name:** Techmodule E‑Commerce Platform  
**Context:** School project and scaffold for a small online shop used in the Techmodule course.

### Purpose and scope

The system is a simplified e‑commerce platform that allows customers to:

- Browse a product catalogue and view details
- Add products to a shopping cart
- Register and log in
- Complete a checkout flow (with Stripe or a mocked payment)
- Review previous orders

There is also an **admin** part (depending on implementation) that lets administrators:

- Create, update and delete products
- Manage shop data (e.g. stock levels, prices)

### Deployment / usage

- Developed locally on Windows with:
    - `e-commerce-backend` (Spring Boot)
    - `e-commerce-frontend` (Angular)
    - Optional DB (PostgreSQL via Docker) and Stripe sandbox or mocks
- Demonstrated and evaluated in a school context; not intended for real production traffic.

---

## 2. User Stories

These are the main user stories to be tested. Each is independent and provides clear user value.

### US‑1: Browse product catalogue

**Story**  
As a **visitor**, I want to see a list of products so that I can decide what to buy.

**Acceptance criteria**

- The home page displays a product list with image, name and price.
- Clicking a product shows a detail view with description and price.
- If no products are available, a clear empty‑state message appears.

**Definition of Done / Non‑functional**

- Backend returns product lists in under 500 ms for up to 100 items (local dev).
- No console errors in the browser while browsing.
- At least one unit test covers this (backend) and one test covers the frontend component/service.

---

### US‑2: Register and log in

**Story**  
As a **new user**, I want to register and then log in so that I can place orders.

**Acceptance criteria**

- The registration form validates required fields (e‑mail, password, password confirmation).
- Password and confirmation must match; otherwise, a validation error is shown.
- After successful registration, the user can log in with those credentials.
- Logged‑in state is visible (e.g. username or “Logout” link).

**Definition of Done / Non‑functional**

- Passwords are not logged or stored in plaintext.
- Unauthenticated users cannot access protected routes (order history, checkout).
- At least one backend test verifies error cases (e.g. existing e‑mail, invalid data).

---

### US‑3: Manage shopping cart

**Story**  
As a **customer**, I want to add, remove and update products in my cart so that I can prepare my order.

**Acceptance criteria**

- From the product list or detail page, users can add items to the cart.
- The cart shows product name, quantity, price and total.
- Quantities can be increased or decreased; totals update instantly.
- The cart persists during normal navigation sessions (e.g. page reload).

**Definition of Done / Non‑functional**

- Cart calculations are correct for quantities from 1 up to the maximum supported.
- At least one **boundary test** covers high quantities (e.g. quantity = 99).

---

### US‑4: Checkout and payment

**Story**  
As a **customer**, I want to complete a checkout so that I can place an order and pay (via Stripe or a mock).

**Acceptance criteria**

- Checkout page displays the cart summary and total price.
- Required delivery/contact fields are validated.
- When paying, a declined payment shows a clear error; a successful payment creates an order.
- After successful checkout, the cart is emptied.

**Definition of Done / Non‑functional**

- Payment or its mock must not be triggered in unit tests; only in integration/e2e/blackbox tests.
- At least one **negative test** covers invalid payment data.

---

### US‑5: View order history

**Story**  
As a **logged‑in customer**, I want to see my past orders so that I can look up previous purchases.

**Acceptance criteria**

- An orders page displays order date, total amount and status.
- Clicking an order shows its line items.
- Only orders belonging to the current user are visible.

**Definition of Done / Non‑functional**

- Backend enforces authorization (no data leakage between users).
- At least one test checks that a user cannot view another user’s orders.

---

### US‑6: Admin manages products

**Story**  
As an **admin**, I want to create and update products so that the catalogue stays up to date.

**Acceptance criteria**

- Admin can create products with name, price, description and image URL.
- Admin can update and delete existing products.
- Non‑admin users cannot call admin endpoints or open admin pages.

**Definition of Done / Non‑functional**

- Admin endpoints are protected; a 403 response is returned for non‑admins.
- At least one test verifies access control for admin operations.

---

## 3. System Context Diagram

The Techmodule E-Commerce Platform sits in a simple web-based context.  
A visitor or admin uses a browser to reach the Angular frontend.  
The frontend communicates with the Spring Boot backend via REST (JSON).  
The backend uses a database and optionally connects to an external payment provider (Stripe or a mock).

The diagram below summarises the components:

```text
+-----------------+          HTTPS          +------------------------+
|  Customer /     | <--------------------> |  Angular Frontend      |
|  Admin Browser  |                        |  (e-commerce-frontend) |
+-----------------+                        +-----------+------------+
                                                        |
                                                        | REST / JSON
                                                        v
                                              +---------+-----------+
                                              | Spring Boot Backend |
                                              | (e-commerce-backend)|
                                              +---------+-----------+
                                                        |
                                                        | JPA / JDBC
                                                        v
                                                +-------+--------+
                                                |  Database      |
                                                | (PostgreSQL or|
                                                |  H2 for tests)|
                                                +-------+--------+
                                                        |
                                                        | HTTPS (sandbox or mock)
                                                        v
                                              +---------+--------+
                                              | Payment Provider |
                                              |   (Stripe / mock)|
                                              +------------------+




### Context description

- **Actors:** customers and admins using a browser.
- **Frontend:** Angular app communicates with the backend via HTTP REST (JSON).
- **Backend:** Spring Boot application manages business logic, user accounts, products, carts and orders.
- **Database:** PostgreSQL (in Docker) for development; H2 or Testcontainers for automated tests.
- **External system:** Stripe or a payment mock is called for checkout.

---

## 4. System Architecture

The system has two main modules and supporting infrastructure.

### 4.1 Logical modules

- **e‑commerce‑backend:**
    - REST controllers (HTTP API)
    - Service layer (business logic)
    - Repository layer (JPA repositories)
    - Domain entities (User, Product, CartItem, Order, etc.)
    - Integration layer for payment (Stripe client or mock)
    - Test code (unit, web‑layer and planned integration tests)

- **e‑commerce‑frontend:**
    - Components (Home, ProductList, ProductDetail, Cart, Checkout, Login/Register, Admin pages)
    - Services (CartService, ProductService, AuthService, OrderService)
    - Routing module
    - Shared UI modules
    - Test code (component/service tests; basic Playwright e2e)

- **Infrastructure / DevOps:**
    - Docker Compose for backend + DB (and optionally frontend)
    - CI pipeline running Maven tests, npm tests and optional e2e

### 4.2 Layered view (backend)

1. **Presentation layer:** Spring MVC controllers (e.g. `ProductController`, `CartController`, `AuthController`).
2. **Application/service layer:** orchestrates business logic (`CartService`, `OrderService`, etc.).
3. **Domain layer:** entities and value objects (`Product`, `User`, `Order`, `OrderItem`).
4. **Infrastructure layer:** JPA repositories, payment client, persistence configuration.

End‑to‑end or blackbox tests treat the system as a black box and only interact via the HTTP API and browser.

---

## 5. Criticality of Functional Units

We classify each functional unit by its importance. High‑critical units require thorough tests, while low‑critical units are less risky and can rely on lighter testing.

| Functional Unit                 | Criticality |
|--------------------------------|-------------|
| User registration & login      | High        |
| Authorization (admin vs user)  | High        |
| Cart handling & price totals   | High        |
| Checkout & payment integration | High        |
| Product catalogue              | Medium      |
| Order history                  | Medium      |
| Admin product management       | Medium      |
| Logging & monitoring           | Low         |
| UI layout / responsiveness     | Low         |

### Reasons for classification

- **High:** These units affect security or money. A failure in registration, login, role checks, cart totals or payment processing can block the shop or cause financial losses; they must be tested thoroughly with negative and boundary cases.
- **Medium:** These units are important features such as catalogue, order history and admin management. Errors are less risky but still need a mix of unit, integration and some blackbox tests.
- **Low:** Logging, monitoring and UI layout are useful but do not block core flows. They can rely on manual or exploratory testing supplemented by unit or component tests.

---

## 6. Test Requirements

### 6.1 Functional requirements

For each user story, tests should cover **normal**, **boundary** and **error** conditions. Examples:

- **Registration & login:** normal valid data; boundary values such as minimum/maximum password length; error cases such as invalid e‑mail or mismatched password.
- **Cart & prices:** normal quantities (1–10 items); boundary at zero or the maximum supported quantity; error when quantity is negative or product ID does not exist.
- **Checkout & payment:** normal checkout with valid details; boundary conditions like very long names or a full cart; error cases where the payment is declined or mandatory fields are missing.

### 6.2 Non‑functional requirements

- **Performance:** product list endpoint should respond in ~500 ms (local dev, up to 100 items).
- **Security:** protected endpoints require authentication; unauthorized roles should be denied.
- **Reliability:** system should recover from basic restarts without data loss (via persistent DB).
- **Usability:** error messages should be clear for users; no raw stack traces.

### 6.3 General rules

- Include normal, boundary and error cases where relevant.
- Tests must be repeatable with the same input producing the same result.
- Automate tests when feasible (unit, integration, e2e).
- Manual blackbox tests complement automation, especially for overall flows and UX.

---

## 7. Release Management

Though this is a school project, we define a simple release process.

### 7.1 Release types and frequency

- **Development builds:** each merged feature branch produces a new snapshot (e.g. `0.3.0‑SNAPSHOT`) on `main`.
- **Milestone / “Big Bang” release:** at least one main release for the grading/demo (e.g. `1.0.0`).
- **Emergency fixes:** released as `1.0.1`, `1.0.2`, etc. for critical bugs.

### 7.2 Release strategy

We use a **Big Bang** style release for a single environment. Advanced strategies like Blue‑Green or Canary can be considered in a real production setting but are out of scope here.

### 7.3 Tests per release

Before tagging a release:

1. Run automated tests:
    - Backend: `mvn test`
    - Frontend: `npm test`
    - Optional: Playwright e2e tests (locally or in CI)
2. Run a subset of manual blackbox tests (see Section 15).

### 7.4 Rollback strategy

If a release fails:

- Roll back to the previous working Git tag (e.g. `git checkout 0.9.0`).
- Rebuild and redeploy the earlier Docker images or jar/Angular build.
- Analyse faulty changes via Git history and fix accordingly.

---

## 8. Repository Management

The project uses Git (GitHub or a school Git service).

### 8.1 Branching model

- **`main`:** holds the latest stable version; protected branch; merges go through Pull Requests.
- **Feature branches:** named `feature/<short-description>` (e.g. `feature/cart-discount`); used for implementing user stories or bug fixes.
- **Optional `develop`:** can be used as an integration branch for larger changes.

### 8.2 Merge and code review

- Pull Requests must be reviewed by at least one teammate or coach.
- Reviews check readability, style, adherence to architecture and presence of tests.
- Only after CI passes (tests green) and review approval, the PR is merged into `main`.

### 8.3 Versioning

We follow **Semantic Versioning** (MAJOR.MINOR.PATCH).  
Releases are tagged `vX.Y.Z` (e.g. `v1.0.0`).

### 8.4 Tests per branch

- On a **feature branch**, developers run backend and frontend unit tests locally before pushing.
- On **main**, CI runs backend and frontend tests automatically; optional e2e tests can also run.

---

## 9. Code Quality

### 9.1 Coding standards

- Use consistent naming conventions appropriate for Java and TypeScript.
- Keep methods and classes short and cohesive.
- Avoid duplicated code; extract common logic into services or helpers.
- Maintain a clear separation between controller, service and repository layers.

### 9.2 Tools and practices

- **Backend:** JUnit 5 + Mockito for unit and web‑layer tests; optional static analysis tools (Checkstyle, SpotBugs) via Maven.
- **Frontend:** Jasmine/Karma for unit tests; ESLint and Prettier for linting and formatting.
- **Code reviews:** verify tests, readability and adherence to architecture; emphasise learning and constructive feedback.
- **Psychological safety:** tests and reviews should support safe refactoring; green tests give confidence to improve code.

---

## 10. Test Environment and Procedures

### 10.1 Test environment (Windows)

Required tools on the developer machine:

- Windows 10 or 11
- Java 21 (JDK)
- Maven 3.9+
- Node.js and npm (matching Angular CLI requirements)
- Docker Desktop (for optional database and full stack)
- Browser (Chrome, Firefox or Edge)

**Backend test DB:** unit and web‑layer tests use an in‑memory DB (H2). Future integration tests may use Testcontainers PostgreSQL.

### 10.2 Running backend tests

From the repository root or module directory:

```bash
cd e-commerce-backend
mvn -q test
