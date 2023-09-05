import React, { Component } from 'react';
import moment from 'moment';
import { DATEFORMAT } from '../../utils';

/** For valid format please see <a href="https://momentjs.com/docs/#/displaying/">Moment format options</a> */

class FormattedDate extends Component {

    render() {
        const { format, value, ...otherProps } = this.props;
        var dFormat = format ? format : DATEFORMAT;
        const formattedValue = value ? moment.utc(value).format(dFormat) : null;
        return (
            <span {...otherProps}>{formattedValue}</span>
        );
    }
}

export default FormattedDate;