import {
  forceFunction,
  axiosProxy,
  axiosNormal,
  cheerioLoad,
  trimValue,
  isExistsFN,
  setGroupFDData,
  getGroupFD,
  unmaskChapterName,
  getHash,
  setManifestStoryData,
  getManifestStoryPath,
  setGroupChapterData
} from '../../utility/index'

const syncChapter = async (chMap) => {
  // key: key, story, chapter, groupFN
  if (!chMap?.chapter?.outsideSrc) {
    throw new Error('syncChapter | ' + JSON.stringify(chMap || 'MISSING IMPORTANT DATA'))
  }
  const opt = {
    groupFD: chMap?.groupFN?.split('.')?.shift(),
    chapterFN: chMap?.chapter?.id,
    chapterContent: null
  }
  if (isExistsFN(getGroupFD(opt))) {
    console.log(
      'SYNCCHAPTER:HAVE BEEN PROCESSED BEFORE',
      `\n↳${getGroupFD(opt)}`,
      `\n↳${chMap?.story?.name}`,
      `\n↳${chMap?.chapter?.name}`,
      `\n↳content length: STOP`,
    )
    return
  }
  const { data } = await forceFunction(() => axiosProxy.get(chMap?.chapter?.outsideSrc));
  const $ = cheerioLoad(data)
  const chapterContentRaw = (trimValue($('.box-chap')?.text()) || `
    ét ô ét, ét ô ét, ét ô ét,
    chương truyện mất nội dung,
    mời bạn liên hệ admin để fix.
    ref: ${chMap?.story?.id}/${chMap?.chapter?.id}`)

  const f1 = !chMap?.chapter?.index ? `truyện ${chMap?.story?.name}.` : ''
  const f2 = (
              unmaskChapterName(chapterContentRaw)===
              unmaskChapterName(chMap?.chapter?.name)
            ) ? '' : `${chMap?.chapter?.name}.`
  const chapterContent = trimValue(
    `${f1}`+
    `\n${f2}`+
    `\n${chapterContentRaw}`+
    `\nKết chương.`
  ).trim()
  /** inject chapterContent */
  opt.chapterContent = chapterContent
  await setGroupFDData(opt)
  console.log(
    'SYNCCHAPTER:SUCCESS',
    `\n↳${getGroupFD(opt)}`,
    `\n↳${chMap?.story?.name}`,
    `\n↳${chMap?.chapter?.name}`,
    `\n↳content length: ${chapterContentRaw.length}`,
  )
}

export {
  syncChapter
}