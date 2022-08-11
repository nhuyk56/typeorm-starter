import {
  readDataFN,
  getGroupChapterpath,
  upFolder2Git,
  getErrorPath,
  readDir,
  getChapterGitPath,
  setChapterGitData,
  getHash,
  isDeleteFN,
  getGroupFD,
  axiosProxy,
  forceFunction
} from './utility/index'

import fs from 'fs'
const args = require('args-parser')(process.argv)
console.log('args', args)

// inject env
Object.keys(args).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = args[k]
  }
})

const t2s = async ({ text, groupFNPath, chapterFN }) => {
  console.log('[start] t2s', chapterFN)
  const sentenceModels = text.split('\n').filter(s => s).map(t => ({ t, lang: "vi-VN", "se": { o: 0, l: t.length }, "wo": [] }))
  const payload = { data: { sentenceModels }, options: { preferredVoice: 'Female', encoding: 'Mp3' } }

  fs.writeFileSync(`${groupFNPath}/${chapterFN}.payload.txt`, JSON.stringify(payload))
  console.log(`${groupFNPath}/${chapterFN}.payload.txt`)
  const { data } = await forceFunction(() => axiosProxy.post('https://learningtools.onenote.com/learningtoolsapi/v2.0/GetSpeech', { data: { sentenceModels }, options: { preferredVoice: 'Female', encoding: 'Mp3' } }, {
      headers: {
        "authorization": "MS-SessionToken eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwMjIwMjA3IiwidHlwIjoiSldUIn0.eyJBcHBJZCI6IkxlYXJuaW5nVG9vbHMtTGFuZGluZ1BhZ2UtVHJ5SXROb3ciLCJUb2tlblR5cGUiOiJDb2dTdmNzIiwiRWR1IjoiRmFsc2UiLCJDb2dTdmNzUmVnaW9uIjoiQVBJTSIsIkNvZ1N2Y3NTdWJzY3JpcHRpb25JZCI6IjMzNzllZjdlZmNhOTRkOThhYmQ2NTQ1YjZiYjdjN2QwIiwiQ29nU3Zjc1Byb2R1Y3RJZCI6IkltbWVyc2l2ZVJlYWRlci5TMSIsIkNvZ1N2Y3NBenVyZVJlc291cmNlSWQiOiIvc3Vic2NyaXB0aW9ucy81ODUxY2RkNC1hNWExLTQ5MjgtYjlhZi1jNjY0ZWRhMDcyZjEvcmVzb3VyY2VHcm91cHMvSW1tZXJzaXZlUmVhZGVyUmVsYXlSZXNvdXJjZXMvcHJvdmlkZXJzL01pY3Jvc29mdC5Db2duaXRpdmVTZXJ2aWNlcy9hY2NvdW50cy9Pc2lJbW1lcnNpdmVSZWFkZXJSZWxheS1BdXN0cmFsaWFFYXN0IiwiVmVyc2lvbiI6IlYxIiwiU2Vzc2lvbklkIjoiMDkyNDYxZjktMDI3MC00YmZmLWE3ZDItOTViNWVjM2RkMTE4IiwibmJmIjoxNjYwMjE5MjU5LCJleHAiOjE2NjAzOTIwNTksImlhdCI6MTY2MDIxOTI1OSwiaXNzIjoiaHR0cHM6Ly9pbW1lcnNpdmVyZWFkZXIubWljcm9zb2Z0LmNvbSIsImF1ZCI6InVybjptcy5pbW1lcnNpdmVyZWFkZXIifQ.bkLsFuOsYkidO3KzToWAkOqMTOYtGFJy4_0_6Zqje8roec7ntZ7dNIHFIVhjd-Fah29duoMJ8YGpDQjbCsxIB-C5DsoOEoa7te5bGybdufMrEfBTJzcP7VAXDu1tu2L_uMFUJUswwIw1pFEumaW5gtILDUGIgyrml6_RjgJITpQD3F0NBpV38Kyq_qp8tic3AVvcuL44eWTlHiRPCS0NlYtfihRKZq3Ej6oQaTk8E-2hDQIZoeNUzQgq_5P3wRb7usWqbb5NHYUvejFadXqooP53VFXvDg2h6natmKPMl0i-C_rCqQIGyZmxXt3Z3mMzrRmHcPnMFxiOX66lPaBSDw",
        "Content-Type": "application/json"
      }
    })
  )
  console.log('t2s', chapterFN, 'sentenceModels', sentenceModels.length)
  console.log('t2s', chapterFN, 'data?.data?.sb?', data?.data?.sb?.length)
  const mp3B64 = 'data:audio/mpeg;base64,' + data?.data?.sb?.map(s => s?.ad?.replace('data:audio/mpeg;base64,', '\n') || '').join('')
  fs.writeFileSync(`${groupFNPath}/${chapterFN}.txt`, mp3B64)
  console.log('[end] t2s', chapterFN)
}

const init = async () => {
  if (!args.gfn) throw new Error('MISSING gfn option')
  const groupFN = args.gfn?.split('.')?.shift()
  const groupFNPath = getGroupChapterpath({ groupFN })
  const chaptersInFolder = readDir(groupFNPath)
  let items = []
  for (const chapterFN of chaptersInFolder) {
    const ccp = getGroupFD({ groupFD: groupFN, chapterFN })
    const ccd = readDataFN(ccp)
    await t2s({ text: ccd, groupFNPath, chapterFN })
    // items.push(t2s({ text: ccd, groupFNPath, chapterFN }))
    // if (items.length === 100) {
    //   await Promise.all(items)
    //   items = []
    // }
  }
  if (items.length) {
    await Promise.all(items)
    items = []
  }
}

init()
// npm run chapter:git:main gfn=1657884429324-50.json gitSSH=git@github.com----nhuyk56:nhuyk56/SyncStorage1.git