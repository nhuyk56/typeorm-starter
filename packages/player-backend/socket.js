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

const items = [{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67096523,"chapter_number":"MzQ2NzYyNDUAAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151199,"chapter_number":"MzQ2Nza1NLQEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151200,"chapter_number":"MzQ2Nza1NDUGAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151201,"chapter_number":"MzQ2Nza1tDQHAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151202,"chapter_number":"MzQ2NzYzMDUAAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151203,"chapter_number":"MzQ2NzYzMLUEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151204,"chapter_number":"MzQ2NzYzMDMHAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151205,"chapter_number":"MzQ2NzYzMDcGAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151206,"chapter_number":"MzQ2NzYzsDQEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151207,"chapter_number":"MzQ2NzYzsLQEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151208,"chapter_number":"MzQ2NzYzNDADAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151209,"chapter_number":"MzQ2NzYzNTQFAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151210,"chapter_number":"MzQ2NzYztTAFAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151211,"chapter_number":"MzQ2NzYzMzEDAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151212,"chapter_number":"MzQ2NzazMDIBAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151213,"chapter_number":"MzQ2NzazMDIFAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151214,"chapter_number":"MzQ2NzazMDIDAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151215,"chapter_number":"MzQ2NzazNLUAAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151216,"chapter_number":"MzQ2NzazNLUEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151217,"chapter_number":"MzQ2NzazNDMAAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151218,"chapter_number":"MzQ2NzazNDMEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151219,"chapter_number":"MzQ2NzazNDMCAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151220,"chapter_number":"MzQ2NzazNDMGAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151221,"chapter_number":"MzQ2NzY3sDADAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151222,"chapter_number":"MzQ2NzY3sDAHAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151223,"chapter_number":"MzQ2NzY3sLAAAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151224,"chapter_number":"MzQ2NzY3sLAEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151225,"chapter_number":"MzQ2NzY3sDQAAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151226,"chapter_number":"MzQ2NzY3sDQEAA","language":"vi"},{"command":"add_job_listen","voice":0,"novel_slug":"ta-chi-muon-an-tinh-lam-cau-dao-ben-trong-nguoi","id":67151227,"chapter_number":"MzQ2NzY3NLEAAA","language":"vi"}]
const passed = {}

const audioCTN = { items: [], status: -1 }

console.time('startTime')
socket.on('message', message => {
  const index = Object.keys(passed).length
  const item = JSON.parse(message)
  if(item.command === 'wait_for_audio' && item.data) {
    audioCTN.items = Array.from({ length: item.data }, () => {})
    audioCTN.fLength = item.data
    audioCTN.cLength = 0
  }
  if(item.command === 'sent_audio') {
    console.log(`[${index}/${items.length}][status] ${++audioCTN.cLength}/${audioCTN.fLength}`, `${item.command}: ${item.status}`)
    audioCTN.items[item.index] = item.data
    if (audioCTN.fLength === audioCTN.cLength) {
      const audioContent = 'data:audio/mpeg;base64,' + audioCTN.items.join('')
      const fileName = `./mp3.${index}.txt`
      fs.writeFileSync(fileName, audioContent, { encoding: "utf8" })
      audioCTN.status = 0
      console.timeEnd(`item-${index}`)
    }
  } else console.log(`[${index}/${items.length}]${item.command}: ${item.status}`)
  // if (item.command === 'receive_text') console.log(item.data)
  if (audioCTN.status === 0) {
    const candiate = items.find(c => !passed[String(c.id)])
    if (candiate) {
      console.time(`item-${index + 1}`)
      const id = String(candiate.id)
      passed[id] = candiate
      socket.send(JSON.stringify(candiate))
      audioCTN.status = 1
    }
  }
})

socket.on('open', () => {
  console.log('connection success')
  audioCTN.status = 0
  audioCTN.items = []
})
socket.on('close', () => {
  audioCTN.status = -1
  console.log('connection end')
})