import axios from 'axios';

export class ContactService {
    static serverURL = `http://localhost:9000`;


    static getAllYears() {
        let dataURL = `${this.serverURL}/Year`;
        return axios.get(dataURL);
    }


    static getYearById(YearId) {
        let dataURL = `${this.serverURL}/Year/${YearId}`;
        return axios.get(dataURL);
    }

    
    static getAllContacts() {
        let dataURL = `${this.serverURL}/contacts`;
        return axios.get(dataURL);
    }

  
    static getContact(contactId) {
        let dataURL = `${this.serverURL}/contacts/${contactId}`;
        return axios.get(dataURL);
    }

  
    static createContact(contact) {
        let dataURL = `${this.serverURL}/contacts`;
        return axios.post(dataURL, contact);
    }

    
    static updateContact(contact, contactId) {
        let dataURL = `${this.serverURL}/contacts/${contactId}`;
        return axios.put(dataURL, contact);
    }

 
    static deleteContact(contactId) {
        let dataURL = `${this.serverURL}/contacts/${contactId}`;
        return axios.delete(dataURL);
    }
}