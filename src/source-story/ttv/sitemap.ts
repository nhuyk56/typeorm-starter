import { forceFunction, axios, cheerioLoad, trimValue, getHash, getSlug } from '../../utility/index'
const SITEMAP_URL = 'https://truyen.tangthuvien.vn/sitemap.xml'

const getStories = _html => {
  const $ = cheerioLoad(_html)
  const Link = []
  let index = 0
  $('url loc').each((i, loc) => {
    const _link = trimValue($(loc).text())
    if (/doc-truyen/.test(_link)) {
      Link.push({
        index: index++,
        link: $(loc).text()
      })
    }
  })
  return Link
}

const getLinksFromSitemap = async () => {
  const { data } = await forceFunction(() => axios.get(SITEMAP_URL))
  return getStories(data)
}

export {
  getLinksFromSitemap
}