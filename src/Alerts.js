import React, { Component }  from 'react';

class Alerts extends Component{

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
                    <div> <i class="fas fa-fw fa-chevron-left"></i> <i class="fas fa-fw fa-chevron-right"></i> <i class="fas fa-fw fa-caret-down mr-2 "></i> | <i class="fa fa-fw ml-2 fa-home" aria-hidden="true"></i> Alerts</div>
                    <div>
                        <div  id="fullscreen_button" style={{display: 'inline-block', cursor: 'pointer'}}><i class="fas fa-fw fa-compress ml-3"></i> Full Screen</div>
                        <button id="printpage" onClick={() => window.print()}><i class="fas fa-fw fa-print ml-3"></i> Print</button>
                        <i class="fas fa-fw fa-sync-alt ml-3"></i> 1 minute ago
                    </div>
                </div>
                <div className="row justify-content-center" id="application">
                    <div className="container-fluid thin-in-shadow m-2" id="alerts">
                    <h3>Alerts</h3>
                    <div className="row mt-3 ml-1">
                        <div className="container-fluid">
                        <h5>CPOE (Pop-up) Alerts</h5>
                        No CPOE (Pop-up) alerts present
                        <br />
                        <br />
                        </div>
                    </div>
                    <div className="row mt-3 ml-1">
                        <div className="container-fluid">
                        <h5>Drug-Allergy Alerts</h5>
                        No Drug-Allergy alerts present
                        <br />
                        <br />
                        </div>
                    </div>
                    <div className="row mt-3 ml-1">
                        <div className="container-fluid">
                        <h5>Drug-Drug Alerts</h5>
                        No Drug-Drug alerts present
                        <br />
                        <br />
                        </div>
                    </div>
                    <div className="row mt-3 ml-1">
                        <div className="container-fluid">
                        <h5>Drug-Duplicate Alerts</h5>
                        No Drug-Duplicate alerts present
                        <br />
                        <br />
                        </div>
                    </div>
                    </div>    
                </div>
                </div>

        );
    }
}

export default Alerts;