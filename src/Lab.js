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
                      <div> <i className="fas fa-fw fa-chevron-left"></i> <i className="fas fa-fw fa-chevron-right"></i> <i className="fas fa-fw fa-caret-down mr-2 "></i> | <i className="fa fa-fw ml-2 fa-home" aria-hidden="true"></i> Lab</div>
                      <div>
                          <div  id="fullscreen_button" style={{display: 'inline-block', cursor: 'pointer'}}><i className="fas fa-fw fa-compress ml-3"></i> Full Screen</div>
                          <button id="printpage" onClick={() => window.print()}><i className="fas fa-fw fa-print ml-3"></i> Print</button>
                          <i className="fas fa-fw fa-sync-alt ml-3"></i> 1 minute ago
                      </div>
                  </div>
              <div className="row" id="application">
                  <div className="col-12 px-4 py-2">
                    <div className="row">
                        <i className="fa fa-bar-chart m-2" style={{cursor: 'pointer'}} aria-hidden="true" />
                        <i className="fa fa-search m-2" style={{cursor: 'pointer'}} />
                        <i className="fab fa-digital-ocean m-2" style={{cursor: 'pointer'}} />
                    </div>
                    <div className="row flowsheet-row"> 
                            <form className="mx-2 my-1 align-items-center d-flex flex-row">
                            <div className="nowrap">Flowsheet: &nbsp;</div>
                              <select name="flowsheet-selection">
                                  <option value="laboratory">Laboratory</option>
                                  <option value="reports">Reports</option>
                                  <option value="change">Option 3</option>
                              </select>  
                              <button className="flowsheet-button square m-1">...</button>
                            </form>
                      
                            <form className="mx-2 my-1  d-flex flex-row  align-items-center">
                            <div>Level: &nbsp;</div>
                              <select name="flowsheet-level">
                                  <option value="change_me">Option 1</option>
                                  <option value="another_placeholder">Option 2</option>
                                  <option value="placeholder">Option 3</option>
                              </select>  
                            </form>
                    
                                  
                        <form className="d-flex flex-row align-items-center mx-2 my-1 ">
                          
                            <div className="mx-1">
                              <input type="radio" name="display" value="table" checked></input>Table
                            </div>
                          

                          
                            <div className="mx-1">
                              <input type="radio" name="display" value="group" checked></input>Group
                            </div>
                        

                        
                            <div className="mx-1">
                              <input type="radio" name="display" value="list" checked></input>List
                            </div>
                          
                        </form>
                      
                    
                    </div>
                    <div className="row flowsheet-datebar">
                      <div className="arrows col-2 text-center">
                        <i className="fas fa-caret-left w-50" style={{cursor: 'pointer'}} />
                        <i className="fas fa-caret-right w-50 border-left" style={{cursor: 'pointer'}} />
                      </div>
                      <div className="datebar-date col-8 text-center px-1">Last 100 results in the past 3 years</div>
                        <div className="arrows col-2 text-center">
                        <i className="fas fa-caret-left w-50" style={{cursor: 'pointer'}} />
                        <i className="fas fa-caret-right w-50 border-left" style={{cursor: 'pointer'}} />
                      </div>
                  </div>
                    <div className="row border py-1 justify-content-around">
                        <div className="col-lg-2 col-md-3 d-flex flex-column">
                          <div className="flowsheet-navigator">

                            <div className="flowsheet-navigator-header d-flex align-items-center justify-content-between px-1">Navigator<i className="fa fa-window-close" aria-hidden="true"></i>
                            </div> 
                              
                            <div className="px-1 flowsheet-navigator-body">
                              
                            </div>

                          </div>
                          
                          
                        </div>
                        <div className="col-lg-10 col-md-9">
                          <div className="d-flex flex-column">
                            <div className="flowsheet-results-header px-2 py-1">
                              <button type="button" className="flowsheet-button">Show more results</button>
                            </div>
                            <div className="flowsheet-results ">
                              No results found.
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