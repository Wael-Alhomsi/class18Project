import React, { Component } from 'react';
import HouseContributionReport from './HouseContributionReport';

export default class AddingHouses extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, report: null };
    }

    submit = e => {
        e.preventDefault();

        fetch('http://localhost:8080/api/houses', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
            },
            body: this.dataInput.value,
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error, report: null });
                } else {
                    this.setState({ error: null, report: data });
                }
            })
            .catch(err => this.setState({ error: err.message }));
    };
    render() {
        const { error, report } = this.state;
        return (
            <div id="adding-form">
                {' '}
                <form onSubmit={this.submit}>
                    <div className="contribution-entry">
                        <textarea ref={input => (this.dataInput = input)} />

                        {error && <div className="error">{error}</div>}

                        <button>Submit</button>
                    </div>

                    {report && <HouseContributionReport report={report} />}
                </form>
            </div>
        );
    }
}
