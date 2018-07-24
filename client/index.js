const {
  EnclaveFactory
} = require('./enclave')
const {
  SawtoothClientFactory
} = require('./sawtooth-client')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

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
const input = require('./input')
const FAMILY_NAME = 'tmp'
const VERSION = '1.0'
const API_URL = 'http://localhost:8008'
const createTransactor = (privateKey) => {

  const enclave = EnclaveFactory(Buffer.from(privateKey, 'hex'))
  const client = SawtoothClientFactory({
    enclave: enclave,
    restApiUrl: API_URL
  })

  return client.newTransactor({
    familyName: FAMILY_NAME,
    familyVersion: VERSION
  })
}


app.post('/submit', (req, res) => {
  let privateKey = "6a6e21e2793a10d930c689a9b63045f15ac55efd50ce4b2faf52f657428814c8"
  input.submitPayload(req.body, createTransactor(privateKey)).then((result) => {
    return res.json({
      success:true,
      link:result.data.link
    })
  }).catch((Err) => {
   return res.json({
     success:false,
     data:err
   })
  })
})

/* get blocks */
const axios = require('axios')
app.get('/blocks', async (req, res) => {
  const resp = await axios({
    method: 'get',
    //baseURL: factoryOptions.restApiUrl,
    url: 'http://localhost:8008/blocks',
    // headers: { 'Content-Type': 'application/octet-stream' },
    // data: batchListBytes
  })
  console.log(resp.data)
  if (resp) {
    res.json(resp.data)
  } else {
    res.json({
      success: false
    })
  }
})

/* get state of the block */
app.listen(5000, () => {
  console.log("5000 port")
})