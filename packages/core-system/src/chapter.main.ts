import { AppDataSource } from "./data-source"
import { Story } from "./entity/Story";
import { In } from "typeorm";
import * as UTIL from './source-story'

const args = require('args-parser')(process.argv)
const StoryUtil = UTIL?.[args.target]

const initStory = async (storyItem) => {
  storyItem = {
    id: '142b8adb82662a236375e853cd011163',
    sId: '35864',
    name: 'Người Khác Ngự Thú Ta Ngự Yêu (Biệt Nhân Ngự Thú Ngã Ngự Yêu)',
    hashName: 'ff2dae53b0908c9b9563e40ca75b8f7a',
    hashNameSite: null,
    slug: 'nguoi-khac-ngu-thu-ta-ngu-yeu-biet-nhan-ngu-thu-nga-ngu-yeu',
    authorName: 'Vô Nguyệt Bất Đăng Lâu',
    hashAuthor: '94efb7c0e902d8db45f1786d19878f4d',
    hashAuthorSite: null,
    authorSlug: 'vo-nguyet-bat-dang-lau',
    imagePathSrc: 'https://www.nae.vn/ttv/ttv/public/images/story/2a5376a5d9fd6bcd77628db19a7f8898caecf7712844a6c14d672074b48ed5a3.jpg',
    hashImagePathSrc: 'bd1948540ee91d1646ad927713762663',
    imagePathRaw: null,
    hashImagePathRaw: null,
    hashImagePathSite: null,
    status: 'Đang ra',
    hashStatus: 'da5752c51fb0a8a436c0cde9b414eae4',
    hashStatusSite: null,
    categories: [ 'Huyền Huyễn' ],
    hashCategories: '0b9ab0777cc0850bc5b508e0081a86cb',
    hashCategoriesSite: null,
    tags: [ 'Sủng vật', 'Triệu hoán lưu', 'Dị thế đại lục', 'Xuyên việt' ],
    hashTags: '8281211e9b7f3bf840b575286c299f47',
    hashTagsSite: null,
    chapterPathRaw: null,
    outsideChaptersLength: 164,
    insideChaptersLength: null,
    insideChaptersContentLength: null,
    outsideSrc: 'https://truyen.tangthuvien.vn/doc-truyen/nguoi-khac-ngu-thu-ta-ngu-yeu-biet-nhan-ngu-thu-nga-ngu-yeu',
    outsideSVC: 'tangthuvien',
    language: 'vi'
  }
  console.log(storyItem)
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