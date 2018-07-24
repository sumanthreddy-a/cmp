const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
const axios = require('axios')



const originsWhitelist = [
    '*'
];
const corsOptions = {
    origin: (origin, callback) => {
        const isWhitelisted = originsWhitelist.indexOf(origin) == -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}
//here is the magic
app.use(cors(corsOptions));
// app.options('*', cors()) 



const env = require('./env')
const mongoUri = env.mongoUrl;
mongoose.connect(mongoUri);
mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});


const beneficiary = require('./controllers/beneficiary')
const requests = require('./controllers/request')
const schemes = require('./controllers/scheme')
const request = require('request')

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

const newBeneficiary = new beneficiary()
const newRequests = new requests()
const newSchemes = new schemes()
app.post('/beneficiary', (req, res) => {
    newBeneficiary.createBeneficiarys(req, res)
})
app.get('/beneficiary', (req, res) => {
    newBeneficiary.getBeneficiarys(req, res)
})
app.post('/newrequest', (req, res) => {
    const options = {
        url: `${env.sawtoothClient}submit`,
        method: 'POST',
        json: true,
        body: req.body
    }
    request(options, async (error, response, body) => {
        if (body.success) {
            const resp = await axios({
                method: 'get',
                url: body.link
            })
            if (resp) {
                const secondResp = await axios({
                    method: 'get',
                    url: resp.data.link
                })
                req.body.transactionId = resp.data.data[0].id
                const requestOptions = {
                    url: `${env.dep2url}`,
                    method: 'POST',
                    json: true,
                    body: req.body
                }
                request(requestOptions, (error, response, requestBody) => {
                    if (requestBody.success) {
                        return res.json({
                            success: true,
                            message: "request posted successfully"
                        })
                    } else {
                        return res.json({
                            success: true,
                            message: "error"
                        })
                    }
                })
            } else {
                return res.json({
                    success: true,
                    message: "sawtooth client error"
                })
            }
        } else {
            return res.json({
                success: false
            })
        }
    })
})

app.put('/newrequest/:id', (req, res) => {
    const options = {
        url: `${env.sawtoothClient}submit`,
        method: 'POST',
        json: true,
        body: {
            reason: "for sync",
            what: "112",
            whom: "d1",
            who:"d2"
        }
    }
    request(options, async (error, response, body) => {
        if (body.success) {
            const resp = await axios({
                method: 'get',
                url: body.link
            })
            if (resp) {
                const secondResp = await axios({
                    method: 'get',
                    url: resp.data.link
                })
                req.body.transactionId = resp.data.data[0].id
                const requestOptions = {
                    url: `${env.dep2url}/${req.params.id}`,
                    method: 'PUT',
                    json: true,
                    body: req.body
                }
                request(requestOptions, (error, response, requestBody) => {
                    if (requestBody.success) {
                        return res.json({
                            success: true,
                            message: "request updated successfully"
                        })
                    } else {
                        return res.json({
                            success: false,
                            message: "error"
                        })
                    }
                })
            } else {
                return res.json({
                    success: true,
                    message: "sawtooth client error"
                })
            }
        } else {
            return res.json({
                success: false
            })
        }
    })
})
app.post('/request', (req, res) => {
    newRequests.createRequest(req, res)
})
app.get('/newrequest', (req, res) => {
    newRequests.getRequests(req, res)
})
app.put('/request/:id', (req, res) => {
    newRequests.updateRequest(req, res)
})
app.get('/schemes', (req, res) => {
    newSchemes.getSchemas(req, res)
})


app.listen(env.port, () => {
    console.log(`am running in ${env.port}`)
})