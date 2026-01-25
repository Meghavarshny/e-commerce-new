// Utility to pick only allowed fields
const pickFields = (obj, fields) => {
  return fields.reduce((output, field) => {
    if (obj[field] !== undefined) output[field] = obj[field];
    return output;
  }, {});
};

module.exports = pickFields;
