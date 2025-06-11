import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContactService } from "../../../services/contactservices";
import Spinner from "../../spinner/spinner";

const ContactList = () => {
    const [query, setQuery] = useState({
        text: '',
        email:''
    });
    
    const [state, setState] = useState({
        loading: false,
        contacts: [],
        filteredContacts: [],
        errorMessage: ''
    });

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setState(prevState => ({ ...prevState, loading: true }));
                const response = await ContactService.getAllContacts();
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    contacts: response.data,
                    filteredContacts: response.data
                }));
            } catch (error) {
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                    errorMessage: error.message
                }));
            }
        };

        fetchContacts();
    }, []);

    const clickDelete = async (contactId) => {
        try {
            setState(prevState => ({ ...prevState, loading: true }));
            await ContactService.deleteContact(contactId);
            const response = await ContactService.getAllContacts();
            setState(prevState => ({
                ...prevState,
                loading: false,
                contacts: response.data,
                filteredContacts: response.data
            }));
        } catch (error) {
            setState(prevState => ({
                ...prevState,
                loading: false,
                errorMessage: error.message
            }));
        }
    };

    const searchContact = (event) => {
        const searchValue = event.target.value;
        setQuery({ ...query, text: searchValue});
        
        
        const filteredContacts = state.contacts.filter(contact => {
            return contact.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        
        setState(prevState => ({
            ...prevState,
            filteredContacts: filteredContacts
        }));
    };

    const { loading, contacts, filteredContacts, errorMessage } = state;

    return (
        <React.Fragment>
            <section className="contact-search p-3">
                <div className="container">
                    <div className="grid">
                        <div className="row">
                            <div className="col">
                                <h3 className="fw-bold">
                                    Contact Manager App
                                    <Link to={'/contacts/add'} className="btn btn-primary ms-2">
                                        <i className="fa fa-plus-circle me-2" />
                                        New
                                    </Link>
                                </h3>
                                <p className="fst-italic">Here You can see all the Contacts!!</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <form className="row" onSubmit={(e) => e.preventDefault()}>
                                    <div className="col">
                                        <div className="mb-2">
                                            <input 
                                                name="text"
                                                value={query.text}
                                                onChange={searchContact}
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Search Names" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="mb-2">
                                            <input 
                                                type="submit" 
                                                className="btn btn-outline-dark" 
                                                value="Search" 
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {errorMessage && (
                <section className="p-3">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="alert alert-danger">{errorMessage}</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {loading ? (
                <Spinner />
            ) : (
                <React.Fragment>
                    <section className="contact-list">
                        <div className="container">
                            <div className="row">
                                {filteredContacts.length > 0 ? (
                                    filteredContacts.map(contact => (
                                        <div className="col-md-6" key={contact.id}>
                                            <div className="card my-2">
                                                <div className="card-body">
                                                    <div className="row align-items-center d-flex justify-content-around">
                                                        <div className="col-md-4">
                                                            <img 
                                                                src={contact.photo} 
                                                                alt={contact.name} 
                                                                className="img-fluid"
                                                                style={{ maxWidth: '100%', height: 'auto' }}
                                                            />
                                                        </div>
                                                        <div className="col-md-7">
                                                            <ul className="list-group">
                                                                <li className="list-group-item list-group-item-action">
                                                                    Name: <span className="fw-bold">{contact.name}</span>
                                                                </li>
                                                                <li className="list-group-item list-group-item-action">
                                                                    Mobile: <span className="fw-bold">{contact.mobile}</span>
                                                                </li>
                                                                <li className="list-group-item list-group-item-action">
                                                                    Email: <span className="fw-bold">{contact.email}</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="col-md-1 d-flex flex-column align-items-center">
                                                            <Link 
                                                                to={`/contacts/view/${contact.id}`} 
                                                                className="btn btn-warning my-1"
                                                                title="View Contact"
                                                            >
                                                                <i className="fa fa-eye" />
                                                            </Link>
                                                            <Link 
                                                                to={`/contacts/edit/${contact.id}`} 
                                                                className="btn btn-primary my-1"
                                                                title="Edit Contact"
                                                            >
                                                                <i className="fa fa-pen" />
                                                            </Link>
                                                            <button 
                                                                className="btn btn-danger my-1" 
                                                                onClick={() => clickDelete(contact.id)}
                                                                title="Delete Contact"
                                                                disabled={loading}
                                                            >
                                                                <i className="fa fa-trash" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <div className="text-center">
                                            <h4>No Contacts Found.</h4>
                                            <p>Add a new contact.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default ContactList;