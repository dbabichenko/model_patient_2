import React, { Component }  from 'react';

class MedList extends Component{


  fullScreenToggle() { 

    var browser = document.documentElement;
    if (1 >= window.outerHeight - window.innerHeight){
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    else{
      if (browser.requestFullscreen) {
        browser.requestFullscreen();
      } else if (browser.mozRequestFullScreen) { /* Firefox */
        browser.mozRequestFullScreen();
      } else if (browser.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        browser.webkitRequestFullscreen();
      } else if (browser.msRequestFullscreen) { /* IE/Edge */
        browser.msRequestFullscreen();
      }
    }
  }

  componentDidMount(){
    document.getElementById('fullscreen_button').addEventListener('click', this.fullScreenToggle);
  }

    render(){
        return(
            <div>
  <div id="content-title" className="row justify-content-between">
                    <div> <i class="fas fa-fw fa-chevron-left"></i> <i class="fas fa-fw fa-chevron-right"></i> <i class="fas fa-fw fa-caret-down mr-2 "></i> | <i class="fa fa-fw ml-2 fa-home" aria-hidden="true"></i> Medication List</div>
                    <div>
                        <div  id="fullscreen_button" style={{display: 'inline-block', cursor: 'pointer'}}><i class="fas fa-fw fa-compress ml-3"></i> Full Screen</div>
                        <button id="printpage" onClick={() => window.print()}><i class="fas fa-fw fa-print ml-3"></i> Print</button>
                        <i class="fas fa-fw fa-sync-alt ml-3"></i> 1 minute ago
                    </div>
                </div>
  <div className="row" id="application">
    <div className="col-12 px-4 py-3">
      <div className="row">
        <div className="col-12">
          <div className="btn-toolbar align-middle" role="toolbar" aria-label="button toolbar allergies">
            <button type="button" className="btn btn-light mr-1 mb-1"><i className="fa fa-plus fa-fw" aria-hidden="true" />Add</button>
            <button type="button" className="btn btn-light mr-1 mb-1"><i className="fas fa-scroll fa-fw mr-1" />Document Medication by Hx</button>
            <button type="button" className="btn btn-light mr-1 mb-1"><i className="fas fa-pills mr-1 fa-fw" />Reverse Allergy Check</button>
            <div className="btn-group">
              <button id="reconciliation-dropdown" type="button" className="btn btn-light dropdown-toggle align-self-center  mr-1 mb-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Reconciliation
              </button>
              <div className="dropdown-menu" aria-labelledby="reconciliation-dropwdown">
                <a className="dropdown-item" href="#">Dropdown link</a>
                <a className="dropdown-item" href="#">Dropdown link</a>
              </div>
            </div>
            <button type="button" className="btn btn-light mr-1 mb-1">Check Interactions</button>
            <button type="button" className="btn btn-light mr-1 mb-1">Reverse Allergy Check</button>
            <div className="btn-group">
              <button id="external-rx-history-dropdown" type="button" className="btn btn-light dropdown-toggle align-self-center  mr-1 mb-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-book-medical fa-fw mr-1" />External Rx History
              </button>
              <div className="dropdown-menu" aria-labelledby="external-rx-history-dropdown">
                <a className="dropdown-item" href="#">Dropdown link</a>
                <a className="dropdown-item" href="#">Dropdown link</a>
              </div>
            </div>
            <div className="btn-group">
              <button id="rx-plans-dropdown" type="button" className="btn btn-light dropdown-toggle align-self-center mr-1 mb-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Rx Plans (0): No Benefit Found
              </button>
              <div className="dropdown-menu" aria-labelledby="rx-plans-dropdown">
                <a className="dropdown-item" href="#">Dropdown link</a>
                <a className="dropdown-item" href="#">Dropdown link</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <a className="nav-item nav-link active" id="nav-orders-tab" data-toggle="tab" href="#nav-orders-content" role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
              <a className="nav-item nav-link" id="nav-med-list-tab" data-toggle="tab" href="#nav-med-list-content" role="tab" aria-controls="nav-profile" aria-selected="false">Medication List</a>
            </div>
          </nav>
          <div className="tab-content p-1" id="med-tab-content">
            <div className="tab-pane fade show active" id="nav-orders-content" role="tabpanel" aria-labelledby="nav-orders-tab">
              <div className="row">
                <div className="col-3">
                  <div style={{textAlign: 'right'}}><i className="fa fa-step-backward" /></div>
                  <div className="accordion" id="orders-accordion">
                    <div className="card">
                      <div className="card-header" id="orders-view-heading">
                        <h5 className="mb-0">
                          <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#orders-view" aria-expanded="true" aria-controls="orders-view">
                            View
                          </button>
                        </h5>
                      </div>
                      <div id="orders-view" className="collapse show" aria-labelledby="orders-view-heading" data-parent="orders-accordion">
                        <div className="card-body">
                          <ul style={{listStyle: 'none'}}>
                            <li>
                              Orders for Signature
                            </li>
                            <li>
                              Plans
                            </li>
                            <li>
                              <input type="checkbox" data-id="item" data-name="Item" />Orders
                              <ul style={{listStyle: 'none'}}>
                                <li><input type="checkbox" data-id="subitem1" data-name="Subitem 1" />Order Sets</li>
                                <li><input type="checkbox" data-id="subitem2" data-name="Subitem 2" />Condition/Status</li>
                                <li><input type="checkbox" data-name="subitem3" />Communication Orders</li>
                                <li><input type="checkbox" data-name="subitem4" />Vital Signs</li>
                                <li><input type="checkbox" data-name="subitem5" />Activity</li>
                                <li><input type="checkbox" data-name="subitem6" />Patient Care</li>
                                <li><input type="checkbox" data-name="subitem7" />Nutritional Services</li>
                                <li><input type="checkbox" data-name="subitem8" />Continuous Infusions</li>
                                <li><input type="checkbox" data-name="subitem9" />Medications</li>
                                <li><input type="checkbox" data-name="subitem10" />Blood Products</li>
                                <li><input type="checkbox" data-name="subitem11" />General Lab/AP</li>
                                <li><input type="checkbox" data-name="subitem12" />Radiology</li>
                                <li><input type="checkbox" data-name="subitem13" />Diagnostic Tests/Procedures</li>
                                <li><input type="checkbox" data-name="subitem14" />Consults/Therapies</li>
                                <li><input type="checkbox" data-name="subitem15" />Education</li>
                                <li><input type="checkbox" data-name="subitem16" />Non Categorized</li>
                                <li><input type="checkbox" data-name="subitem17" />Scheduled Op Procedures</li>
                                <li><input type="checkbox" data-name="subitem18" />Medical Surgeries</li>
                                <li><input type="checkbox" data-name="subitem19" />Medical Supplies</li>
                              </ul>
                            </li>
                            <li>
                              Medication History
                              <ul style={{listStyle: 'none'}}>
                                <li>
                                  Medication History Snapshot
                                </li>
                              </ul>
                            </li>
                            <li>
                              Reconciliation History
                              <ul style={{listStyle: 'none'}}>
                                <li />
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header " id="orders-related-results-heading">
                        <h5 className="mb-0">
                          <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#orders-related-results" aria-expanded="false" aria-controls="orders-related-results">
                            Related Results
                          </button>
                        </h5>
                      </div>
                      <div id="orders-related-results" className="collapse" aria-labelledby="orders-related-results-heading" data-parent="orders-accordion">
                        <div className="card-body">
                          placeholder
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header " id="formulary-details-heading">
                        <h5 className="mb-0">
                          <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#formulary-details" aria-expanded="false" aria-controls="formulary-details">
                            Formulary Details
                          </button>
                        </h5>
                      </div>
                      <div id="formulary-details" className="collapse" aria-labelledby="formulary-details-heading" data-parent="orders-accordion">
                        <div className="card-body">
                          placeholder
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-9">
                  <div className="filter-display">
                    Displayed: All orders 5 days back
                  </div>
                  <div className="table-responsive">
                    <table id="tablePreview" className="table table-hover table-bordered table-sm">
                      <thead>
                        <tr>
                          <th />
                          <th><i className="fa fa-wrench" /></th>
                          <th>$</th>
                          <th />
                          <th><i className="fa fa-flag" /></th>
                          <th>Order Name</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="filter-details">
                    <i className="fa fa-step-backward fa-rotate-90 fa-fw" />Details
                  </div>
                  <div>
                    <button type="button" className="btn btn-light float-right">Orders for Signature</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="nav-med-list-content" role="tabpanel" aria-labelledby="nav-med-list-tab">
              <div className="row">
                <div className="col-3">
                  <div style={{textAlign: 'right'}}><i className="fa fa-step-backward" /></div>
                  <div className="accordion" id="med-list-accordion">
                    <div className="card">
                      <div className="card-header" id="med-list-view-heading">
                        <h5 className="mb-0">
                          <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#med-list-view" aria-expanded="true" aria-controls="med-list-view">
                            View
                          </button>
                        </h5>
                      </div>
                      <div id="med-list-view" className="collapse show" aria-labelledby="med-list-view-heading" data-parent="med-list-accordion">
                        <div className="card-body">
                          <ul style={{listStyle: 'none'}}>
                            <li>
                              Orders for Signature
                            </li>
                            <li>
                              <input type="checkbox" data-id="item" data-name="Item" />Medication List
                              <ul style={{listStyle: 'none'}}>
                                <li><input type="checkbox" data-id="subitem1" data-name="Subitem 1" />Order Sets
                                </li>
                                <li><input type="checkbox" data-id="subitem2" data-name="Subitem 2" />Condition/Status</li>
                                <li><input type="checkbox" data-name="subitem3" />Communication Orders</li>
                                <li><input type="checkbox" data-name="subitem4" />Vital Signs</li>
                                <li><input type="checkbox" data-name="subitem5" />Activity</li>
                                <li><input type="checkbox" data-name="subitem6" />Patient Care</li>
                                <li><input type="checkbox" data-name="subitem7" />Nutritional Services</li>
                                <li><input type="checkbox" data-name="subitem8" />Continuous Infusions</li>
                                <li><input type="checkbox" data-name="subitem9" />Medications</li>
                                <li><input type="checkbox" data-name="subitem10" />Blood Products</li>
                                <li><input type="checkbox" data-name="subitem11" />General Lab/AP</li>
                                <li><input type="checkbox" data-name="subitem12" />Radiology</li>
                                <li><input type="checkbox" data-name="subitem13" />Diagnostic Tests/Procedures</li>
                                <li><input type="checkbox" data-name="subitem14" />Consults/Therapies</li>
                                <li><input type="checkbox" data-name="subitem15" />Education</li>
                                <li><input type="checkbox" data-name="subitem16" />Non Categorized</li>
                                <li><input type="checkbox" data-name="subitem17" />Scheduled Op Procedures</li>
                                <li><input type="checkbox" data-name="subitem18" />Medical Surgeries</li>
                                <li><input type="checkbox" data-name="subitem19" />Medical Supplies</li>
                              </ul>
                            </li>
                            <li>
                              Medication History
                              <ul style={{listStyle: 'none'}}>
                                <li>
                                  Medication History Snapshot
                                </li>
                              </ul>
                            </li>
                            <li>
                              Reconciliation History
                              <ul style={{listStyle: 'none'}}>
                                <li />
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header " id="med-list-related-results-heading">
                        <h5 className="mb-0">
                          <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#med-list-related-results" aria-expanded="false" aria-controls="med-list-related-results">
                            Related Results
                          </button>
                        </h5>
                      </div>
                      <div id="med-list-related-results" className="collapse" aria-labelledby="med-list-related-results-heading" data-parent="med-list-accordion">
                        <div className="card-body">
                          placeholder
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header " id="formulary-details-heading">
                        <h5 className="mb-0">
                          <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#med-list-formulary-details" aria-expanded="false" aria-controls="med-list-formulary-details">
                            Formulary Details
                          </button>
                        </h5>
                      </div>
                      <div id="med-list-formulary-details" className="collapse" aria-labelledby="med-list-formulary-details-heading" data-parent="med-list-accordion">
                        <div className="card-body">
                          <div><img style={{objectFit: 'contain'}} src="https://i.imgur.com/aTClmKL.gif" /> </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-9">
                  <div className="filter-display">
                    Displayed: All orders 5 days back
                  </div>
                  <div className="table-responsive">
                    <table id="tablePreview" className="table table-hover table-bordered table-sm">
                      <thead>
                        <tr>
                          <th />
                          <th><i className="fa fa-wrench" /></th>
                          <th>$</th>
                          <th />
                          <th><i className="fa fa-flag" /></th>
                          <th>Order Name</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="filter-details">
                    <i className="fa fa-step-backward fa-rotate-90 fa-fw" />Details
                  </div>
                  <div>
                    <button type="button" className="btn btn-light float-right">Orders for Signature</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  </div>
</div>

        );
    }
}

export default MedList;