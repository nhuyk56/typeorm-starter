import {
  forceFunction,
  axios,
  cheerioLoad,
  trimValue,
  getHash,
  getSlug,
  getLocalFolderChapter,
  getManifestStoryPath
} from '../../utility/index'
// npx ts-node .\src\source-story\tangthuvien\tangthuvien.ts
const getChapters = async storyItem => {
  /**
   * make folder with id
   * clone/ file raw git >> gán path cho story:db
  */
  try {
    const localFolderChapter = getLocalFolderChapter(storyItem.id)
    console.log(localFolderChapter)
    return
    const { data } = await forceFunction(() => axios.get(encodeURI(
      `https://truyen.tangthuvien.vn/story/chapters?story_id=${storyItem.sId}`
    )))
    const $ = cheerioLoad(data)
    const chapters = []
    $('ul li').each((i, li) => {
      const chapterField = {
        index: i,
        id: null,
        sId: trimValue($(li).attr('ng-chap')),
        name: trimValue($(li).find('.chapter-text').text()),        
        outsideSrc: trimValue($(li).find('a').attr('href')),
        outsideSVC: 'tangthuvien',
        language: 'vi',
        contentPathRaw: '',
        manifestPathRaw: ''
      }
      chapterField.id = getHash(`${chapterField.outsideSVC}.${chapterField.sId}`),
      chapters.push(chapterField)
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