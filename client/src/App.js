import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Link } from 'react-router-dom';
import HousesList from './components/HousesList.js';
import HouseDetails from './components/HouseDetails.js';
import AddHouses from './components/AddHouses.js';

class App extends Component {
    render() {
        return (
            <div className="App" style={{ padding: '20px' }}>
                <ul>
                    <li>
                        <Link to="/api">Home</Link>
                    </li>
                    <li>
                        <Link to="/api/houses">Houses</Link>
                    </li>
                    <li>
                        <Link to="/contribute">Contribute</Link>
                    </li>
                </ul>
                <Switch>
                    <Route exact path="/api" render={() => <div>Home</div>} />
                    <Route exact path="/api/houses" component={HousesList} />
                    <Route exact path="/contribute" component={AddHouses} />
                    <Route
                        exact
                        path="/api/houses/:id"
                        component={HouseDetails}
                    />

                    <Route render={() => <div>404 Page not found!</div>} />
                </Switch>
            </div>
        );
    }
}

export default App;
