/* eslint-disable no-unused-vars */
import React, {
  Component
} from 'react';
import {
  Navbar
} from 'react-bootstrap';
import './css/UnicefNav.css';
import unicef from '../data/unicef.png'
import pc from '../data/pc.png'

/**
 * Unicef Navbar component
 */
class UnicefNav extends Component {
  /**
   * Render Unicef navbar
   *
   * @return {component}
   */
  render() {
    return (
      <Navbar>
        <Navbar.Brand className="navl">
          <a href="unicef.org"><img src={unicef} height= "100%" alt=""/></a>
        </Navbar.Brand>
        <Navbar.Brand className ="navr">
          <a href="http://projectconnect.world"><img src={pc} height= "100%" alt=""/></a>
        </Navbar.Brand>
      </Navbar>
    );
  }
}

export default UnicefNav;