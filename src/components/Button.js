import React from 'react';
import "./Button.css";
const Button = () => {
    return (<div className="main-action">
        <a className="main-scroll" href="#target-section">
          <div className="main-scroll-box">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M11.9997 13.1716L7.04996 8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z" fill="rgba(28,28,30,1)"/>
            </div>
          <div className="main-scroll-text">Scroll↓</div>
        </a>
      </div>);
};
export default Button;
