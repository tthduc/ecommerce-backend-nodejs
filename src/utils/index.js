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

/**
 * Remove undefined and null properties from an object
 * 1. (obj = {}) - default parameter to ensure obj is always an object
 * 2. Object.entries(obj) - converts the object into an array of [key, value] pairs
 * 3. .filter(([_, v]) => v !== undefined && v !== null) - filters out entries where the value is undefined or null
 * 4. Object.fromEntries(...) - converts the filtered array of entries back into an object
 * 
 * @param {Object} obj - The input object
 * @returns {Object} - A new object without undefined or null properties
 */
const removeUndefinedObject = (obj = {}) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
    );
}

/**
 * const a = {
 *  c: {
 *      d: undefined,
 *      e: 5
 *  },
 *  f: undefined,
 *  g: null,
 *  h: {
 *      i: 10,
 *      j: undefined
 *  }
 * 
 * db.collection.updateOne({`c.d`:1}, {$set: updateNestedObject(a)})`})
 */
const updateNestedObject = (obj) => {
    console.log('obj util', obj);
    const final = {};

    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObject(obj[key]);
            Object.keys(response).forEach(nestedKey => {
                final[`${key}.${nestedKey}`] = response[nestedKey];
            });
        } else {
            final[key] = obj[key];
        }
    });

    console.log('obj util 2', final);
    return final;
} 

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObject
}