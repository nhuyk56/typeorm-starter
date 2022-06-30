const express = require('express')
const app = express()

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

app.listen(3000)