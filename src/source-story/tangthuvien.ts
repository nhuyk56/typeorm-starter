const url = 'https://truyen.tangthuvien.vn/story/chapters?story_id=17299'
const sitemap = 'https://truyen.tangthuvien.vn/sitemap.xml'
import axios from 'axios'
import { load as cheerioLoad } from 'cheerio'

const trimValue = s => (s || '').trim()

const getChapters = _html => {
  const $ = cheerioLoad(_html)
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
}

const getStories = _html => {
  const $ = cheerioLoad(_html)
  const Link = []
  $('url loc').each((i, loc) => {
    const _link = trimValue($(loc).text())
    if (/doc-truyen/.test(_link)) {
      Link.push({
        link: $(loc).text()
      })
    }
  })
  console.log(Link)
}

const main = async () => {
  const { data } = await axios.get(url)
  getChapters(data)
  // const { data } = await axios.get(sitemap)
  // getStories(data)
}

main()