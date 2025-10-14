# HAMS (Healthcare Appointment Management System) Frontend

HAMS is a digital healthcare platform designed to streamline medical services for patients, doctors, and hospitals. This web application enables users to find the best available doctors nearby, book appointments seamlessly, and manage healthcare interactions efficiently.

---

## Table of Contents
- [About HAMS](#about-hams)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Core Functionality](#core-functionality)
- [Healthcare Programs](#healthcare-programs)
- [FAQ](#faq)
- [Live Demo](#live-demo)
- [User Roles & Permissions](#user-roles--permissions)
- [API Integration](#api-integration)
- [Authentication & Security](#authentication--security)
- [Customization & Theming](#customization--theming)
- [Testing](#testing)
- [Known Issues & Roadmap](#known-issues--roadmap)
- [Contact & Support](#contact--support)
- [Credits](#credits)
- [License](#license)

---

## About HAMS

HAMS (Healthcare Appointment Management System) is a multi-role healthcare platform. Patients, doctors, and hospitals can register, manage their profiles, and interact through a unified interface. The platform focuses on in-person appointments, ensuring quality care and personal interaction.

**Mission:** To provide high-quality, affordable, and compassionate healthcare services while upholding the highest standards of ethics and professionalism.

**Vision:** To be a leading healthcare provider known for clinical excellence, patient satisfaction, and community trust.

---

## Features

- **Patient Portal:**
  - Register, login, and manage your profile.
  - Search for doctors by location and specialization.
  - Book, reschedule, or cancel appointments.
  - View appointment history and feedback.
  - Secure data handling and privacy.

- **Doctor Portal:**
  - Register and verify credentials.
  - Set and manage availability, appointment slots, and breaks.
  - View and manage today's and previous appointments.
  - Write and manage patient prescriptions.
  - Update personal overview and profile.

- **Hospital Portal:**
  - Register and manage hospital profile.
  - Add and manage doctors, departments, and services.
  - Track doctor performance, appointments, and patient feedback.

- **General:**
  - Responsive, modern UI with React, Bootstrap, and Tailwind CSS.
  - Location-based doctor search (with GPS support).
  - Floating quick-access bar for navigation.
  - Feedback and testimonials section.
  - Comprehensive healthcare programs and packages.
  - Role-based route protection for secure access.
  - Video meeting integration (Jitsi Meet) for future telemedicine support.

---

## Screenshots

*(Add screenshots of the Home page, Patient Dashboard, Doctor Dashboard, and Booking flow here)*

---

## Tech Stack

- **Frontend:** React, React Router
- **UI:** Bootstrap, Tailwind CSS, Material UI Icons, React Icons
- **State Management:** Zustand
- **APIs:** Axios for HTTP requests
- **Build Tool:** Vite

---

## Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Walker31/HAMS_Frontend.git
   cd HAMS_Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

- **Development mode:**
  ```bash
  npm run dev
  ```
  The app will be available at `http://localhost:5173` (or as specified by Vite).

- **Production build:**
  ```bash
  npm run build
  npm run preview
  ```

### Environment Variables

- The app expects a backend API URL via the `VITE_BASE_URL` environment variable.
- Create a `.env` file in the root directory:
  ```
  VITE_BASE_URL=http://localhost:3000
  ```
  *(Adjust the URL as per your backend setup.)*

---

## Project Structure

```
src/
  apiControllers/    # API request logic (e.g., userAPI.js)
  assets/            # Images and static assets
  components/        # Reusable UI components (Navbar, Footer, Sidebar, etc.)
  constants/         # Static data (doctors, programs, feedback, etc.)
  contexts/          # React Contexts (e.g., AuthContext)
  handlers/          # Business logic for forms and actions
  Meeting/           # Video meeting integration (JitsiMeetModal)
  Pages/             # Main pages and dashboards
    Dashboard/         # Patient dashboard components
    DoctorDashboard/   # Doctor dashboard and components
    Login/             # Login and registration forms
    PatientDashboard/  # Patient dashboard and components
    Home.jsx           # Home page
  RoleBasedRoute.jsx # Route protection for user roles
  store/             # Zustand stores for state management
  utils/             # Utility functions (location, etc.)
  index.css          # Global styles
  App.jsx            # Main app component and routing
  main.jsx           # Entry point
```

---

## Core Functionality

### Patient Flow

- Register or login as a patient.
- Set your location (manually or via GPS).
- Browse available doctors by specialization and proximity.
- Book appointments by selecting date and time slot.
- View, reschedule, or cancel appointments from your dashboard.
- Access appointment history and feedback.

### Doctor Flow

- Register as a doctor and submit credentials for verification.
- Set your working hours, appointment intervals, and breaks.
- View today's and previous appointments.
- Accept, reject, or reschedule appointments.
- Write and manage prescriptions for patients.
- Update your profile and overview.

### Hospital Flow

- Register your hospital and complete verification.
- Add and manage doctors and departments.
- Monitor appointments, doctor schedules, and patient feedback.

---

## Healthcare Programs

HAMS offers a variety of healthcare programs, including:

- Complete Nutrition & Dietetics
- Comprehensive Cardiac Check-Up
- Diabetes Management Program
- Oncology Care Package
- Orthopedic Rehabilitation
- Maternity Care Package
- Pulmonary Rehabilitation Program
- Renal Dialysis Sessions
- Mental Health & Wellness
- Pediatric Wellness & Immunization

*(See the "Programs" section in the app for details and pricing.)*

---

## FAQ

- **Is HAMS free to use?**  
  Yes, patients can search and book appointments for free. Doctors and hospitals may opt for premium features.

- **How is my data protected?**  
  HAMS uses secure encryption and adheres to HIPAA & Indian data privacy standards.

- **Can I reschedule or cancel appointments?**  
  Yes, from your dashboard, at least 2 hours before the appointment.

- **Does HAMS support teleconsultation?**  
  Not yet, but video meeting integration is present for future support.

- **Is there a mobile app?**  
  Not yet, but the web app is mobile-optimized.

*(See the in-app FAQ for more.)*

---

## Live Demo

Try HAMS live: [https://main.d2sjy3evn9ox1m.amplifyapp.com/](https://main.d2sjy3evn9ox1m.amplifyapp.com/)

---

## User Roles & Permissions

| Role     | Capabilities                                                                 |
|----------|------------------------------------------------------------------------------|
| Patient  | Register, search doctors, book/cancel/reschedule appointments, view history  |
| Doctor   | Register, manage availability, view/manage appointments, write prescriptions |
| Hospital | Register, manage doctors/departments, track appointments & feedback          |

---

## API Integration

- All data is fetched and updated via RESTful API endpoints.
- Axios is used for HTTP requests.
- Authentication tokens (JWT) are stored in localStorage and sent with each request.

---

## Authentication & Security

- User sessions are managed using JWT tokens.
- Sensitive actions require authentication.
- Data privacy is enforced according to HIPAA & Indian standards.
- Role-based route protection is implemented for secure access.

---

## Customization & Theming

- The UI uses both Bootstrap and Tailwind CSS for rapid prototyping and customization.
- To change the theme, edit `index.css` or Tailwind config.

---

## Testing

- Automated testing is planned for future releases. (No automated tests are present as of now.)

---

## Known Issues & Roadmap

- Teleconsultation is not yet supported (video meeting integration is present for future use).
- Mobile app is not available, but the web app is mobile-friendly.
- Planned: Notification system, advanced analytics for hospitals, telemedicine.

---

## Contact & Support

For support, email: **Jangaa@hams.in**  
Helpline: **+91 98765 43210**

---

## Credits

- Built by the HAMS team.
- Special thanks to all contributors and open-source libraries.

---

## License

This project is licensed under the MIT License.
