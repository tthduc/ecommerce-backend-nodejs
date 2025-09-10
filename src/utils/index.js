'use strict';

const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields);
}

// fields = ['_id', 'product_name', 'product_price'] = {'_id': 1, 'product_name': 1, 'product_price': 1}
const getSelectData = ({ fields = [] }) => {
    if (fields.length <= 0) return null;

    return fields.reduce((acc, field) => {
        acc[field] = 1;
        return acc;
    }, {});
}

const getUnSelectData = ({ fields = [] }) => {
    if (fields.length <= 0) return null;

    return fields.reduce((acc, field) => {
        acc[field] = 0;
        return acc;
    }, {});
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData
}