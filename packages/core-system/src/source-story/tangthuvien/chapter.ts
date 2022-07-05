import { forceFunction, axios, cheerioLoad, trimValue, getHash, getSlug } from '../../utility/index'
// npx ts-node .\src\source-story\tangthuvien\tangthuvien.ts
// const storeField = {
//   sId: o => o.$('[name=\'book_detail\']').attr('content'),
//   name: o => o.$('title').text(),
//   hashName: o => getHash(storeField.name(o)),
//   hashNameSite: o => null,
//   slug: o => o.$('[name=\'book_path\']').attr('content'),
//   authorName: o => trimValue(o.$(o?.$('p.tag *')?.get(0))?.text()),
//   hashAuthor: o => getHash(storeField.authorName(o)),
//   hashAuthorSite: o => null,
//   authorSlug: o => getSlug(storeField.authorName(o)),
//   imagePathSrc: o => o.$('#bookImg img').attr('src'),
//   hashImagePathSrc: o => getHash(storeField.imagePathSrc(o)),
//   imagePathRaw: o => null,
//   hashImagePathRaw: o => null,
//   hashImagePathSite: o => null,
//   status: o => trimValue(o.$(o?.$('p.tag *')?.get(1))?.text()),
//   hashStatus: o => getHash(storeField.status(o)),
//   hashStatusSite: o => null,
//   categories: o => [trimValue(o.$(o.$('p.tag *')?.get(2))?.text())],
//   hashCategories: o => getHash(JSON.stringify(storeField.categories(o))),
//   hashCategoriesSite: o => null,
//   tags: o => Array.from(o.$('.tags p.tag-wrap a')).map(a => o.$(a).text()),
//   hashTags: o => getHash(JSON.stringify(storeField.tags(o))),
//   hashTagsSite: o => null,
//   chapterPathRaw: o => null,
//   outsideChaptersLength: o => Number(o.$('#j-bookCatalogPage')?.text()?.match(/\d+/g)?.[0] || 0),
//   insideChaptersLength: o => null,
//   insideChaptersContentLength: o => null,
//   outsideSrc: o => o.SLink,
//   outsideSVC: o => 'tangthuvien',
//   language: o => 'vi',
//   id: o => getHash(`${storeField.outsideSVC(o)}.${storeField.sId(o)}`), /** tránh case change name */
// }

const getChapters = async storyItem => {
  try {
    const { data } = await forceFunction(() => axios.get(encodeURI(
      `https://truyen.tangthuvien.vn/story/chapters?story_id=${storyItem.sId}`
    )))
    const $ = cheerioLoad(data)
    const chapters = []
    $('ul li').each((i, li) => {
      chapters.push({
        sdomain: 'tangthuvien',
        sid: trimValue($(li).attr('ng-chap')),
        index: i,
        name: trimValue($(li).find('.chapter-text').text()),
        link: trimValue($(li).find('a').attr('href')),
      })
    })
    console.log(chapters)
    return chapters
  } catch (error) {
    throw error
  }
}

export {
  getChapters
}
