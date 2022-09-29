const Joi = require('@hapi/joi')

const regex_path = /(\/[a-z]+\/[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}){2}\/(high\/){0,1}[a-z0-9-._~!$&'()*+,;=:@%A-Z]+$/
const suffix_path =
    "[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}){1}/(high/){0,1}[a-z0-9-._~!$&'()*+,;=:@%A-Z]+$"
/**
 *  Joi.number().min(-900719925474099).max(900719925474099)
 */
const latlng = () => Joi.number().min(-900719925474099).max(900719925474099)

/**
 * Joi.string().pattern(regex_path)
 */
const mediaPath = () => Joi.string().pattern(regex_path)

/**
 * Joi.string().guid({ version: ['uuidv4'] })
 */
const uuidv4 = () => Joi.string().guid({ version: ['uuidv4'] })

/**
 * Joi.string().guid()
 */
const uuid = () => Joi.string().guid()

/**
 * new RegExp(`(\\/${source_type}s\\/${source_id})(/${sub || '[a-z]*'}s/${suffix_path}`)
 */
const validatePrefixPath = (source_type, source_id, sub) =>
    new RegExp(`(\\/${source_type}s\\/${source_id})(/${sub || '[a-z]*'}s/${suffix_path}`)

module.exports = {
    latlng,
    uuidv4,
    uuid,
    mediaPath,
    validatePrefixPath,
}
