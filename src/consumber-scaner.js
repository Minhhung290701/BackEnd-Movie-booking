const glob = require('glob')

module.exports = () => {
    const pattern = `${__dirname}/routes/*/*rpc.consumer.js`
    // load routes
    return new Promise((resolve, reject) => {
        glob(
            pattern,
            async (err, matches) => {
                if (err) {
                    reject(err)
                }

                for (let i = 0; i < matches.length; i += 1) {
                    const file = matches[i]
                    require(file) // eslint-disable-line global-require
                }

                resolve()
            },
        )
    })
}
