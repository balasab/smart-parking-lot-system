# Smart Parking Lot System - Low Level Design (LLD)

A robust, TypeScript-based backend system for managing a smart parking lot with multiple floors, automated spot allocation, and flexible fee calculation.

## 🚀 Key Features
- **Multi-floor Support**: Manage parking spots across multiple levels.
- **Automated Spot Allocation**: Automatically finds the smallest available spot that fits the vehicle (Motorcycle -> Car -> Bus).
- **Concurrency Handling**: Custom Mutex implementation to handle simultaneous entries/exits at different gates safely.
- **Flexible Fee Calculation**: Easily plug in different fee strategies (Hourly, Flat, etc.).
- **Gate Management**: Explicit Entry and Exit gate tracking.

---

## 🏗️ Design Patterns Used

### 1. Singleton Pattern
Used for the `ParkingLotManager` class.
- **Why?**: A parking lot should have exactly one central management system to coordinate spots, floors, and tickets. Multiple instances would lead to inconsistent data (e.g., the same spot being assigned twice).

### 2. Strategy Pattern
Used for `ParkingFeeStrategy`.
- **Why?**: Pricing models often change (e.g., hourly rates, flat rates for events, weekend surcharges). By using an interface, we can swap the calculation logic at runtime without modifying the core `ParkingLotManager` code.

### 3. Mutex (Concurrency Pattern)
Implemented in `src/utils/Mutex.ts`.
- **Why?**: In a real-world scenario, multiple vehicles might enter different gates simultaneously. The Mutex ensures that the "Find Spot + Assign Spot" operation is atomic, preventing race conditions where two vehicles are assigned the same spot.

### 4. Inheritance & Polymorphism
Used for `Vehicle` (Motorcycle, Car, Bus) and `Gate` (EntryGate, ExitGate).
- **Why?**: Allows the system to treat different vehicle types uniformly (e.g., calling `canFit()` or `getType()`) while allowing specific behaviors or attributes for each type.

### 5. Observer Pattern
Used for `ParkingObserver` and `DisplayBoard`.
- **Why?**: To provide **Real-Time Availability Updates**. When a spot is assigned or released, the `ParkingLotManager` automatically notifies all registered observers. This keeps display boards or mobile apps in sync without constant polling.

---

## 🛠️ Project Structure
```text
src/
├── models/         # Data entities (Vehicle, Spot, Floor, Ticket, Gate)
├── services/       # Business logic (Allocation, Fee Strategy, Manager)
├── utils/          # Utility classes (Mutex)
└── main.ts         # Demonstration script
```

---

## 🚦 How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Compile and Run**:
   ```bash
   npx tsc && node dist/main.js
   ```

---

## 🧪 Verification
The system includes a demonstration script in `src/main.ts` that simulates:
1. Initializing a 2-floor parking lot.
2. Multiple check-ins of different vehicle types.
3. Handling "Lot Full" scenarios.
4. Concurrent check-in collision handling.
5. Check-outs with automated fee calculation.
