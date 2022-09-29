const glob = require('glob')

const permissions = []
const permissionCodes = []

exports.load = () => {
    // load permission
    return new Promise((resolve, reject) => {
        glob(
            `${__dirname}/../routes/*/**/permission.js`,
            // { ignore: '**/auth/*endpoint.js' },
            async (err, matches) => {
                if (err) {
                    reject(err)
                }

                for (let i = 0; i < matches.length; i += 1) {
                    const file = matches[i]
                    const apartOfPermissions = require(file) // eslint-disable-line global-require
                    permissions.push(...apartOfPermissions)
                }

                permissions.sort((a, b) => {
                    return a.no > b.no ? 1 : -1
                })

                permissionCodes.push(...permissions.map(e => e.code))

                resolve(permissions)
            },
        )
    })
}

exports.permissions = permissions
exports.permissionCodes = permissionCodes

/**
 * Danh sách resource.
 * Lưu ý: tên resource phải viết theo kiểu PascalCase - viết hoa các chữ cái đầu của mỗi từ và ở dạng số ít.
 */
const listResources = [
    // user
    'Account',
    'Profile',
]

const resources = {}
listResources.forEach(
    (name, idx) => (resources[name] = { no: ('0' + (idx + 1)).slice(-2), name: name }),
)

exports.resources = resources
