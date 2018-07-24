const schemes = require('../models/scheme')
const crypto = require('crypto')

class Scheme {

    /* get schema */
    async getSchemas(req,res) {
        try {
            const all_schemas = await schemes.find().populate('beneficiary')
            if (all_schemas) {
                return res.json({
                    success: true,
                    data: all_schemas
                })
            } else {
                return res.json({
                    success: false,
                    data: null
                })
            }

        } catch (e) {
            return res.json({
                success: false,
                data: null
            })
        }
    }
    /* create Scheme */
    async createScheme(data) {
        try {
            const reqObj = data
            reqObj.status = `new`
            const str = `${data.name}${data.amount}${data.status}${data.beneficiary}`
            const generatedCheckSum = crypto.createHash('md5').update(str).digest("hex")
            reqObj.hash = generatedCheckSum
            const newScheme = new schemes(reqObj)
            const scheme = await newScheme.save()
            if (scheme) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }


    }
}

module.exports = Scheme