import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ContactService } from "../../../services/contactservices";
import Spinner from "../../spinner/spinner";

const EditContact = () => {
    let navigate = useNavigate();
    const { contactId } = useParams();
    const [state, setState] = useState({
        loading: false,
        contact: {
            name: '',
            photo: '',
            mobile: '',
            email: '',
            College: '',
            Department: '',
            YearId: ''        
        },
        Year: [],
        errorMessage: ''
    });

    useEffect(() => {
        const fetchContact = async () => {
            try {
                setState(prevState => ({ ...prevState, loading: true }));
                const response = await ContactService.getContact(contactId);
                const YearResponse = await ContactService.getAllYears();
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    contact: response.data,
                    Year: YearResponse.data  // This was missing
                }));
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    contact: response.data
                }));
            } catch (error) {
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    errorMessage: error.message
                }));
            }
        };

        if (contactId) {
            fetchContact();
        }
    }, [contactId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            contact: {
                ...prevState.contact,
                [name]: value
            }
        }));
    };

    const SubmitForm = async (event) => {
        event.preventDefault();
        try {
            let response = await ContactService.updateContact(state.contact, contactId);
            if (response) {
                navigate('/contacts/list', { replace: true });
            }
        } catch (error) {
            setState({ ...state, errorMessage: error.message });
            navigate(`/contacts/edit/${contactId}`, { replace: false });
        }
    }

    const { loading, contact, Year, errorMessage } = state;

    return (
        <React.Fragment>
            {
                loading ? <Spinner /> : <React.Fragment> 
                    <section className="add-contact p-3">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <p className="h4 text-primary fw-bold">Edit Contact</p>
                                    <p className="fst-italic">
                                       Edit the details whichever you want.All fields are required!!
                                    </p>
                                </div>
                            </div>
                            
                            {errorMessage && (
                                <div className="row">
                                    <div className="col">
                                        <div className="alert alert-danger">{errorMessage}</div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="row align-items-center">
                                <div className="col-md-4">
                                    <form onSubmit={SubmitForm}>
                                        <div className="mb-2">
                                            <input 
                                                required={true}
                                                type="text" 
                                                name="name"
                                                className="form-control" 
                                                placeholder="Name"
                                                value={contact.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input 
                                                required={true}
                                                type="text" 
                                                name="photo"
                                                className="form-control" 
                                                placeholder="Photo URL"
                                                value={contact.photo}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input 
                                                required={true}
                                                type="email" 
                                                name="email"
                                                className="form-control" 
                                                placeholder="Email"
                                                value={contact.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input 
                                                required={true}
                                                type="tel" 
                                                name="mobile"
                                                className="form-control" 
                                                placeholder="Mobile Number"
                                                value={contact.mobile}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input 
                                                required={true}
                                                type="text" 
                                                name="College"
                                                className="form-control" 
                                                placeholder="College"
                                                value={contact.College}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <input 
                                                required={true}
                                                type="text" 
                                                name="Department"
                                                className="form-control" 
                                                placeholder="Department"
                                                value={contact.Department}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <select 
                                                required={true}
                                                className="form-control"
                                                name="YearId"
                                                value={contact.YearId}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Year of Study</option>
                                                {
                                                    Year.length > 0 &&
                                                    Year.map((year) => (
                                                        <option key={year.id} value={year.id}>
                                                            {year.name}
                                                        </option> 
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <input 
                                                type="submit" 
                                                className="btn btn-primary" 
                                                value={loading ? "Updating..." : "Update"}
                                                disabled={loading}
                                            />
                                            <Link to='/contacts/list' className="btn btn-dark ms-2">
                                                Cancel
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-6">
                                    <img 
                                        src={contact.photo || "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"} 
                                        alt="Contact" 
                                        className="contact-img"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </React.Fragment>
            }
        </React.Fragment>
    );
};

export default EditContact;
