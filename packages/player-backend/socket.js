const { SocksProxyAgent } = require('socks-proxy-agent');
const ws = new require('ws')

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

socket.on('message', message => {
  const item = JSON.parse(message)
  if(item.command !== 'receive_text') delete item.data
  console.log(item)
  if (message.includes('authen_success')) {
    socket.send(JSON.stringify({
      "command": "add_job_listen",
      "voice": 0,
      "novel_slug": "tu-huyen-lenh-bat-dau-danh-dau-sinh-hoat",
      "id": 66121316,
      "chapter_number": "Mz",
      "language": "vi"
    }))
  }
})

socket.on('close', () => console.log('connection end'))
socket.on('open', () => console.log('connection success'))