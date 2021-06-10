import React, { Component }  from 'react';

class Demographics extends Component{

    
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
                    <div> <i class="fas fa-fw fa-chevron-left"></i> <i class="fas fa-fw fa-chevron-right"></i> <i class="fas fa-fw fa-caret-down mr-2 "></i> | <i class="fa fa-fw ml-2 fa-home" aria-hidden="true"></i> Demographics</div>
                    <div>
                        <div  id="fullscreen_button" style={{display: 'inline-block', cursor: 'pointer'}}><i class="fas fa-fw fa-compress ml-3"></i> Full Screen</div>
                        <button id="printpage" onClick={() => window.print()}><i class="fas fa-fw fa-print ml-3"></i> Print</button>
                        <i class="fas fa-fw fa-sync-alt ml-3"></i> 1 minute ago
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 px-4 py-3">
                    <div className="row">Mark All as Reviewed</div>
                    <div className="row">
                        <div className="btn-toolbar" role="toolbar" aria-label="button toolbar allergies">
                        <button type="button" className="btn btn-light mr-1 mb-1"><i className="fa fa-plus fa-fw mr-1" aria-hidden="true" />Add</button>
                        <button type="button" className="btn btn-light mr-1 mb-1"><i className="fa fa-pencil-square-o fa-fw mr-1" aria-hidden="true" />Modify</button>
                        <button type="button" className="btn btn-light mr-1 mb-1"><i className="far fa-circle fa-fw mr-1" aria-hidden="true" />Demographics option 1</button>
                        <button type="button" className="btn btn-light mr-1 mb-1"><i className="fa fa-circle-o-notch fa-fw mr-1" aria-hidden="true" />Demographics option 2</button>
                        <button type="button" className="btn btn-light mr-1 mb-1"><i className="fa fa-undo fa-fw mr-1" aria-hidden="true" />Demographics option 3</button>
                        <label htmlFor="allegeries-display">Display:</label>
                        <div className="btn-group">
                            <button id="allergies-display" type="button" className="btn btn-light mr-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Active
                            </button>
                            <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Dropdown link</a>
                            <a className="dropdown-item" href="#">Dropdown link</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-12 mt-3 thin-in-shadow table-container">
                        <table className="table table-hover table-borderless">
                            <thead>
                            <tr>
                                <th scope="col">D/A</th>
                                <th scope="col">Substance</th>
                                <th scope="col">Category</th>
                                <th scope="col">Reactions</th>
                                <th scope="col">Severe</th>
                                <th scope="col">Type</th>
                                <th scope="col">C.</th>
                                <th scope="col">Est. Onset</th>
                                <th scope="col">Reaction Speed</th>
                                <th scope="col">Updated By</th>
                                <th scope="col">Source</th>
                                <th scope="col">Reviewed</th>
                                <th scope="col">I...</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>1</td>
                                <td>2</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>1</td>
                                <td>2</td>
                                <td>5</td>
                                <td>3</td>
                                <td>65</td>
                                <td>3</td>
                                <td>5</td>
                                <td>3</td>
                                <td>78</td>
                                <td>3</td>
                                <td>3</td>
                                <td>54</td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Demographics;