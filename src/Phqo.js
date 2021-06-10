import React, { Component }  from 'react';

class Phqo extends React.Component {

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
    //document.getElementById('printpage').addEventListener('click', window.print());
    //document.getElementById('printpage').addEventListener('click', window.print());
  }


    render() {
      return(
        <div>
            <div id="content-title" className="row justify-content-between">
                    <div> 
                        <i className="fas fa-fw fa-chevron-left"></i> 
                        <i className="fas fa-fw fa-chevron-right"></i> 
                        <i className="fas fa-fw fa-caret-down mr-2 "></i>
                        | 
                        <i className="fa fa-fw ml-2 fa-home" aria-hidden="true"></i> Provider Home/Quick Orders       
                    </div>
                    <div>
                        <div id="fullscreen_button" style={{display: 'inline-block', cursor: 'pointer'}}><i class="fas fa-fw fa-compress ml-3"></i> Full Screen</div>
                        <button id="printpage" onClick={() => window.print()}><i class="fas fa-fw fa-print ml-3"></i> Print</button>
                        <i className="fas fa-fw fa-sync-alt ml-3"></i> 1 minute ago
                    </div>
            </div>
            <div className="row" id="application">
              <div className="col-12">
                <div className="row justify-content-between py-1 px-1 phqo-buttons">
                  <div className="d-flex flex-row  ">
                    <div>
                      <i className="fas mx-1 fa-binoculars"></i>
                      <i className="fas mx-1 fa-search-minus"></i>
                      <i className="fas mx-1 fa-search-plus"></i>
                      <i className="fas mx-1 fa-home"></i>
                    </div>
                  </div>
                  <div className="collapse-all ml-auto" data-toggle="collapse" data-target=".col-md-4>.card>.multi-collapse">Expand/Collapse All
                  </div>
                </div>
                <div className="row pb-5">
                  <div className="col-md-4">
                    <div className="card purple">
                      <div className="card-header purple">
                        My Team V2 (Edit Profile)
                        <div className="options">
                          <i className="fas fa-bars mr-1 mr-1" />
                          <a data-toggle="collapse" href="#1"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={1}>
                        <div className="card-body">
                          <p>
                            1. Subdialectic deconstruction and the patriarchialist paradigm of
                            expression
                            “Consciousness is part of the defining characteristic of culture,” says
                            Baudrillard. The subject is contextualised into a modernism that includes
                            consciousness as a reality. But subdialectic deconstruction states that culture
                            is capable of social comment.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card purple">
                      <div className="card-header">
                        My Team
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#2"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={2}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Patient Information
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#3"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={3}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        C.H.R.I.S. Patient Attributes
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#4"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={4}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card grey">
                      <div className="card-header ">
                        ICU ABCDEF Bundle
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#5"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse-all" data-toggle="collapse" data-target=".accordion .multi-collapse">
                        Expand/Collapse All</div>
                      <div className="collapse show multi-collapse" id={5}>
                        <div className="card-body">
                          <div className="accordion">
                            <div className="card first">
                              <div className="card-header" id="headingOne">
                                <div className="mb-0">
                                  <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    A = Assess and Manage Plan
                                  </button>
                                </div>
                              </div>
                              <div id="collapseOne" className="collapse multi-collapse" aria-labelledby="headingOne">
                                <div className="card-body">
                                  1. Subdialectic deconstruction and the patriarchialist paradigm of
                                  expression
                                  “Consciousness is part of the defining characteristic of culture,”
                                  says
                                  Baudrillard. The subject is contextualised into a modernism that
                                  includes
                                  consciousness as a reality. But subdialectic deconstruction states
                                  that culture
                                  is capable of social comment.
                                  The characteristic theme of the works of Gaiman is the role of the
                                  artist as
                                  poet. In a sense, several theories concerning a postsemiotic
                                  totality may be
                                  discovered.
                                  Debord suggests the use of textual feminism to read society.
                                  Therefore, in
                                  The Books of Magic, Gaiman analyses subdialectic deconstruction; in
                                  Death: The Time of Your Life, however, he denies the predialectic
                                  paradigm of reality.
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="headingTwo">
                                <div className="mb-0">
                                  <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    B = Both Sedation Interruption and Breathing Tools
                                  </button>
                                </div>
                              </div>
                              <div id="collapseTwo" className="collapse multi-collapse" aria-labelledby="headingTwo">
                                <div className="card-body">
                                  The main theme of the works of Madonna is not discourse, but
                                  subdiscourse.
                                  Many materialisms concerning the stasis of dialectic class may be
                                  found.
                                  However, Derrida suggests the use of capitalist nihilism to
                                  deconstruct class
                                  divisions.
                                  A number of discourses concerning neocapitalist construction exist.
                                  Therefore, Sontag promotes the use of semiotic discourse to
                                  challenge and
                                  modify society.
                                  The primary theme of Scuglia’s[1] essay on capitalist
                                  nihilism is the role of the participant as writer. In a sense, any
                                  number of
                                  desublimations concerning the bridge between class and sexual
                                  identity may be
                                  discovered.
                                  If semiotic discourse holds, we have to choose between capitalist
                                  nihilism
                                  and subcapitalist capitalism. But Derrida suggests the use of
                                  material
                                  materialism to deconstruct outmoded perceptions of class.
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="headingThree">
                                <div className="mb-0">
                                  <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    C = Choice of Analgesia and Sedation
                                  </button>
                                </div>
                              </div>
                              <div id="collapseThree" className="collapse multi-collapse" aria-labelledby="headingThree">
                                <div className="card-body">
                                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                                  terry richardson ad squid. 3 wolf moon
                                  officia aute, non cupidatat skateboard dolor brunch. Food truck
                                  quinoa nesciunt laborum eiusmod. Brunch 3
                                  wolf moon tempor, sunt aliqua put a bird on it squid single-origin
                                  coffee nulla assumenda shoreditch et.
                                  Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                                  nesciunt sapiente ea proident. Ad vegan
                                  excepteur butcher vice lomo. Leggings occaecat craft beer
                                  farm-to-table, raw denim aesthetic synth nesciunt
                                  you probably haven't heard of them accusamus labore sustainable VHS.
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="headingFour">
                                <div className="mb-0">
                                  <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    D = Delirium
                                  </button>
                                </div>
                              </div>
                              <div id="collapseFour" className="collapse multi-collapse" aria-labelledby="headingFour">
                                <div className="card-body">
                                  Capitalist capitalism and the structuralist paradigm of
                                  expression<br /><br />
                                  The primary theme of the works of Rushdie is the common ground
                                  between
                                  society and class. It could be said that the opening/closing
                                  distinction
                                  intrinsic to Rushdie’s The Ground Beneath Her Feet emerges again in
                                  The Moor’s Last Sigh, although in a more mythopoetical sense. The
                                  structuralist paradigm of expression implies that truth may be used
                                  to oppress
                                  minorities, given that language is interchangeable with culture.
                                  However, if presemiotic discourse holds, we have to choose between
                                  capitalist capitalism and Lyotardist narrative. A number of
                                  patriarchialisms
                                  concerning the structuralist paradigm of expression exist.
                                  It could be said that von Ludwig[3] states that we have
                                  to choose between cultural theory and the subdialectic paradigm of
                                  narrative.
                                  The characteristic theme of Hanfkopf’s[4] critique of
                                  capitalist capitalism is a self-falsifying whole.
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="headingFive">
                                <div className="mb-0">
                                  <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                    E = Early Mobility and Exercise
                                  </button>
                                </div>
                              </div>
                              <div id="collapseFive" className="collapse multi-collapse" aria-labelledby="headingFive">
                                <div className="card-body">
                                  “Class is part of the economy of reality,” says Bataille. Marx
                                  suggests the
                                  use of postdialectic patriarchial theory to modify and read society.
                                  But the
                                  subject is interpolated into a semiotic nihilism that includes
                                  narrativity as a
                                  totality.
                                  In the works of Fellini, a predominant concept is the distinction
                                  between
                                  opening and closing. Any number of dematerialisms concerning the
                                  common ground
                                  between reality and society may be found. In a sense, Debord uses
                                  the term ‘the
                                  neocultural paradigm of context’ to denote not theory, but
                                  pretheory.
                                  “Sexual identity is unattainable,” says Sontag. Semiotic nihilism
                                  suggests
                                  that narrativity is used to exploit the underprivileged, but only if
                                  culture is
                                  distinct from sexuality. But if the neocultural paradigm of context
                                  holds, we
                                  have to choose between semiotic nihilism and subdialectic feminism.
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="headingSix">
                                <div className="mb-0">
                                  <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                    F = Family Engagement
                                  </button>
                                </div>
                              </div>
                              <div id="collapseSix" className="collapse multi-collapse" aria-labelledby="headingSix">
                                <div className="card-body">
                                  The main theme of the works of Stone is the role of the writer as
                                  artist.
                                  However, Lyotard promotes the use of postmodern narrative to
                                  challenge and
                                  analyse class.
                                  If constructivism holds, we have to choose between postmodern
                                  narrative and
                                  materialist construction. It could be said that Parry[4]
                                  implies that the works of Stone are modernistic.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Inpatient Medication
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#6"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={6}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        New Orders (My Favorites)
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#7"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={7}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Documents (0)
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#8"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={8}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Diagnostic Studies (0)
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#9"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={9}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card pink">
                      <div className="card-header">
                        Readmissions Risk
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#10"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={10}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card pink">
                      <div className="card-header">
                        Goals of Care / Advance Care Planning
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#11"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={11}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Selected Labs
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#12"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={12}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Vital Signs
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#13"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={13}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Oxygenation and Ventilation
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#14"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={14}>
                        <div className="card-body grey">
                          <p>
                            Body
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card grey">
                      <div className="card-header">
                        Intake and Ouput
                        <div className="options">
                          <i className="fas fa-bars mr-1" />
                          <a data-toggle="collapse" href="#15"><i className="fas fa-angle-up" /></a>
                        </div>
                      </div>
                      <div className="collapse show multi-collapse" id={15}>
                        <div className="card-body">
                          <p>
                            Body
                          </p>
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
export default Phqo;