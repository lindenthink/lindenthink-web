const rules = require('./rules');
const plugins = require('./plugins')

module.exports = {
    plugins : plugins.values,
    rules: rules.values
}
