const {
  TransactionHandler
} = require('sawtooth-sdk/processor/handler')
const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')
const crypto = require('crypto')

const _hash = (x) =>
  crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

// Constants defined in smartbank specification
const MIN_VALUE = 0
const MAX_VALUE = 4294967295
const MAX_NAME_LENGTH = 20
const TP_FAMILY = 'tmp'
const TP_NAMESPACE = _hash(TP_FAMILY).substring(0, 6)
const TP_VERSION = '1.0'

const _decodeCbor = (buffer) =>
  new Promise((resolve, reject) =>
    cbor.decodeFirst(buffer, (err, obj) => (err ? reject(err) : resolve(obj)))
  )

const _toInternalError = (err) => {
  let message = (err.message) ? err.message : err
  throw new InternalError(message)
}

const _setEntry = (context, address, stateValue) => {
  let entries = {
    [address]: cbor.encode(stateValue)
  }
  return context.setState(entries)
}

const _applySet = (context, address, name, value) => (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  let stateValue
  if (stateValueRep && stateValueRep.length > 0) {
    stateValue = cbor.decodeFirstSync(stateValueRep)
    let stateName = stateValue[name]
    // console.log(stateName,"second")
    // if (stateName) {
    //   throw new InvalidTransaction(
    //     `Id is "set" but Name already in state, Name: ${name} Value: ${stateName}`
    //   )
    // }
  }

  // 'set' passes checks so store it in the state
  if (!stateValue) {
    stateValue = {}
  }

  stateValue[name] = value

  return _setEntry(context, address, stateValue)
}

const _applyOperator = (verb, op) => (context, address, name, value) => (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  if (!stateValueRep || stateValueRep.length === 0) {
    throw new InvalidTransaction(`Verb is "${verb}" but Name is not in state`)
  }

  let stateValue = cbor.decodeFirstSync(stateValueRep)
  if (stateValue[name] === null || stateValue[name] === undefined) {
    throw new InvalidTransaction(`Verb is "${verb}" but Name is not in state`)
  }

  const result = op(stateValue[name], value)

  if (result < MIN_VALUE) {
    throw new InvalidTransaction(
      `Verb is "${verb}", but result would be less than ${MIN_VALUE}`
    )
  }

  if (result > MAX_VALUE) {
    throw new InvalidTransaction(
      `Verb is "${verb}", but result would be greater than ${MAX_VALUE}`
    )
  }

  // Increment the value in state by value
  // stateValue[name] = op(stateValue[name], value)
  stateValue[name] = result
  return _setEntry(context, address, stateValue)
}

const _applyInc = _applyOperator('inc', (x, y) => x + y)
const _applyDec = _applyOperator('dec', (x, y) => x - y)

class IntegerKeyHandler extends TransactionHandler {
  constructor() {
    super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
  }

  apply(transactionProcessRequest, context) {

    return _decodeCbor(transactionProcessRequest.payload)
      .catch(_toInternalError)
      .then((update) => {
        //
        // Validate the update
        let whom = update.whom
        if (!whom) {
          throw new InvalidTransaction('whom is required')
        }

        // if (name.length > MAX_NAME_LENGTH) {
        //   throw new InvalidTransaction(
        //     `Name must be a string of no more than ${MAX_NAME_LENGTH} characters`
        //   )
        // }

        let what = update.what
        if (!what) {
          throw new InvalidTransaction('what is required')
        }

        // let when = update.when
        // if (when === null || when === undefined) {
        //   throw new InvalidTransaction('when is required')
        // }

        let who = update.who
        if (who === null || who === undefined) {
          throw new InvalidTransaction('who is required')
        }

        let reason = update.reason
        if (reason === null || reason === undefined) {
          throw new InvalidTransaction('reason is required')
        }

        // let parsed = parseInt(mobile)
        // if (parsed !== mobile || parsed < MIN_VALUE || parsed > MAX_VALUE) {
        //   throw new InvalidTransaction(
        //     `mobile must be an integer ` +
        //     `no less than ${MIN_VALUE} and ` +
        //     `no greater than ${MAX_VALUE}`)
        // }

        // mobile = parsed

        // Determine the action to apply based on the verb
        let actionFn = _applySet
        // if (verb === 'set') {
        //   actionFn = _applySet
        // } else if (verb === 'dec') {
        //   actionFn = _applyDec
        // } else if (verb === 'inc') {
        //   actionFn = _applyInc
        // } else {
        //   throw new InvalidTransaction(`Didn't recognize Verb "${verb}".\nMust be "set", "inc", or "dec"`)
        // }

        let address = TP_NAMESPACE + _hash(what).slice(-64)

        // Get the current state, for the key's address:
        let getPromise = context.getState([address])

        // Apply the action to the promise's result:
        let actionPromise = getPromise.then(
          actionFn(context, address, what, whom, who, reason)
        )

        // Validate that the action promise results in the correctly set address:
        return actionPromise.then(addresses => {
          if (addresses.length === 0) {
            throw new InternalError('State error!')
          }
          console.log(`reason: ${reason}\nwhat: ${what}\nwhom: ${whom}`)
        })
      })
  }
}

module.exports = IntegerKeyHandler