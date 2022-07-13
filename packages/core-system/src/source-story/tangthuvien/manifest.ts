import {
  forceFunction,
  axiosProxy,
  axiosNomal,
  cheerioLoad,
  trimValue,
  getHash,
  setManifestStoryData,
  getManifestStoryPath,
  setGroupChapterData
} from '../../utility/index'

const getManifestContent = async manifestLink => {
  const { data } = await forceFunction(() => axiosProxy.get(manifestLink))
  if (typeof data === 'string') {
    return JSON.parse(data)
  }
  return data
}

const groupAndIndex = async (manifest) => {
  for (const chItem of manifest.chapters) {
    const { data } = await axiosNomal.post('http://127.0.0.1:2020/group-and-index', {
      // { key: '' manifestPath: '', story: '', chapter: '' }
      key: manifest.outsideSVC,
      manifestPath: getManifestStoryPath(manifest),
      story: Object.assign({}, {
        id: manifest.id,
        sId: manifest.sId,
        name: manifest.name,
        chapterPathRaw: manifest.chapterPathRaw,
        outsideChaptersLength: manifest.outsideChaptersLength,
        insideChaptersLength: manifest.insideChaptersLength,
        insideChaptersContentLength: manifest.insideChaptersContentLength,
        outsideSrc: manifest.outsideSrc,
        outsideSVC: manifest.outsideSVC,
        language: manifest.language
      }),
      chapter: chItem,
    })
    if (data?.group) {
      setGroupChapterData(data)
    } else {
      chItem.groupFN = data
    }
  }
}

const syncManifest = async storyItem => {
  /**
   * make folder with id
   * clone/ file raw git >> gán path cho story:db
  */
  try {
    console.log('sync:Manifest |', storyItem.name)
    let manifest = storyItem
    if (storyItem.chapterPathRaw) {
      manifest = await getManifestContent(storyItem.chapterPathRaw)
    }

    if (!manifest?.chapters) {
      manifest.chapters = []
    }

    /** mapper */
    const chapterMapper = {}
    manifest.chapters.forEach(ch => {
      chapterMapper[ch.id] = true
    });


    const { data } = await forceFunction(() => axiosProxy.get(encodeURI(
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

    /** inject chapters */
    chapters.forEach(ch => {
      if (!chapterMapper[ch.id]) {
        manifest.chapters.push(ch)
      }
    })
    manifest.chapters = manifest.chapters.sort((a, b) => a.index < b.index ? -1 : (a.index === b.index ? 0 : 1))
    await groupAndIndex(manifest)
    setManifestStoryData(manifest)
    return manifest.chapters.length
  } catch (error) {
    throw error
  }
}

export {
  syncManifest
}