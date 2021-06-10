import React, { Component }  from 'react';


class Lab extends Component {


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

    render() {
      return (
        <div>
            <div id="content-title" className="row justify-content-between">
                    <div> 
                        <i className="fas fa-fw fa-chevron-left"></i> 
                        <i className="fas fa-fw fa-chevron-right"></i> 
                        <i className="fas fa-fw fa-caret-down mr-2 "></i> 
                        | 
                        <i className="fa fa-fw ml-2 fa-home" aria-hidden="true"></i> Clinical Notes
                        
                    </div>
                    <div>
                        <div id="fullscreen_button" style={{display: 'inline-block', cursor: 'pointer'}}><i className="fas fa-fw fa-compress ml-3"></i> Full Screen</div>
                        <button id="printpage" onClick={() => window.print()}><i className="fas fa-fw fa-print ml-3"></i> Print</button>
                        <i className="fas fa-fw fa-sync-alt ml-3"></i> 1 minute ago
                    </div>
            </div>
            <div className="row" id="application">
                <div className="col-12 px-4 py-2">
                  <div className="row">
                      <i className="fas fa-save m-1" style={{cursor: 'pointer'}}/>
                      <i className="far fa-copy m-1" style={{cursor: 'pointer'}} />
                  </div>
                
                  <div className="row flowsheet-datebar">
                      <div className="arrows col-2 text-center">
                        <i className="fas fa-caret-left w-50" style={{cursor: 'pointer'}} />
                        <i className="fas fa-caret-right w-50 border-left" style={{cursor: 'pointer'}} />
                      </div>
                      <div className="datebar-date col-8 text-center px-1">Friday, May 20th, 2016 - Monday, May 20, 2019, 0 out of 0 documents are accessible.</div>
                      <div className="arrows col-2 text-center">
                        <i className="fas fa-caret-left w-50" style={{cursor: 'pointer'}} />
                        <i className="fas fa-caret-right w-50 border-left" style={{cursor: 'pointer'}} />
                      </div>
                  </div>
                  <div className="row border py-1">
                        <div className="col-lg-2 col-md-3 flex-column">
                          <div className="clin-notes-nav">
                              <div className="clin-notes-nav-results m-1">
                                No results-found
                              </div>
                              <div className="clin-notes-nav-options m-1 ml-2">
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="clin-notes-filter" id="clin-notes-filter-type" value="type" checked></input>
                                      <label className="form-check-label" for="clin-notes-filter-type">
                                        By type
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="clin-notes-filter" id="clin-notes-filter-status" value="status" checked></input>
                                      <label className="form-check-label" for="clin-notes-filter-status">
                                        By status
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="clin-notes-filter" id="clin-notes-filter-date" value="date" checked></input>
                                      <label className="form-check-label" for="clin-notes-filter-date">
                                        By date
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="clin-notes-filter" id="clin-notes-filter-performed" value="performed" checked></input>
                                      <label className="form-check-label" for="clin-notes-filter-performed">
                                        Performed by
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="clin-notes-filter" id="clin-notes-filter-encounter" value="encouner" checked></input>
                                      <label className="form-check-label" for="clin-notes-filter-encounter">
                                        By encounter
                                      </label>
                                    </div>
                                    <div className="text-center my-2">
                                      <i class="fas fa-arrow-down fa-fw fa-2x mx-1" style={{cursor: 'pointer'}}></i>
                                      <i class="fas fa-arrow-up fa-fw fa-2x mx-1" style={{cursor: 'pointer'}}></i>
                                    </div>
                              </div>
                          </div>
                         
                        </div>
                        <div className="col-lg-10 col-md-9">
                          <div className="d-flex flex-column align-baseline h-100 clin-notes-results ">
                            <div className="clin-notes-results-body h-75"></div>
                            <div className="clin-notes-results-actions h-25">
                              <div className="table-responsive">
                                <table id="clin-actions-table" className="table table-hover table-bordered table-sm actions-table">
                                  <thead>
                                    <tr>
                                      <th>Action</th>
                                      <th>Performed By</th>
                                      <th>Performed Date</th>
                                      <th>Action Status</th>
                                      <th>Comment</th>
                                      <th>Proxy Personnel</th>
                                      <th>Request By</th>
                                      <th>Requested Date</th>
                                      <th>Request Comment</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Placeholder 1</td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                    <tr>
                                      <td>Placeholder 2</td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                    <tr>
                                      <td>Placeholder 3</td>
                                      <td />
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
   
  export default Lab;