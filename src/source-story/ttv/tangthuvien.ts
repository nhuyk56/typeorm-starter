// import 'module-alias/register'
const url = 'https://truyen.tangthuvien.vn/story/chapters?story_id=17299'
const sitemap = 'https://truyen.tangthuvien.vn/sitemap.xml'
import { load as cheerioLoad } from 'cheerio'
// import { HttpsProxyAgent } from 'https-proxy-agent'
import { trimValue, axios } from '../../utility/index'
import { getLinksFromSitemap } from './sitemap'
import { getStoryFromSLink } from './story'

// sitemap >> [slink] >> slink >> story >> chapters >> [chapter]

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
  // const { data } = await axios.get(url)
  // getChapters(data)
  // const { data } = await axios.get(sitemap)
  // getStories(data)

  // const { data } = await axios.get('http://api64.ipify.org/?format=json', {
  //   proxy: false,
  //   httpsAgent: new HttpsProxyAgent('http://207.148.123.54:32022')
  //   // proxy: {
  //   //   host: '207.148.123.54',
  //   //   port: 32022,
  //   //   protocol: 'http'
  //   // }
  // })
  // console.log(data)
  
  const links = await getLinksFromSitemap()
  var stories = []
  for (const item of links) {
    console.log(`[${item.index}]: ${item.link}`)
    stories.push(getStoryFromSLink(item.link))
    if (stories.length === 5) {
      await Promise.all(stories)
      stories = []
    }
  }
}

main()