import React, { Component } from 'react';

export default class ReportContribute extends Component {
    render() {
        const { report } = this.props;
        return (
            <div>
                Valid houses: {report.valid}
                <br />
                Invalid houses ({report.invalid.length}):
                {report.invalid.map((data, i) => (
                    <div key={i}>
                        Message:{' '}
                        <pre>{JSON.stringify(data.errors, null, 2)}</pre>
                        Raw: <pre>{JSON.stringify(data.raw, null, 2)}</pre>
                    </div>
                ))}
            </div>
        );
    }
}
