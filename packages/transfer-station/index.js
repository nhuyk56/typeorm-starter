const express = require('express')
var bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const baggages = {
  /** [type]: array baggage */
}

const sendBaggage = (option) => {
  for (const bagType in option) {
    if (!Array.isArray(baggages[bagType])) {
      baggages[bagType] = []
    }
    baggages[bagType].push(option[bagType])
  }
  return {
    mesage: 'sendBaggage success'
  }
}

const takeBaggage = (option) => {
  for (const bagType in option) {
    if (!Array.isArray(baggages[bagType])) {
      baggages[bagType] = []
    }
    const isFound = baggages[bagType].some(baggage => baggage === option[bagType])
    baggages[bagType] = baggages[bagType].filter(baggage => baggage !== option[bagType])
    return {
      isFound,
      remaining: {
        items: baggages[bagType],
        length: baggages[bagType].length
      }
    }
  }
}

app.get('/send-baggage', function(req, res) {
  console.log('baggages', baggages)
  const query = req.query
  const bagType = query["bag-type"]
  const bagValue = query["bag-value"]
  if (bagType && bagValue) {
    const r = sendBaggage({ [bagType]: bagValue })
    console.log(`send baggage success ${JSON.stringify(req.query)}`)
    res.send(r)
    return
  } else {
    res.send(`send baggage failed ${JSON.stringify(req.query)}`)
  }
 })

 app.get('/take-baggage', function(req, res) {
  console.log('baggages', baggages)
  const query = req.query
  const bagType = query["bag-type"]
  const bagValue = query["bag-value"]
  if (bagType && bagValue) {
    const r = takeBaggage({ [bagType]: bagValue })
    console.log(`take baggage success ${JSON.stringify(req.query)}`)
    res.send(r)
  } else {
    res.send(`take baggage failed ${JSON.stringify(req.query)}`)
  }
 })

 app.post('/group-and-index', function(req, res) {
  // { key: '' manifestPath: '', story: '', chapter: '', max: '', all }
  const payload = req.body
  if (!payload.key) return false
  const GK = `group-${payload.key}`
  const GFD = `group-${payload.key}-FN`
  if (!baggages[GFD]) baggages[GFD] = `${new Date().getTime()}-${GFD.length + (payload?.chapter?.name?.length || 0 )}.json`
  if (!baggages[GK]) baggages[GK] = []
  if (payload.all) {
    const group = JSON.parse(JSON.stringify(baggages[GK]))
    baggages[GFD] = null
    baggages[GK] = []
    res.send(group)
    return /** exit */
  }

  /** inject localFolder */
  payload.groupFN = baggages[GFD]
  baggages[GK].push(payload)
  if (baggages[GK].length >= payload.max) {
    console.log(`${payload.key}:[${baggages[GK].length}]: ${baggages[GFD]} `)
    const groupFN = baggages[GFD]
    baggages[GFD] = null
    const group = JSON.parse(JSON.stringify(baggages[GK]))
    baggages[GK] = []
    res.send({ groupFN, group })
  } else {
    console.log(`${payload.key}:[${baggages[GK].length}]: ${baggages[GFD]} `)
    res.send(baggages[GFD])
  }
 })

app.listen(2020)