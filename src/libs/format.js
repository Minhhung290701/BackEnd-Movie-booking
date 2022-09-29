/**
 * @fileoverview Module hỗ trợ format dữ liệu.
 *
 * @module libs/format
 */
 const ObjectId = require('mongoose').Types.ObjectId

 /**
  * Move data form key name as id to key name as object. It's used for populating case. ex: move value from createdById to createdBy
  * @param {Object} obj it's target object
  * @param {string} key the key will be transform to object
  * @param {string} newKey replace key to new key, if newKey is null then auto generate new key is key.replace('Id', '')
  * @param {Boolean} [keepId=false] if keepId is true then keep id (key) and obj[key] = obj[newKey]._id || obj[newKey].id
  * @returns {Object} transformed object
  */
 exports.populate = (obj, key, newKey, keepId = false) => {
     if (!obj) {
         return obj
     }
 
     const value = obj[key]
     if (value && typeof value === 'object' && !(value instanceof ObjectId)) {
         let replaceKey
         if (newKey) {
             replaceKey = newKey
         } else {
             replaceKey = key.replace('Id', '')
         }
 
         obj[replaceKey] = value
 
         if (!keepId) {
             delete obj[key]
         } else {
             obj[key] = value._id || value.id
         }
     }
 
     return obj
 }
 
 /**
  * Move data form key name as id to key name as object. It's used for populating case. ex: move value from createdById to createdBy
  * @param {Object} obj it's target Object
  * @param {string} key the key will be transform to object
  * @param {string} newKey replace key to new key, if newKey is null then auto generate new key is key.replace('Id', '')
  * @param {Boolean} [keepId=false] if keepId is true then keep id (key) and obj[key] = obj[newKey]._id || obj[newKey].id
  * @returns {Object} transformed object
  */
 exports.populateArray = (obj, key, newKey, formatter, keepId = false) => {
     
     const arr = obj[key]
 
     if (!Array.isArray(arr)) {
         return arr
     }
 
     if (arr[0] && typeof arr[0] === 'object' && !(arr[0] instanceof ObjectId)) {
         arr.forEach((e, i) => (arr[i] = formatter(e)))
     }
 
     obj[newKey] = arr
 
     if (!keepId) {
         delete obj[key]
     }
 
     return obj
 }
 