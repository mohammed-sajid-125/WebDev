import React from 'react';
import './App.css';
import Spinner from './components/spinner/spinner';

import {Routes,Route,Navigate} from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Contactlist from './components/contacts/contactlist/Contactlist';
import Addcontact from './components/contacts/Addcontact/Addcontact';
import Viewcontact from './components/contacts/Viewcontact/Viewcontact';
import Editcontact from './components/contacts/Editcontact/Editcontact';
let App=()=> {
  
  return (
    <div className="App">
      <React.Fragment>
       
        <Navbar/>
          <Routes>
            <Route path={'/'} element={<Navigate to ={'/contacts/list'}/>}/>
            <Route path={'/contacts/list'} element={<Contactlist/>}/>
            <Route path={'/contacts/add'} element={<Addcontact/>}/>
            <Route path={'/contacts/view/:contactId'} element={<Viewcontact/>}/>
            <Route path={'/contacts/edit/:contactId'} element={<Editcontact/>}/>
          </Routes>
        

      </React.Fragment>
      
    </div>
  );
}

export default App;
