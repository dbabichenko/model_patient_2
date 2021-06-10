import React,{Component} from 'react';
import './App.css';
import {
  Route,
  NavLink,
  HashRouter
} from  "react-router-dom";
import Alerts from './Alerts';
import Allergies from './Allergies';
import ClinicalNotes from './Clinical-Notes';
import Lab from './Lab';
import MedList from './Med-List';
import Phqo from './Phqo';
import Reports from './Reports';
import Demographics from './Demographics';





class App extends Component {

  

  render() {
      return (
      <div id="main" className="container-fluid h-100">
          <div id="tabs" className="row">
          <ul className="nav nav-tabs">
            <li>
              <a className="nav-link active" href="#">CRAYON, RED</a>
            </li>
            <li>
              <a className="nav-link" href="#">PENCIL, BLACK</a>
            </li>
            <li>
              <a className="nav-link" href="#">PEN, BLACK</a>
            </li>
          </ul>
        </div>
          <div id="tab-content" className="row">
            CRAYON, RED<br />
            **Allergies not recorded**<br />
            4Y (5/1/2019) F
          </div>
          <div id="content-panel" className="row">
           <HashRouter>
                <div id="sidebar" className="col-lg-2 col-3 h-100 flex-vertical">
                <div className="title">
                  Menu
                </div>
                <ul id="menubar" className="nav">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/Phqo/">Provider Home/Quick Orders</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/Orders">Orders</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/powernote">PowerNote 2G</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/clinical-notes">Clinical Notes</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/documents">All Documents</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/outside-records">Outside Records</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/impression-plan">Impression and Plan</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/lab">Lab</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/micro">Micro</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/microviewer">MicroViewer</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/reports">Reports</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/radiology">Radiology</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/vital-signs">Vital Signs</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/data">All Data</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/med-review">Med Review</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/mar-sum">Mar Sum</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/patient-info">Patient Information</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <br />
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/36-hour">36 Hour View</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/allergies">Allergies</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/demographics">Demographics</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/caredex">Caredex</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/communication-view">Communication View</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/free-text-doc">Free Text Documentation</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/forms">Forms</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/hemodialysis">Hemodialysis View</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/immunizations">Immunizations</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/pcm-labor-delivery">PCM Labor &amp; Delivery View</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/emar">eMAR</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/med-list">Medication List</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/med-grid">Med Grid</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/newborn">Newborn View</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/nicu">NICU View</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/nurse-docs">Nursing Documentation</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/pregnancy-report">Pregnancy Report</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/pregnancy-summary">Pregnancy Summary</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/problems-diagnoses">Problems and Diagnoses</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <br />
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/growth-charts">Growth Charts</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/delivery-record">Delivery Record</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/health-maintenance">Health Maintenance</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/histories">Histories</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/assess">Assess</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/rehab-view">Rehab View</NavLink>
                    <div className="underline" />
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/alerts">Alerts</NavLink>
                    <div className="underline" />
                  </li>
                </ul>
              </div>
              
              <div id="display" className="col-lg-10 col-9 h-100">
                <Route path="/alerts" component={Alerts}/>
                <Route path="/allergies" component={Allergies}/>
                <Route path="/clinical-notes" component={ClinicalNotes}/>
                <Route path="/lab" component={Lab}/>
                <Route path="/med-list" component={MedList}/>
                <Route path="/phqo" component={Phqo}/>
                <Route path="/reports" component={Reports}/>
                <Route path="/demographics" component={Demographics}/>
              </div>
            </HashRouter>
          </div>
    </div>
      );
  }  
}
export default App;
