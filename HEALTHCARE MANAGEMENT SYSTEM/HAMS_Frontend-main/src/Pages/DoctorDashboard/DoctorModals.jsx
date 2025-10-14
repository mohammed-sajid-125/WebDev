import { Modal, Button, Form } from "react-bootstrap";

export const OverviewModal = ({ show, onClose, description, setDescription, onSave }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Write Overview</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Doctor Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your description here..."
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Close</Button>
      <Button variant="primary" onClick={onSave}>Save</Button>
    </Modal.Footer>
  </Modal>
);

export const RejectModal = ({ show, onClose, rejectionReason, setRejectionReason, onConfirm }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Enter Rejection Reason</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm}>Reject Appointment</Button>
    </Modal.Footer>
  </Modal>
);

export const PrescriptionModal = ({ show, onClose, name, prescription, setPrescription, onSave }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Prescription</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Prescription for {name}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Write prescription here..."
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Close</Button>
      <Button variant="primary" onClick={onSave}>Save Prescription</Button>
    </Modal.Footer>
  </Modal>
);

export const ViewPrescriptionModal = ({ show, onClose, name, prescription }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Prescription for {name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{prescription}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Close</Button>
    </Modal.Footer>
  </Modal>
);
