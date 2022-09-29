const { sentenceCase, pascalCase, camelCase } = require('change-case')

exports.resource = function (resource) {
    if (typeof resource !== 'object') {
        throw new Error('resource must be an object')
    }

    const permissions = []
    const { no, name } = resource

    if (!no || !name) {
        throw new Error('resource is not configured')
    }

    function pushPermission(suffixNo, action, permissionName) {
        permissions.push({
            no: `${no}.${suffixNo}`,
            code: `${action}${name}`,
            name: sentenceCase(permissionName || `${action}${name}`),
        })
    }

    return {
        create: function (customName) {
            pushPermission('01', 'create', customName)
            return this
        },
        update: function (customName) {
            pushPermission('02', 'update', customName)
            return this
        },
        viewDetailsOf: function (customName) {
            pushPermission('03', 'viewDetailsOf', customName)
            return this
        },
        delete: function (customName) {
            pushPermission('04', 'delete', customName)
            return this
        },
        list: function (customName) {
            pushPermission('05', 'list', customName)
            return this
        },
        updateMy: function (customName) {
            pushPermission('06', 'updateMy', customName)
            return this
        },
        viewDetailsOfMy: function (customName) {
            pushPermission('07', 'viewDetailsOfMy', customName)
            return this
        },
        deleteMy: function (customName) {
            pushPermission('08', 'deleteMy', customName)
            return this
        },
        listMy: function (customName) {
            pushPermission('09', 'listMy', customName)
            return this
        },
        /**
         *
         * @param {Array<Object>} newPermissions array of objects {actionCode: String, actionName: String}
         *
         * - actionCode: sub number which is suffix of no. actionName must contains 2 characters and greater than 19. ex: actionCode = '20' -> no = '01.20'
         * - actionName: action name must be a verb. It's prefix of permission code & name
         */
        customPermissions: function (newPermissions) {
            if (!Array.isArray(newPermissions)) {
                throw new Error('Custom permissions must be an Array')
            }

            newPermissions.forEach(({ actionCode, actionName }) => {
                if (!actionCode) {
                    throw new Error('subNo is required while adding custom permissions')
                }

                if (
                    typeof actionCode !== 'string' ||
                    actionCode.length !== 2 ||
                    isNaN(actionCode)
                ) {
                    throw new Error('subNo must be string in format 00')
                }

                const permissionNo = `${no}.${actionCode}`
                if (permissions.find(e => e.no === no)) {
                    throw new Error(`permission no '${no}' is existed`)
                }

                if (!actionName) {
                    throw new Error('subNo is required while adding custom permissions')
                }
                const fixedActionName = pascalCase(actionName)
                permissions.push({
                    no: permissionNo,
                    code: camelCase(`${fixedActionName}${name}`),
                    name: sentenceCase(`${fixedActionName}${name}`),
                })
            })

            return this
        },
        done: function () {
            return permissions
        },
    }
}
