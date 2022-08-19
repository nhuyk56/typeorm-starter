// https://www.youtube.com/watch?v=6l0Ij6S-Z-Q
// http://httpbin.org/get?answer=42
// curl https://api.myip.com -x http://[2001:19f0:4400:6493:5400:04ff:fe0b:3e77]:32022
import fs from 'fs'
import { axiosProxy, readDataFN, forceFunction, getGroupChapterpath, readDir, axiosNormal } from './src/utility/index'
const getSpeechAuth = async () => {
const res = {}
 const { data } = await axiosProxy.get('https://www.onenote.com/learningtools', { timeout: 5000 })
  const rawParams = data.match(/var (SessionId|Canary) = "(.*?)";/gm)
  if (rawParams?.length) {
    rawParams.forEach(rawParam => {
      const [p1, p2] = rawParam.split(' = ')
      if (p1?.includes('Canary')) res['x-key'] = p2.replace(/^"|";$/gm, '')
      if (p1?.includes('SessionId')) res['x-usersessionid'] = p2.replace(/^"|";$/gm, '')
    })
  }
  return res
}

const getContentModelForReader = async ({ headers, content }) => {
  const api = 'https://learningtools.onenote.com/learningtoolsapi/v2.0/GetContentModelForReader-Canary'
  const payload = {
    "data": {
      "title": "Immersive Reader",
      "chunks": [
        {
          "content": content,
          "lang": "vi-VN",
          "mimeType": "text/plain"
        }
      ]
    },
    "options": {
      "EnableLanguageDetection": true,
      "ReturnText": true,
      "ReturnWordSegments": true,
      "ReturnSentenceSegments": true,
      "ReturnPartsOfSpeech": false,
      "ReturnPronunciation": false,
      "ReturnVowelPhonemes": false,
      "ReturnSyllables": true,
      "ReturnLanguages": true,
      "ReturnReadabilityScore": true,
      "ReturnPictureDictionaryEntries": false,
      "UseDeclaredSegments": false,
      "ReturnPhrases": false,
      "PreserveStructure": false,
      "EnableSegmentation": true
    }
  }
  const { data } = await axiosProxy.post(api, payload, { headers, timeout: 10000 })
  const headerToken = data?.meta?.sessionToken && { authorization: `MS-SessionToken ${data?.meta?.sessionToken}` }
  const items = (data?.data || []).map(item => ({
    "t": item?.t,
    "lang": "vi-VN",
    "se": {
      "o": 0,
      "l": item?.t?.length
    },
    "wo": []
  }))
  return { headers: headerToken, items }
}

const GetSpeech = async ({ preferredVoice, sentenceModels, headers }) => {
  const api = 'https://learningtools.onenote.com/learningtoolsapi/v2.0/GetSpeech'
  const payload = {
    "data": { sentenceModels },
    "options": {
      "preferredVoice": preferredVoice || "Female",
      "extractWordMarkers": true,
      "encoding": "Mp3",
      "clientLabel": "ReadAloud",
      "useBrowserSpecifiedDialect": true
    }
  }
  const { data } = await axiosNormal.post(api, payload, { headers, timeout: 10000 })
  return data?.data?.sb.map(it => it?.ad?.replace('data:audio/mpeg;base64,', '')).join('\n')
}

const main = async () => {
  let axiosStoryInfo = await axiosNormal.get('https://raw.githubusercontent.com/nhuyk56/SyncStorage1/15cd37c3eeb0d96832cd3585da185d40/index.json')
  const storyInfo = axiosStoryInfo.data
  const chapters = storyInfo?.chapters || []
  let positionChapter = 0
  for (const chapter of chapters) {
    const logId = `${++positionChapter}/${chapters.length}`
    console.time(logId)
    console.timeLog(logId, 'INIT: select chapter', chapter?.name)

    console.timeLog(logId, 'STEP1: get auth')
    const speechAuth = await forceFunction(() => getSpeechAuth())
    console.timeLog(logId, 'STEP1: get auth [success]',speechAuth)

    console.timeLog(logId, 'STEP2', 'get content')
    const axiosChapter = await axiosNormal.get(chapter.contentPathRaw)
    const dataChapter = axiosChapter.data
    console.timeLog(logId, 'STEP2', 'get content [success]', `length: ${ dataChapter.length }`)

    console.timeLog(logId, 'STEP3', 'get content model forreader')
    const cmfr = await forceFunction(() => getContentModelForReader({ headers: speechAuth, content: dataChapter }))
    console.timeLog(logId, 'STEP3', 'get content model forreader [success]', `length: ${ cmfr.items?.length }`)

    let sentenceModels = [], length = 0
    let audio = 'data:audio/mpeg;base64,'
    let all = []
    for (let i = 0; i < cmfr?.items?.length; i++) {
      const item = cmfr.items[i]
      const nextLength = cmfr?.items[i + 1]?.t?.length || 0
      const isLast = i === cmfr?.items?.length - 1
      sentenceModels.push(item)
      length += item?.t?.length || 0
      if (isLast || length + nextLength > 2400) {
        all.push(forceFunction(() => GetSpeech(
          JSON.parse(
            JSON.stringify({
              preferredVoice: 'Male',
              sentenceModels,
              headers: cmfr.headers
            })
          )
        )))
        // console.table({ STEP3: i, itemsLength: sentenceModels.length, contentLength: length })
        sentenceModels = []
        length = 0
        console.timeLog(logId, 'STEP4', `${i+1}/${cmfr?.items?.length}`, `${all.length} (text parts prepare)`)
        if (isLast || all.length === 5) {
          console.timeLog(logId, 'STEP4', `${i+1}/${cmfr?.items?.length}`, `${all.length} (text parts comparing)`)
          const base64Arr = await Promise.all(all)
          console.timeLog(logId, 'STEP4', `${i+1}/${cmfr?.items?.length}`, `${all.length} text parts >> ${base64Arr.length} audio parts [success]`)
          audio += base64Arr.join('')
          all = []
        }
      }
    }
    fs.mkdirSync('D:/audios-beta/', { recursive: true })
    fs.writeFileSync(`D:/audios-beta/${positionChapter}.${chapter.id}.base64.txt`, audio)
    console.timeLog(logId, 'END')
    console.timeEnd(logId)
  }
}

main()