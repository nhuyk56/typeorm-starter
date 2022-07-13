import { AppDataSource } from "./data-source"
import { Story } from "./entity/Story";
import { In } from "typeorm";
import * as UTIL from './source-story'

const args = require('args-parser')(process.argv)
const StoryUtil = UTIL?.[args.target]

const initStory = async (storyItem) => {
  // const storyRepository = AppDataSource.getRepository(Story)
  // console.log(`[initStory][${sitemapRow.index}]: ${sitemapRow.link}`)
  // const item = await StoryUtil.getStoryFromSLink(sitemapRow.link)
  // // @todo: uniq item.id >> has json[item.id] >> edit/create

  // const storiesFounded = await storyRepository.findBy({ id: item.id })
  // let story = null
  // if (storiesFounded?.length) {
  //   story = storiesFounded.pop()
  //   console.log(`${item.id} exist >> update`)
  //   const fieldsUpdate = [
  //     'sId',
  //     'name',
  //     'hashName',
  //     'slug',
  //     'authorName',
  //     'hashAuthor',
  //     'authorSlug',
  //     'imagePathSrc',
  //     "hashImagePathSrc",
  //     "hashImagePathRaw",
  //     'status',
  //     'hashStatus',
  //     'categories',
  //     'hashCategories',
  //     'tags',
  //     'hashTags',
  //     'outsideChaptersLength'
  //   ]
  //   fieldsUpdate.forEach(field => story[field] = item[field])
  // } else {
  //   story = new Story(item)
  //   console.log(`${item.id} not exist >> create`)
  // }
  // /** case create */
  // await storyRepository.save(story)
  // console.log(`handle story ${item.id}:${item.name} success`)
}

const main = async () => {
  /**
   * db >> outsideChaptersLength != insideChaptersLength
   * add/update manifes >> update insideChaptersLength
   */

  if (StoryUtil) {
    const storyRepository = AppDataSource.getRepository(Story)
    const stories = await storyRepository
      .createQueryBuilder('sto')
      .where(`(sto."insideChaptersLength" <> sto."outsideChaptersLength") or (sto."insideChaptersLength" is NULL and sto."outsideChaptersLength" is not NULL)`)
      .limit(1)
      .getMany()
    await Promise.all(stories.map(s => initStory(s)))
    console.log(stories.length)
  } else {
    throw new Error(`target: ${args.target} has not UTIL`)
  }
}

AppDataSource.initialize().then(main).catch(error => {
  console.log(error)
})

// npm run chapter:main target=tangthuvien