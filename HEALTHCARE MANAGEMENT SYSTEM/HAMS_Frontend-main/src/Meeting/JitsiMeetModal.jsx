import { useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";

const JitsiMeetModal = ({ show, onHide, roomName }) => {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    if (show && window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
      
      if (apiRef.current) {
        apiRef.current.dispose();
      }

      const domain = "meet.jit.si";
      const options = {
        roomName: roomName || "HAMS_Meeting_1234",
        parentNode: jitsiContainerRef.current,
        width: "100%",
        height: "100%",
        configOverwrite: {
          prejoinPageEnabled: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
        },
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [show, roomName]);

  return (
    <Modal show={show} onHide={onHide} fullscreen centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Consultation Video Call</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "80vh", padding: 0 }}>
        <div ref={jitsiContainerRef} style={{ height: "100%", width: "100%" }} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          End Call
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JitsiMeetModal;
