const url = 'https://truyen.tangthuvien.vn/story/chapters?story_id=17299'
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

const main = async () => {
  const { data } = await axios.get(url)
  getChapters(data)
}

main()