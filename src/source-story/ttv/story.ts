import { forceFunction, axios, cheerioLoad, trimValue, getHash, getSlug } from '../../utility/index'

const storeField = {
  id: o => '???',
  sId: o => o.$('[name=\'book_detail\']').attr('content'),
  name: o => o.$('title').text(),
  slug: o => o.$('[name=\'book_path\']').attr('content'),
  authorName: o => trimValue(o.$(o?.$('p.tag *')?.get(0))?.text()),
  hashAuthor: o => getHash(storeField.authorName(o)),
  hashAuthorSite: o => '???',
  authorSlug: o => getSlug(storeField.authorName(o)),
  imagePathSrc: o => o.$('#bookImg img').attr('src'),
  imagePathRaw: o => '???',
  hashImagePath: o => '???',
  hashImagePathSite: o => '???',
  status: o => trimValue(o.$(o?.$('p.tag *')?.get(1))?.text()),
  hashStatus: o => getHash(storeField.status(o)),
  hashStatusSite: o => '???',
  categories: o => [trimValue(o.$(o.$('p.tag *')?.get(2))?.text())],
  hashCategories: o => getHash(JSON.stringify(storeField.categories(o))),
  hashCategoriesSite: o => '???',
  tags: o => Array.from(o.$('.tags p.tag-wrap a')).map(a => o.$(a).text()),
  hashTags: o => getHash(JSON.stringify(storeField.tags(o))),
  hashTagsSite: o => '???',
  chapterPathRaw: o => '???',
  outsideChaptersLength: o => Number(o.$('#j-bookCatalogPage')?.text()?.match(/\d+/g)?.[0] || 0),
  insideChaptersLength: o => '???',
  hasChapterNeedContent: o => '???',
  outsideSrc: o => o.SLink,
  outsideSVC: o => 'TTV',
  language: o => 'vi',
}

const getStoryFromSLink = async SLink => {
  const { data } = await forceFunction(() => axios.get(encodeURI(SLink)))
  const $ = cheerioLoad(data)
  const jsonLD = JSON.parse($('[type="application/ld+json"]').text())
  const story = {}
  for (const key in storeField) {
    story[key] = storeField[key]({ $, SLink, jsonLD })
  }
  console.log(story)
}

export {
  getStoryFromSLink
}
