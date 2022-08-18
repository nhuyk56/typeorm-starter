const { SocksProxyAgent } = require('socks-proxy-agent');
const ws = new require('ws')
const fs = require('fs')

const proxyOptions = `socks5://45.77.250.86:9050`;
const agent = new SocksProxyAgent(proxyOptions);
let socket = new ws('wss://ws019.qidianaudio.com/?language=vi', [], {
  httpAgent: agent,
  httpsAgent: agent,
  agent,
  headers: {
    Origin: 'https://truyenaudiocv.net'
  }
})

const audioCTN = { items: [] }
console.time('startTime')
socket.on('message', message => {
  const item = JSON.parse(message)
  if(item.command === 'wait_for_audio' && item.data) {
    audioCTN.items = Array.from({ length: item.data }, () => {})
    audioCTN.fLength = item.data
    audioCTN.cLength = 0
  }
  if(item.command === 'sent_audio') {
    console.log(`[status] ${++audioCTN.cLength}/${audioCTN.fLength}`, `${item.command}: ${item.status}`)
    audioCTN.items[item.index] = item.data
    if (audioCTN.fLength === audioCTN.cLength) {
      const audioContent = 'data:audio/mpeg;base64,' + audioCTN.items.join('')
      fs.writeFileSync('./mp3.txt', audioContent, {encoding: "utf8"})
    }
  } else console.log(`${item.command}: ${item.status}`)

  if (message.includes('authen_success')) {
    socket.send(JSON.stringify({
      "command": "add_job_listen",
      "voice": 0,
      "novel_slug": "ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi",
      "id": 67096523,
      "chapter_number": "MzQ2NzYyNDUAAA",
      "language": "vi"
    }))
  }
})

socket.on('open', () => console.log('connection success'))
socket.on('close', () => {
  console.log('connection end')
  console.timeEnd('startTime')
})