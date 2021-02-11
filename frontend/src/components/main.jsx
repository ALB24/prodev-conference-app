import React from "react";

const Main = () => {
  return (
    <div className="row d-flex home-container align-items-center">
      
      <div className="container-fluid mt-5">
        <div className="row d-flex">
          <div className="col-9 col-md-6 col-lg-5 offset-1">
            <div className="card oswald-semibold" id="card-home">
              <div className="card-body">
                <h1 className="card-title">Main Page</h1>
                <p className="card-subtitle card-text-home text-uppercase">
                  Conference app
                </p>
                <p className="card-text-home oswald-regular mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;