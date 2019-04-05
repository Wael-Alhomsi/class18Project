import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Link } from 'react-router-dom';
import ListOfHouses from './components/ListOfHouses.js';
import HouseDetails from './components/HouseDetails.js';

class App extends Component {
    render() {
        return (
            <div className="App">
                <ul>
                    <li>
                        <Link to="/api">Home</Link>
                    </li>
                    <li>
                        <Link to="/api/houses">Houses</Link>
                    </li>
                </ul>
                <Switch>
                    <Route exact path="/api" render={() => <div>Home</div>} />
                    <Route exact path="/api/houses" component={ListOfHouses} />
                    <Route
                        exact
                        path="/api/houses/:id"
                        component={HouseDetails}
                    />

                    <Route render={() => <div>404</div>} />
                </Switch>
            </div>
        );
    }
}

export default App;
