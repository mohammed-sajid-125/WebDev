import React from "react";
import { Accordion, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const FAQs = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Frequently Asked Questions (FAQs)</h2>
      <Accordion>
        {/* General */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is HAMS?</Accordion.Header>
          <Accordion.Body>
            HAMS (Healthcare Appointment Management System) is a digital healthcare platform where patients, doctors, and hospitals can register to streamline medical services. We help patients find the best available doctors nearby and enable seamless appointment booking.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Is HAMS free to use?</Accordion.Header>
          <Accordion.Body>
            Yes! Patients can search for doctors and book appointments for free. Doctors and hospitals may opt for premium listings or added features at minimal cost.
          </Accordion.Body>
        </Accordion.Item>

        {/* For Patients */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I book an appointment?</Accordion.Header>
          <Accordion.Body>
            Once registered, simply enter your location or allow GPS access. HAMS will show a list of nearby doctors. Select a doctor, view their slots, and book an appointment in a few clicks.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Can I reschedule or cancel an appointment?</Accordion.Header>
          <Accordion.Body>
            Yes, after logging in, go to “My Appointments” and use the reschedule or cancel option at least 2 hours before the appointment time.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>How is my data protected?</Accordion.Header>
          <Accordion.Body>
            HAMS uses secure encryption and adheres to HIPAA & Indian data privacy standards to protect your medical data and personal information.
          </Accordion.Body>
        </Accordion.Item>

        {/* For Doctors */}
        <Accordion.Item eventKey="5">
          <Accordion.Header>How can I register as a doctor on HAMS?</Accordion.Header>
          <Accordion.Body>
            Click on “Register as Doctor” on the homepage. Fill out your personal details, specialization, available timings, and upload your credentials. Once verified, your profile will go live.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>Can I manage my availability and schedule?</Accordion.Header>
          <Accordion.Body>
            Absolutely. Doctors can set their working hours, appointment durations, break times, and days off directly from their dashboard.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Will HAMS promote my profile?</Accordion.Header>
          <Accordion.Body>
            Yes, our smart matching algorithm ensures your profile is shown to nearby patients actively looking for your specialization. Premium features offer higher visibility.
          </Accordion.Body>
        </Accordion.Item>

        {/* For Hospitals */}
        <Accordion.Item eventKey="8">
          <Accordion.Header>How do hospitals join HAMS?</Accordion.Header>
          <Accordion.Body>
            Hospitals can sign up using the “Register Hospital” link. After verification, they can add and manage their doctors, departments, and available services.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="9">
          <Accordion.Header>Can hospitals track doctor performance and appointments?</Accordion.Header>
          <Accordion.Body>
            Yes, the hospital dashboard provides insights on appointments, patient feedback, doctor schedules, and service performance.
          </Accordion.Body>
        </Accordion.Item>

        {/* Technical & Support */}
        <Accordion.Item eventKey="10">
          <Accordion.Header>What if I face issues during booking or registration?</Accordion.Header>
          <Accordion.Body>
            Reach out via our contact page or email us at <strong>Jangaa@hams.in</strong>. You can also call our helpline: <strong>+91 98765 43210</strong>.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="11">
          <Accordion.Header>Is HAMS available as a mobile app?</Accordion.Header>
          <Accordion.Body>
            No! HAMS is not available as a mobile app, but you can access our services through the mobile browser for an optimized experience.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="12">
          <Accordion.Header>Does HAMS support teleconsultation?</Accordion.Header>
          <Accordion.Body>
            No, HAMS does not support teleconsultation at this time. We focus on in-person appointments to ensure quality care and personal interaction between patients and doctors.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default FAQs;
