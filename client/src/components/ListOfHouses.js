import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class ListOfHouses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            houses: [],
            error: null,
            loading: null,
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        fetch('http://localhost:8080/api/houses')
            .then(data => data.json())
            .then(list =>
                this.setState({
                    houses: list,
                    error: null,
                    loading: null,
                })
            )
            .catch(() => this.setState({ error: 'Something went wrong!' }));
    }
    render() {
        const { houses, error, loading } = this.state;
        if (loading) {
            return <div>Loading...</div>;
        }
        if (error) {
            return <div>{error}</div>;
        }
        if (!houses.length) {
            return <div>List is empty</div>;
        }
        return houses.map(house => (
            <div key={house.id}>
                <Link to={this.props.match.url + '/' + house.id}>house.id</Link>
            </div>
        ));
    }
}
