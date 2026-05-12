# SkyRoute - Flight Search & Booking System

SkyRoute is a modern web application built with **Angular 18+** and **.Net 10** that allows users to search for flights between Argentina and Mexico, compare options, and complete bookings in real-time.

---

## 🚀 Setup & Run Instructions

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher
* **.NET 10.0 SDK**

### Installation and Execution
1. Clone the repository:
   ```bash
   git clone https://github.com/conradeleon11/Sky-route-travel-platform.git
2. Install dependencies and start Server:

   ```bash
   cd apps/api
   dotnet restore
   dotnet run
3. Install dependencies and start Client:

   ```bash
   cd apps/client
   npm install
   npm start

4. Navigate to `http://localhost:4200`.

---

### Api Unit Testing
1. Run tests:
   ```bash
   cd apps/api.tests
   dotnet test

---

## 🏗 Architecture Decisions

The project follows **Clean Architecture** and **Component-Based Design** principles to ensure high maintainability and scalability:



### 1. Strategy Pattern (Flight Providers)
Strategy Pattern was choosen to manage multiple flight providers. This decouples the core search engine from the specific API implementations of different airlines. It allows us to add or swap providers dynamically without modifying the main service logic, ensuring the system remains compliant with the Open/Closed Principle.


### 2. Component Decomposition (Smart vs. Dumb)
The initial monolithic logic was refactored into a hierarchical structure:
*   **Smart Component (`AppComponent`):** Acts as the state orchestrator, managing service communication and data flow between children.
*   **Dumb/Presentational Components:**
    *   `FlightSearchComponent`: Exclusively handles the search form and input validations.
    *   `FlightResultsComponent`: Responsible for displaying and sorting the received flight data.
    *   `BookingFormComponent`: Centralizes booking logic and dynamic document validation.

### 3. State Management with Angular Signals
The application leverages **Signals** for reactive state management. This approach provides more efficient change detection and a clearer unidirectional data flow, significantly reducing the cognitive load when tracing UI updates.

### 4. Contextual Dynamic Validations
The system automatically detects if a flight is **international** by comparing airport codes (e.g., EZE vs. MEX) to adjust validation rules in real-time:
*   **Domestic:** Requires a National ID (7-10 numeric digits).
*   **International:** Requires a Passport (6-12 alphanumeric characters including at least one letter).

---

## ⚖ Trade-offs & Known Limitations

### Trade-offs
*   **Strategy vs. Simple Service:** While the Strategy pattern adds more files/interfaces initially, it was chosen over a single service to prevent "God Classes" as more airline APIs are integrated.
*   **Input-Driven Reset vs. ViewChild:** I opted for a `resetTrigger` based on Inputs rather than `@ViewChild` to clear the search form. While this adds a state variable, it avoids "undefined" reference errors when components are dynamically hidden or shown using `*ngIf`.

### Known Limitations
*   **Session Persistence:** Current state is maintained in memory. Refreshing the page (`F5`) will clear active search results.
*   **Mock API:** The `FlightService` uses simulated data with artificial `delay` to emulate network latency. No live backend configuration is required for local testing.
*   **Multi-passenger Support:** Although the search form allows selecting multiple passengers, the current booking flow only captures data for the "Lead Passenger."

---
*Developed with ❤️ by Conrado de Leon - Buenos Aires, 2026*
