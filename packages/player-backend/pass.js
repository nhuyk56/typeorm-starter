const axios = require('axios')
const moment = require('moment')
const cookie = [
  "access-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVkMTlhNWFhLThmNzYtNDUzMC04ODgxLWYzYzA3MzM5ODdlYSJ9.eyJleHAiOjE2NzY3NTYwNjAsImRhdGEiOnsidXNlcl9sZWdhY3lfaWQiOjEwMjQ5MjU1OX0sImlhdCI6MTY2MDk3NjA2MCwiYXVkIjoiYnVzdXUiLCJpc3MiOiJjb20uYnVzdXUudG9rZW4iLCJzdWIiOiJkZDhiZDQ5OC1kZDQ4LTQ2ZmQtYjVjOS1lMTE3NmFkNmZhMTMiLCJqdGkiOiJlODNmNjBjNi03YzFlLTRjN2MtYjI4MC04ZGUwNjRiZDU5Y2MifQ.OmBqfQvVz4aFKiCeyiAb4lx7vM3i2VaMqVprJkk_qaFYZB_nVdm1YvPY_F6DCYymyPDNJmujgXA-fpa8-h7lbfMS2KaKgHV3W2qpuuoksiq8tcQxs5Efvubsjf09BlOcQJXSWjqk-Jv56va0P4vxFsTX9xW6kfnzEgSYJD_V2_u5xcYzqYEbSSaJCkgejyWEr842W8-op8Vmg54X2nL6ONCcQ0ixwDxjUZa77WHSNhe1bTJ1cM5N1YDN2WPPAg3CURsVC97iIgN2-JGGjf9F1KXpmVbY927etfuT5FrKQTZ0PbExHijpEVWS_FYWn2frnU-neTXNy3gyWr3kEfKSDEEq-Px0BGZjY_x4XomQkHu-qm7PGFETd4Eiog4PEUUDnjuONNhbDookD_rP2rTBiiaIIKICvWdF0IpmJvR1VwYZAsQx_E49kenAN035hIpfLVd2W0wCli8XCsG-820VagxDZmEl9z7HFhBlFr90OfgPJR_NNuimCTknigHKoD8Z6tz1ZU-kfmGSEBEYtQhzco0PAJxWixaniUActvpoevEGsNzaUG8Rd9-C2GySEdIb48VGL4qnqfpVWpiTNat0EGWX1HBaE6ZFioSoTsN-ZjrdMtMFWHsM5QPHWFH8SiQO6mLEQegHnj2b3vSgjUfHbFcmTxzVf9Zw35eC7EZp3oI;",
]
const uid = 102492559

const instance = axios.create({
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "cookie": cookie.join(';'),
    "Referer": "https://www.busuu.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
})

const handleProcess = async items => {
  const { data } = await instance.post('https://api.busuu.com/progress', {
    "events": items.map(item => {
      if (item.class === 'exercise') {
        return {
          "verb": "viewed",
          "platform": "web",
          uid,
          "language": "en",
          "interface_language": "vi",
          "client_version": "17.6.3",
          "session_id": "cc412998-1d0d-4734-92fb-cda6200ead12",
          "activity_id": item.activity_id,
          "exercise_id": item.id,
          "ts": moment().add(item.session_order, 'minute').unix(),
          "score": 0,
          "exercise_type": item.type,
          "graded": true,
          "grammar": false,
          "vocab": false,
          "session_order": item.session_order,
          "params": {
            "source": "course",
            "activity_type": "mixed",
            "input_text": null,
            "entity_id": null,
            "skipped": false
          }
        }
      } else if (item.class === 'activity') {
        return {
          "id": item.id,
          "class": item.class,
          "type": item.type,
          "passed": true,
          "verb": "finished",
          "end_time": moment().add(item.structure.length * 5, 'minute').unix(),
          "language": "en",
          "interface_language": "vi",
          "start_time": moment().unix(),
          "objective_id": item.objective_id,
          "total_attempts": item.structure.length,
          "successful_attempts": item.structure.length
        }
      }
    }),
    uid
  })
  console.log(`data='${data}'`)
}

const handleObjective = async url => {
  const rawObjective = await instance.get(url)
  const objective = rawObjective.data
  let is1 = 0
  for (const s1 of objective.structure) {
    is1++
    console.log('class', s1.class)

    let is2 = 0
    for (const s2 of s1.structure) {
      is2++
      console.log(' class', s2.class)

      let is3 = 0
      for (const s3 of s2.structure) {
        ++is3
        console.log('   class', s3.class)
        s3.session_order = is3
        s3.activity_id = s2.id
        await handleProcess([s3])
      }
      s2.objective_id = objective.id
      await handleProcess([s2])
    }
  }

}

// https://api.busuu.com/api/course-pack/course_pack_en_complete?translations=en,vi&interface_language=vi&lang1=en
// handleObjective('https://api.busuu.com/api/v2/component/objective_en_complete_b2_46?platform=web&lang1=en&interface_language=vi&translations=en,vi&content_version=2.0')
