import React, { Component } from 'react';
import './App.scss';
import { Route, Switch, Link } from 'react-router-dom';
import HousesList from './components/HousesList.js';
//import HouseDetails from './components/HouseDetails.js';
import AddingHouses from './components/AddingHouses.js';
import Home from './components/Home.js';

class App extends Component {
    render() {
        return (
            <div className="App">
                <ul className="desktop-menu">
                    <li>
                        <Link to="/api">Home</Link>
                    </li>
                    <li>
                        <Link to="/api/houses">Houses</Link>
                    </li>
                    <li>
                        <Link to="/contribute">Contribute</Link>
                    </li>
                    <li>
                        <Link to="/documentation">Documentation</Link>
                    </li>
                </ul>

                <div className="mobile-menu" ref={x => (this.mobMenu = x)}>
                    <Link to="/api">Home</Link>
                    <Link to="/api/houses">Houses</Link>
                    <Link to="/contribute">Contribute</Link>
                    <Link to="/documentation">Documentation</Link>
                </div>

                <Switch>
                    <Route exact path="/api" component={Home} />
                    {/* <Route exact path="/api" render={() => <div>Home</div>} /> */}
                    <Route exact path="/api/houses" component={HousesList} />
                    <Route exact path="/contribute" component={AddingHouses} />
                    {/* <Route
                        exact
                        path="/api/houses/:id"
                        component={HouseDetails}
                    /> */}

                    <Route render={() => <div>404 Page not found!</div>} />
                </Switch>

                <span
                    className="mobile-menu-icon"
                    ref={x => (this.mobMenuIcon = x)}
                    onClick={() => {
                        this.mobMenu.id = 'open-mobile-menu';
                        this.mobXButton.id = 'open-x';
                        this.mobMenuIcon.id = 'closed-icon';
                    }}
                >
                    <svg width="30" height="30">
                        <path d="M0,5 30,5" stroke="#fff" strokeWidth="5" />
                        <path d="M0,14 30,14" stroke="#fff" strokeWidth="5" />
                        <path d="M0,23 30,23" stroke="#fff" strokeWidth="5" />
                    </svg>
                </span>
                <span
                    className="mobile-x-btn"
                    ref={x => (this.mobXButton = x)}
                    onClick={() => {
                        this.mobMenu.id = '';
                        this.mobXButton.id = '';
                        this.mobMenuIcon.id = '';
                    }}
                >
                    &times;
                </span>
            </div>
        );
    }
}

export default App;
