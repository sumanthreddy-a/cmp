const RequestSchema = require('../models/request')
const crypto = require('crypto');

class Request {

    /* get all request */
    async getRequests(req, res) {
        try {
            const all_requests = await RequestSchema.find()
            if (all_requests) {
                return res.json({
                    success: true,
                    data: all_requests
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

    /* post request  */
    async createRequest(req, res) {
        try {
            const reqObj = req.body
            reqObj.status = `pending`
            const str = `${reqObj.whom}${reqObj.what}${reqObj.status}`
            const generatedCheckSum = crypto.createHash('md5').update(str).digest("hex")
            reqObj.hash = generatedCheckSum
            const newRequestschema = new RequestSchema(reqObj)
            const requestSchemas = await newRequestschema.save()
            if (requestSchemas) {
                return res.json({
                    success: true,
                    data: requestSchemas
                })
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

    /* update request */
    async updateRequest(req, res) {
        try {
            RequestSchema.updateOne({
                what: req.params.id
            }, {
                status: req.body.status
            }).then((data)=>{
                return res.json({
                    success: true
                })
            }).catch((e)=>{
                return res.json({
                    success: false
                })
            })
            // const updated =updateRequest()
            // if (updated) {
            //     console.log(updated)
                
            // } else {
                
            // }
        } catch (e) {
            return res.json({
                success: false,
                data: null
            })
        }



    }

}

module.exports = Request