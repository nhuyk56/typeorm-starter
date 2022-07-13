// import 'module-alias/register'
const url = 'https://truyen.tangthuvien.vn/story/chapters?story_id=17299'
const sitemap = 'https://truyen.tangthuvien.vn/sitemap.xml'
import { load as cheerioLoad } from 'cheerio'
// import { HttpsProxyAgent } from 'https-proxy-agent'
import { trimValue, axiosProxy, upFolder2Git } from '../../utility/index'
import { getLinksFromSitemap } from './sitemap'
import { getStoryFromSLink } from './story'
import { syncManifest } from './manifest'

// sitemap >> [slink] >> slink >> story >> chapters >> [chapter]

// const getChapters = _html => {
//   const $ = cheerioLoad(_html)
//   const chapters = []
//   $('ul li').each((i, li) => {
//     chapters.push({
//       sdomain: 'tangthuvien',
//       sid: trimValue($(li).attr('ng-chap')),
//       index: i,
//       name: trimValue($(li).find('.chapter-text').text()),
//       link: trimValue($(li).find('a').attr('href')),
//     })
//   })
//   console.log(chapters)
// }

// const getStories = _html => {
//   const $ = cheerioLoad(_html)
//   const Link = []
//   $('url loc').each((i, loc) => {
//     const _link = trimValue($(loc).text())
//     if (/doc-truyen/.test(_link)) {
//       Link.push({
//         link: $(loc).text()
//       })
//     }
//   })
//   console.log(Link)
// }

// const main = async () => {
//   // const { data } = await axiosProxy.get(url)
//   // getChapters(data)
//   // const { data } = await axiosProxy.get(sitemap)
//   // getStories(data)

//   // const { data } = await axiosProxy.get('http://api64.ipify.org/?format=json', {
//   //   proxy: false,
//   //   httpsAgent: new HttpsProxyAgent('http://207.148.123.54:32022')
//   //   // proxy: {
//   //   //   host: '207.148.123.54',
//   //   //   port: 32022,
//   //   //   protocol: 'http'
//   //   // }
//   // })
//   // console.log(data)
  
//   const links = await getLinksFromSitemap()
//   var stories = []
//   for (const item of links) {
//     console.log(`[${item.index}]: ${item.link}`)
//     stories.push(getStoryFromSLink(item.link))
//     if (stories.length === 1000) {
//       await Promise.all(stories)
//       stories = []
//     }
//   }
//   await Promise.all(stories)
// }

// main()

syncManifest({
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
})

// upFolder2Git({
//   folderPath: 'C:/Users/YNN/AppData/Local/Temp/folderTest',
//   errorPath: 'C:/Users/YNN/AppData/Local/Temp/errorFolder',
//   gitSSH: 'git@github.com----nhuyk56:nhuyk56/SyncStorage1.git',
//   brand: 'brandtest1',
//   removeFolder: true
// })