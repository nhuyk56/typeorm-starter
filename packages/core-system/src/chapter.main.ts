import { AppDataSource } from "./data-source"
import { Story } from "./entity/Story";
import { In } from "typeorm";
import * as UTIL from './source-story'

const args = require('args-parser')(process.argv)
// inject env
Object.keys(args).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = args[k]
  }
})
const StoryUtil = UTIL?.[args.target]

const initStory = async (storyItem) => {
  const insideChaptersLength = await StoryUtil.syncChapters(
    JSON.parse(
      JSON.stringify(storyItem)
    )
  )
  // const storyRepository = AppDataSource.getRepository(Story)
  // await storyRepository.save({ id: storyItem.id, insideChaptersLength })
  console.log(`handle manifest ${storyItem.id}:${storyItem.name} success`)
}

const main = async () => {
  if (StoryUtil) {
    const storyRepository = AppDataSource.getRepository(Story)
    while(true) {
      const stories = await storyRepository
        .createQueryBuilder('sto')
        .where(`(sto."insideChaptersLength" <> sto."outsideChaptersLength") or (sto."insideChaptersLength" is NULL and sto."outsideChaptersLength" is not NULL)`)
        .limit(1)
        .getMany()
      console.log(stories.length)
      if (!stories.length) break
      await Promise.all(stories.map(s => initStory(s)))
    }
  } else {
    throw new Error(`target: ${args.target} has not UTIL`)
  }
}

AppDataSource.initialize().then(main).catch(error => {
  console.log(error)
})

// npm run chapter:main target=tangthuvien