import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class HousesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            houses: [],
            error: null,
            loading: null,
            searchCriteria: {
                size_rooms: 'all',
                price_min: 0,
                price_max: 1000000,
                location_city: '',
                order: 'location_country_asc',
                page: 1,
            },
        };
    }
    componentDidMount() {
        const params = this.props.location.search
            .replace(/^\?/, '')
            .split('&')
            .filter(elem => elem.length)
            .map(pair => pair.split('='))
            .reduce((params, [name, val]) => {
                params[name] = val;
                return params;
            }, {});

        this.setState(
            {
                loading: true,
                error: null,
                searchCriteria: {
                    ...this.state.searchCriteria,
                    ...params,
                },
            },
            this.fetchHouses
        );
    }
    fetchHouses(updateUrl = false) {
        const { searchCriteria } = this.state;

        const queryString = Object.keys(searchCriteria)
            .reduce((query, field) => {
                const val = searchCriteria[field];
                if (val !== null && val !== '') {
                    query.push(`${field}=${encodeURI(val)}`);
                }
                return query;
            }, [])
            .join('&');

        if (updateUrl) {
            this.props.history.push(
                this.props.location.pathname + '?' + queryString
            );
        }

        fetch(`http://localhost:8080/api/houses?${queryString}`)
            .then(res => res.json())
            .then(({ houses, total, pageSize, error }) => {
                if (error) {
                    this.setState({
                        error: error,
                        loading: null,
                        houses: [],
                        total: 0,
                    });
                } else {
                    this.setState({
                        houses,
                        total,
                        pageSize,
                        error: null,
                        loading: null,
                    });
                }
            })

            .catch(err =>
                this.setState({
                    error: err.message,
                    loading: null,
                    houses: [],
                    total: 0,
                })
            );
    }
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState(
            {
                ...this.state,
                searchCriteria: {
                    ...this.state.searchCriteria,
                    [name]: value,
                    page: 1,
                },
            },
            () => {
                this.fetchHouses(true);
            }
        );
    };
    render() {
        let {
            houses,
            error,
            loading,
            pageSize,
            total,
            searchCriteria: {
                size_rooms,
                price_min,
                price_max,
                location_city,
                order,
                page,
            },
        } = this.state;
        page = parseInt(page, 10);
        const pages = Math.ceil(total / pageSize);
        return (
            <form>
                <div>
                    <label>Total number of rooms</label>
                    <br />
                    <select
                        name="size_rooms"
                        value={size_rooms}
                        onChange={this.handleInputChange}
                    >
                        <option value="all">Show all houses</option>
                        <option value="1">1 room (a studio)</option>
                        <option value="2">2 rooms</option>
                        <option value="3">3 rooms</option>
                        <option value="4_or_more">4 or more rooms</option>
                    </select>
                    <br />
                    <label>Price min</label>
                    <br />
                    <select
                        name="price_min"
                        value={price_min}
                        onChange={this.handleInputChange}
                    >
                        <option value="0">0</option>
                        <option value="50000">50000</option>
                        <option value="100000">100000</option>
                        <option value="200000">200000</option>
                        <option value="500000">500000</option>
                    </select>
                    <br />
                    <label>Price max</label>
                    <br />
                    <select
                        name="price_max"
                        value={price_max}
                        onChange={this.handleInputChange}
                    >
                        <option value="50000">50000</option>
                        <option value="100000">100000</option>
                        <option value="200000">200000</option>
                        <option value="500000">500000</option>
                        <option value="1000000">1000000</option>
                    </select>
                    <br />
                    <label>City</label>
                    <br />
                    <select
                        name="location_city"
                        value={location_city}
                        onChange={this.handleInputChange}
                    >
                        <option value="">Select City</option>
                        <option value="Paris">Paris</option>
                        <option value="Amsterdam">Amsterdam</option>
                        <option value="Damascus">Damascus</option>
                    </select>
                    <br />

                    <label>Order</label>
                    <br />
                    <select
                        name="order"
                        value={order}
                        onChange={this.handleInputChange}
                    >
                        <option value="location_country_asc">
                            Country Asc
                        </option>
                        <option value="location_country_desc">
                            Country Desc
                        </option>
                        <option value="price_value_asc">Price Asc</option>
                        <option value="price_value_desc">Price Desc</option>
                    </select>
                </div>

                {loading && <div>Loading...</div>}

                {error && <div>{error}</div>}

                {Array.from({ length: pages || 0 }, (value, index) => {
                    const _page = index + 1;
                    return (
                        <div
                            key={index}
                            className={page === _page ? 'active' : ''}
                            onClick={() => {
                                this.setState(
                                    {
                                        ...this.state,
                                        searchCriteria: {
                                            ...this.state.searchCriteria,
                                            page: _page,
                                        },
                                    },
                                    () => this.fetchHouses(true)
                                );
                            }}
                        >
                            {_page}
                        </div>
                    );
                })}

                {houses.length === 0 ? (
                    <div>List is empty</div>
                ) : (
                    houses.map(house => (
                        <div key={house.id}>
                            <Link to={this.props.match.url + '/' + house.id}>
                                Price value: {house.price_value} <br />
                                Country: {house.location_country} <br />
                                City: {house.location_city} <br />
                                Number of rooms: {house.size_rooms}
                            </Link>
                            <br />
                            <br />
                        </div>
                    ))
                )}
            </form>
        );
    }
}

//
//
// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// export default class ListOfHouses extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             houses: [],
//             error: null,
//             loading: null,
//         };
//     }
//     componentDidMount() {
//         this.setState({ loading: true });
//         fetch('http://localhost:8080/api/houses')
//             .then(data => data.json())
//             .then(list =>
//                 this.setState({
//                     houses: list,
//                     error: null,
//                     loading: null,
//                 })
//             )
//             .catch(() =>
//                 this.setState({ error: 'Something went wrong!', loading: null })
//             );
//     }
//     render() {
//         const { houses, error, loading } = this.state;
//         if (loading) {
//             return <div>Loading...</div>;
//         }
//         if (error) {
//             return <div>{error}</div>;
//         }
//         if (!houses.length) {
//             return <div>List is empty</div>;
//         }
//         return houses.map(house => (
//             <div key={house.id}>
//                 <Link to={this.props.match.url + '/' + house.id}>
//                     House ID: {house.id}
//                 </Link>
//             </div>
//         ));
//     }
// }
