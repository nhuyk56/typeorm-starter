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

const initStory = async (sitemapRow) => {
  const storyRepository = AppDataSource.getRepository(Story)
  console.log(`[initStory][${sitemapRow.index}]: ${sitemapRow.link}`)
  const item = await StoryUtil.getStoryFromSLink(sitemapRow.link)

  const storiesFounded = await storyRepository.findBy({ id: item.id })
  let story = null
  if (storiesFounded?.length) {
    // story = storiesFounded.pop()
    story = { id: item.id } /** update fields only */
    console.log(`${item.id} exist >> update`)
    const fieldsUpdate = [
      'sId',
      'name',
      'hashName',
      'slug',
      'authorName',
      'hashAuthor',
      'authorSlug',
      'imagePathSrc',
      "hashImagePathSrc",
      "hashImagePathRaw",
      'status',
      'hashStatus',
      'categories',
      'hashCategories',
      'tags',
      'hashTags',
      'outsideChaptersLength'
    ]
    fieldsUpdate.forEach(field => story[field] = item[field])
  } else {
    // story = new Story(item)
    story = item
    console.log(`${item.id} not exist >> create`)
  }
  /** case create */
  await storyRepository.save(story)
  console.log(`handle story ${item.id}:${item.name} success`)
}

const main = async () => {
  /** db >> json [pending]*/
  /** start db engine [ok]*/
  /** util >> getList DB >> add/update [ok]*/

  if (StoryUtil) {
    const links = await StoryUtil.getLinksFromSitemap()
    var all = []
    for (const item of links) { /** DEBUG >> [links[0]] */
      all.push(initStory(item))
      if (all.length === 100) {
        await Promise.all(all)
        all = []
        // break /** for debug */
      }
    }
    await Promise.all(all)
  } else {
    throw new Error(`target: ${args.target} has not UTIL`)
  }
}

AppDataSource.initialize().then(main).catch(error => {
  console.log(error)
})

// npm run story:main target=tangthuvien