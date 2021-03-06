import { forceFunction, axiosProxy, cheerioLoad, trimValue, getHash, getSlug } from '../../utility/index'

const storeField = {
  sId: o => o.$('[name=\'book_detail\']').attr('content'),
  name: o => o.$('title').text(),
  hashName: o => getHash(storeField.name(o)),
  hashNameSite: o => null,
  slug: o => o.$('[name=\'book_path\']').attr('content'),
  authorName: o => trimValue(o.$(o?.$('p.tag *')?.get(0))?.text()),
  hashAuthor: o => getHash(storeField.authorName(o)),
  hashAuthorSite: o => null,
  authorSlug: o => getSlug(storeField.authorName(o)),
  imagePathSrc: o => o.$('#bookImg img').attr('src'),
  hashImagePathSrc: o => getHash(storeField.imagePathSrc(o)),
  imagePathRaw: o => null,
  hashImagePathRaw: o => null,
  hashImagePathSite: o => null,
  status: o => trimValue(o.$(o?.$('p.tag *')?.get(1))?.text()),
  hashStatus: o => getHash(storeField.status(o)),
  hashStatusSite: o => null,
  categories: o => [trimValue(o.$(o.$('p.tag *')?.get(2))?.text())],
  hashCategories: o => getHash(JSON.stringify(storeField.categories(o))),
  hashCategoriesSite: o => null,
  tags: o => Array.from(o.$('.tags p.tag-wrap a')).map(a => o.$(a).text()),
  hashTags: o => getHash(JSON.stringify(storeField.tags(o))),
  hashTagsSite: o => null,
  chapterPathRaw: o => null,
  outsideChaptersLength: o => Number(o.$('#j-bookCatalogPage')?.text()?.match(/\d+/g)?.[0] || 0),
  insideChaptersLength: o => null,
  insideChaptersContentLength: o => null,
  siteChaptersLength: o => null,
  outsideSrc: o => o.SLink,
  outsideSVC: o => 'tangthuvien',
  language: o => 'vi',
  id: o => getHash(`${storeField.outsideSVC(o)}.${storeField.sId(o)}`), /** tránh case change name */
}

const getStoryFromSLink = async SLink => {
  try {
    const { data } = await forceFunction(() => axiosProxy.get(encodeURI(SLink)))
    const $ = cheerioLoad(data)
    const story = {}
    for (const key in storeField) {
      story[key] = storeField[key]({ $, SLink })
    }
    return story
  } catch (error) {
    console.log(SLink)
    throw error
  }
}

export {
  getStoryFromSLink
}
