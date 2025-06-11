import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ContactService } from "../../../services/contactservices";
import Spinner from "../../spinner/spinner";

let Viewcontact = () => {
  let { contactId } = useParams();

  const [state, setState] = useState({
    loading: false,
    contact: {},
    errorMessage: "",
    Year: {},
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        let response = await ContactService.getContact(contactId);
        let YearResponse = await ContactService.getYearById(
          response.data.YearId
        );
        setState((prevState) => ({
          ...prevState,
          loading: false,
          contact: response.data,
          Year: YearResponse.data,
        }));
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          errorMessage: error.message,
        }));
      }
    };

    if (contactId) {
      fetchContact();
    }
  }, [contactId]);

  let { loading, contact, errorMessage, Year } = state;

  return (
    <React.Fragment>
      <section className="view-contact-intro p-3">
        <div className="container">
          <div className="row">
            <div className="col">
              <p className="h3 text-warning fw-bold">View Contact</p>
              <p className="fst-italic">
                
              </p>
            </div>
          </div>
        </div>
      </section>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <React.Fragment>
          {Object.keys(contact).length > 0 && Object.keys(Year).length > 0 && (
            <section className="view-contact mt-3">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <img src={contact.photo} alt="" className="img-fluid" />
                  </div>
                  <div className="col-md-6">
                    <ul className="list-group">
                      <li className="list-group-item list-group-item-section">
                        Name:
                        <span className="fw-bold">{contact.name}</span>
                      </li>
                      <li className="list-group-item list-group-item-section">
                        Mobile:
                        <span className="fw-bold">{contact.mobile}</span>
                      </li>
                      <li className="list-group-item list-group-item-section">
                        Email:
                        <span className="fw-bold">{contact.email}</span>
                      </li>
                      <li className="list-group-item list-group-item-section">
                        College:
                        <span className="fw-bold">{contact.College}</span>
                      </li>
                      <li className="list-group-item list-group-item-section">
                        Department:
                        <span className="fw-bold">{contact.Department}</span>
                      </li>
                      <li className="list-group-item list-group-item-section">
                        Year:
                        <span className="fw-bold">{Year.name}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Link to={"/contacts/list"} className="btn btn-warning my-2">
                      Back
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Viewcontact;
