import React, { Component } from 'react';
import ReportContribute from './ReportContribute';

export default class AddHouses extends Component {
    state = { error: null, report: null };
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
                    this.setState({ error: data.error });
                } else {
                    this.setState({ error: null, report: data });
                }
            })
            .catch(err => this.setState({ error: err.message }));
    };
    render() {
        const { error, report } = this.state;
        return (
            <form onSubmit={this.submit}>
                <textarea
                    ref={input => (this.dataInput = input)}
                    style={{
                        width: '90%',
                        height: '200px',
                        display: 'block',
                    }}
                />
                {error && <div>{error}</div>}

                <button>Submit</button>
                <br />
                {!!report && <ReportContribute report={report} />}
            </form>
        );
    }
}
