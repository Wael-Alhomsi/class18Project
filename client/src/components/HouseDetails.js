import React, { Component } from 'react';

export default class HouseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            houseDetails: {},
            error: null,
            loading: null,
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        fetch('http://localhost:8080/api/houses/' + this.props.match.params.id)
            .then(data => data.json())
            .then(details => {
                if (details.error) {
                    this.setState({
                        error: details.error,
                        loading: null,
                    });
                } else {
                    this.setState({
                        houseDetails: details[0],
                        error: null,
                        loading: null,
                    });
                }
            })
            .catch(() =>
                this.setState({ error: 'Something went wrong!', loading: null })
            );
    }

    render() {
        const { houseDetails, error, loading } = this.state;
        if (error) {
            return <div>{error}</div>;
        }
        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <ul>
                <li>House id: {houseDetails.id}</li>
                <li>Price: {houseDetails.price}</li>
                <li>Description: {houseDetails.description}</li>
            </ul>
        );
    }
}
