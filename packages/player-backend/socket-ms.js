const { SocksProxyAgent } = require('socks-proxy-agent');
const ws = new require('ws')
const fs = require('fs')

const wssURL = 'wss://eastus.api.speech.microsoft.com/cognitiveservices/websocket/v1'
let socket = new ws(wssURL, [], {
  headers: {
    Host: 'eastus.api.speech.microsoft.com',
    Origin: 'https://azure.microsoft.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  }
})

socket.on('open', () => {
  console.log('connection success')
  setTimeout(() => {
    socket.send(JSON.stringify(
      {
        "context": {
          "system": {
            "name": "SpeechSDK",
            "version": "1.19.0",
            "build": "JavaScript",
            "lang": "JavaScript"
          },
          "os": {
            "platform": "Browser/Win32",
            "name": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            "version": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
          }
        }
      }
    ))
  }, 100)

  // setTimeout(() => {
  //   socket.send(JSON.stringify(candiate))
  // }, 200)

  // setTimeout(() => {
  //   socket.send(JSON.stringify(candiate))
  // }, 300)
})

socket.on('close', (e) => {
  console.log('connection end', e)
})

socket.on('message', message => {})
