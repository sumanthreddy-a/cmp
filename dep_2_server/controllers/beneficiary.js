const beneficiary = require('../models/beneficiary')
const schema = require('./scheme')
const crypto = require('crypto');


class Beneficiary extends schema {

    /* get Beneficiarys */
    async getBeneficiarys(req, res) {
        try {
            const allBeneficiarys = await beneficiary.find().populate('Scheme')

            if (allBeneficiarys) {
                return res.json({
                    success: true,
                    data: allBeneficiarys
                })
            } else {
                return res.json({
                    success: false,
                    data: allBeneficiarys
                })
            }
        } catch (e) {
            return res.json({
                success: false,
                data: null
            })
        }
    }

    /* create Beneficiarys */
    async createBeneficiarys(req, res) {
        try {
            const reqObj = req.body
            const str = `${reqObj.name}${reqObj.adhar}${reqObj.gender}${reqObj.age}${reqObj.address}${reqObj.district}`;
            const generatedCheckSum = crypto.createHash('md5').update(str).digest("hex");
            reqObj.hash = generatedCheckSum
            const newBeneficiary = new beneficiary(reqObj)
            const beneficiarys = await newBeneficiary.save()
            if (beneficiarys) {
                if (reqObj.schema) {
                    // console.log(reqObj.schema)
                    const parse = reqObj.schema
                    parse.beneficiary = beneficiarys._id
                    const newSchema = await this.createScheme(parse)
                    if (newSchema) {
                        return res.json({
                            success: true,
                            data: beneficiarys
                        })
                    } else {
                        return res.json({
                            success: false,
                            data: beneficiarys,
                            message: `only beneficiarys added`
                        })
                    }
                } else {
                    return res.json({
                        success: true,
                        data: beneficiarys
                    })
                }

            } else {
                return res.json({
                    success: false,
                    data: null
                })
            }
        } catch (e) {
            console.log(e)
            return res.json({
                success: false,
                data: null
            })
        }
    }

}

module.exports = Beneficiary