import { AppDataSource } from "./data-source"
import { Story } from "./entity/Story";
import { In } from "typeorm";
import * as UTIL from './source-story'
import {
  getGroupChapterpath,
  upFolder2Git,
  getErrorPath,
  readDir,
  getManifestPath,
  getManifestStoryPath,
  getManifestStoryFolderPath,
  readDataFN,
  isExistsFN,
  getChapterGitPath,
  setManifestStoryData,
  setChapterGitData,
  getHash,
  isDeleteFN,
  setErrorData
} from './utility/index'

const args = require('args-parser')(process.argv)
console.log('args', args)
// inject env
Object.keys(args).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = args[k]
  }
})
// const StoryUtil = UTIL?.[args.target]

const init = async (storyId) => {
  const manifestStoryFolderPath = getManifestStoryFolderPath({ id: storyId })
  const manifestStoryPath = getManifestStoryPath({ id: storyId })
  if (!isExistsFN(manifestStoryPath)) {
    console.log(`[MANIFEST.GIT]: ${manifestStoryPath}, not found`)
    return
  }
  const rawStory = readDataFN(manifestStoryPath)
  const story = JSON.parse(rawStory)
  const chapters = JSON.parse(JSON.stringify(story)).chapters
  let hasUpdateChapter = false
  chapters.forEach(ch => {
    const chapterGitPath = getChapterGitPath({ FN: ch.id })
    if (isExistsFN(chapterGitPath)) {
      ch.contentPathRaw = readDataFN(chapterGitPath)
      delete ch.groupFN
      isDeleteFN(chapterGitPath)
      hasUpdateChapter = true
    }
  })
  if (!hasUpdateChapter) {
    console.log(`[MANIFEST.GIT]: ${manifestStoryPath}, NO UPDATE CHAPTER >> OUT`)
    setErrorData({
      FN: `${storyId}.${new Date().getTime()}.txt`,
      data: `[MANIFEST.GIT]: ${manifestStoryPath}, NO UPDATE CHAPTER >> OUT`,
    })
    return
  }
  const storyRepository = AppDataSource.getRepository(Story)
  const storiesDB = await storyRepository.findBy({ id: storyId })
  const storyDB = storiesDB?.pop()
  if (!storyDB) {
    console.log(`[MANIFEST.GIT]: ${manifestStoryPath}, not found in storyDB`)
    return
  }
  const dataStoryUpdate = {
    id: storyId,
    outsideChaptersLength: chapters.length,
    insideChaptersLength: chapters.length,
    insideChaptersContentLength: chapters.length,
    chapterPathRaw: storyDB.chapterPathRaw /** ?? */
  }

  const dataManifest = {
    ...JSON.parse(JSON.stringify(storyDB)),
    ...JSON.parse(JSON.stringify(dataStoryUpdate)),
    ...JSON.parse(JSON.stringify({ chapters })),
    chapterPathRaw: undefined, /** this me */
    groupFN: undefined
  }
  setManifestStoryData(dataManifest)

  console.log('UPFOLDER2GIT', manifestStoryFolderPath)
  const brandRaw = await upFolder2Git({
    folderPath: manifestStoryFolderPath,
    errorPath: getErrorPath(),
    gitSSH: args.gitSSH,
    brand: storyId,
    removeFolder: true /** live */
  })

  if (!dataStoryUpdate.chapterPathRaw) {
    dataStoryUpdate.chapterPathRaw = `${brandRaw}index.json`
  }
  await storyRepository.save(dataStoryUpdate)
  console.log(
    `handle manifest:git:main ${storyDB.id}:${storyDB.name} success`,
    `\n➥${dataStoryUpdate.chapterPathRaw}`
  )
}

const main = async () => {
  if (!args.gitSSH) throw new Error('Missing git SSH')
  if (!args.storyId) throw new Error('Missing storyId')
  await init(args.storyId)
}

AppDataSource.initialize().then(main).catch(error => {
  console.log(error)
})

// npm run manifest:git:main storyId=123 gitSSH=git@github.com----nhuyk56:nhuyk56/SyncStorage1.git