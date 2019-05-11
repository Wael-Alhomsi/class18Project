import React, { Component } from 'react';

export default class HouseContributionReport extends Component {
    render() {
        const { report } = this.props;
        return (
            <div className="contribution-report">
                <h3>
                    {' '}
                    {`${
                        report.validHousesCount
                    } houses are added successfuly to the database.`}
                    <br />
                    {`${
                        report.invalidHousesArray.length
                    } objects are invalid house objects.`}
                </h3>
                <br />
                <br />
                {report.invalidHousesArray.map((data, i) => (
                    <div key={i}>
                        <h4>{`Invalid house object number ${i + 1}`}</h4>
                        Error messages:{' '}
                        <pre>{JSON.stringify(data.errors, null, 2)}</pre>
                        Raw house object:{' '}
                        <pre>{JSON.stringify(data.raw, null, 2)}</pre>
                    </div>
                ))}
            </div>
        );
    }
}
