import React, { useEffect, useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import { ContactService } from "../../../services/contactservices";
import Spinner from "../../spinner/spinner";

let Addcontact = () => {

  let navigate=useNavigate();
  let [state, setState] = useState({
    loading: false,
    contact: {
      name: "",
      photo: "",
      mobile: "",
      email: "",
      College: "",
      Department: "",
      YearId: "",
    },
    Year: [],
    errorMessage: "",
  });

  let updateInput = (event) => {
    setState({
      ...state,
      contact: {
        ...state.contact,
        [event.target.name]: event.target.value,
      },
    });
  };

  useEffect(() => {
    const fetchYear = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        let response = await ContactService.getAllYears();
        setState((prevState) => ({
          ...prevState,
          loading: false,
          Year: response.data,
        }));
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          errorMessage: error.message,
        }));
      }
    };

    fetchYear();
  }, []);
  let submitForm =async(event)=>{
    event.preventDefault();
    try{
        let response= await ContactService.createContact(state.contact);
        if(response){
            navigate('/contacts/list',{replace:true});
        }

    }
    catch (error){
        setState({...state,errorMessage:error.message});
        navigate('/contacts/add',{replace:false});
    }
  }

  let { loading, contact, Year, errorMessage } = state;

  return (
    <React.Fragment>
      
      <section className="add-contact p-3">
        <div className="container">
          <div className="row">
            <div className="col">
              <p className="h4 text-success fw-bold">Create Contact</p>
              <p className="fst-italic">
                Fill all the details!!
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <form onSubmit={submitForm}>
                <div className="mb-2">
                  <input
                    required={true}
                    name="name"
                    value={contact.name}
                    onChange={updateInput}
                    type="text"
                    className="form-control"
                    placeholder="Name"
                  />
                </div>
                <div className="mb-2">
                  <input
                    required={true}
                    name="photo"
                    value={contact.photo}
                    onChange={updateInput}
                    type="text"
                    className="form-control"
                    placeholder="PhotoURL"
                  />
                </div>
                <div className="mb-2">
                  <input
                    required={true}
                    name="email"
                    value={contact.email}
                    onChange={updateInput}
                    type="Email"
                    className="form-control"
                    placeholder="Email"
                  />
                </div>
                <div className="mb-2">
                  <input
                    required={true}
                    name="mobile"
                    value={contact.mobile}
                    onChange={updateInput}
                    type="Number"
                    className="form-control"
                    placeholder="Number"
                  />
                </div>
                <div className="mb-2">
                  <input
                    required={true}
                    name="College"
                    value={contact.College}
                    onChange={updateInput}
                    type="text"
                    className="form-control"
                    placeholder="College"
                  />
                </div>
                <div className="mb-2">
                  <input
                    required={true}
                    name="Department"
                    value={contact.Department}
                    onChange={updateInput}
                    type="text"
                    className="form-control"
                    placeholder="Department"
                  />
                </div>
                <div className="mb-2">
                  <select
                    required={true}
                    name="YearId"
                    value={contact.YearId}
                    onChange={updateInput}
                    className="form-control"
                  >
                    <option value="">Year of Study</option>
                    {Year.length > 0 &&
                      Year.map((year) => (
                        <option key={year.id} value={year.id}>
                          {year.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-2">
                  <input type="Submit" className="btn btn-success" value="Create" />
                  <Link to={"/contacts/list"} className="btn btn-dark ms-2">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Addcontact;
