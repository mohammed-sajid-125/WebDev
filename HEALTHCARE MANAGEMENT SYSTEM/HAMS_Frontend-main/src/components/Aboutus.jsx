import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <h2 className="mb-4">About Us</h2>
          <p>
            Welcome to <strong>HAMS</strong>, where compassion meets innovation in healthcare.
            We are a trusted multi-specialty healthcare provider committed to delivering exceptional
            medical care with a patient-first approach. Our team of experienced doctors, nurses, and support staff
            ensures the highest standard of treatment, comfort, and care.
          </p>
          <p>
            With advanced diagnostic tools and state-of-the-art infrastructure, we offer a full spectrum of services—
            from preventive health checkups to complex surgical procedures—all under one roof.
          </p>

          <h4 className="mt-4">Our Mission</h4>
          <p>To provide high-quality, affordable, and compassionate healthcare services while upholding the highest standards of ethics and professionalism.</p>

          <h4>Our Vision</h4>
          <p>To be a leading healthcare provider known for clinical excellence, patient satisfaction, and community trust.</p>

          <h4>Core Values</h4>
          <ul>
            <li><strong>Compassion</strong> – We treat patients with kindness and empathy.</li>
            <li><strong>Integrity</strong> – We maintain the highest standards of ethics and transparency.</li>
            <li><strong>Innovation</strong> – We embrace modern medicine and continuous learning.</li>
            <li><strong>Excellence</strong> – We are committed to delivering the best possible outcomes.</li>
            <li><strong>Respect</strong> – We value every individual, their needs, and their dignity.</li>
          </ul>
        </Col>

        <Col md={4}>
          <Card className="bg-light p-4">
            <h4 className="mb-3">📞 Contact Us</h4>
            <p><strong>HAMS Hospitals</strong></p>
            <p>123 Avadi, <br /> Chennai, Tamil Nadu - 627005</p>
            <p>Email: adityajanga@hams.com</p>
            <p>Phone: +91 12345 67890</p>
            <p>Emergency: 108</p>
            <p>Website: <a href="https://www.hams.com" target="_blank" rel="noreferrer">www.hams.com</a></p>
            <hr />
            <p><strong>Working Hours:</strong><br />Mon - Sat: 8:00 AM to 8:00 PM<br />Sunday: Emergency Only</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
