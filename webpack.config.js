module.exports = {
    context: __dirname,

    entry: {
        app: './resources/js/common'
    },

    output: {
        path: __dirname + '/dist/js',
        filename: '[name].js'
    },
};