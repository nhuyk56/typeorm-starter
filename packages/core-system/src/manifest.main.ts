import { AppDataSource } from "./data-source"
import { Story } from "./entity/Story";
import { In } from "typeorm";
import * as UTIL from './source-story'

const args = require('args-parser')(process.argv)
console.log('args', args)
// inject env
Object.keys(args).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = args[k]
  }
})
const StoryUtil = UTIL?.[args.target]

const init = async (storyItem) => {
  const icl = await StoryUtil.syncManifest(
    JSON.parse(
      JSON.stringify(storyItem)
    )
  )
  const storyRepository = AppDataSource.getRepository(Story)
  await storyRepository.save({
    id: storyItem.id,
    outsideChaptersLength: icl,
    insideChaptersLength: icl
  })
  console.log(`handle manifest ${storyItem.id}:${storyItem.name} success`)
}

const reset = async () => {
  let r = 0
  const storyRepository = AppDataSource.getRepository(Story)
  while(true) {
    const stories = await storyRepository
      .createQueryBuilder('sto')
      .where(`sto."outsideChaptersLength" is not NULL`)
      .andWhere(`sto."outsideChaptersLength" = sto."insideChaptersLength"`)
      .andWhere(`(sto."insideChaptersContentLength" is null or sto."outsideChaptersLength" != sto."insideChaptersContentLength")`)
      .andWhere(`sto.outsideSVC = :...outsideSVC`, {
        outsideSVC: [args.target]
      })
      .limit(1000)
      .getMany()
    if (!stories.length) break
    r += stories.length
    stories.forEach(s => {
      s.insideChaptersLength = s.insideChaptersContentLength || null
      console.log('RESET:', s.name)
    })
    await Promise.all(stories.map(s => storyRepository.save(s)))
  }
  return r
}

const main = async () => {
  if (StoryUtil) {
    if (args.force) {
      console.log('args.force', args.force)
      console.log("---START RESET---")
      const r =  await reset()
      console.log(`RESET ${r} items`)
      console.log("---END RESET---")
    }
    const storyRepository = AppDataSource.getRepository(Story)
    while(true) {
      const stories = await storyRepository
        .createQueryBuilder('sto')
        .where(`(sto."insideChaptersLength" <> sto."outsideChaptersLength") or (sto."insideChaptersLength" is NULL and sto."outsideChaptersLength" is not NULL)`)
        .andWhere(`sto.outsideSVC = :...outsideSVC`, {
          outsideSVC: [args.target]
        })
        .limit(100)
        .getMany()
      console.log('sync manifes', args.target, stories.length)
      if (!stories.length) break
      await Promise.all(stories.map(s => init(s)))
    }
    /** những gì còn dư ra */
    await StoryUtil.groupAndIndexLast(args.target)
  } else {
    throw new Error(`target: ${args.target} has not UTIL`)
  }
}

AppDataSource.initialize().then(main).catch(error => {
  console.log(error)
})

// npm run manifest:main target=tangthuvien force