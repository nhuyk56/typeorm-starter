import {
  readDataFN,
  getGroupChapterpath,
  upFolder2Git,
  getErrorPath,
  readDir,
  getChapterGitPath,
  setChapterGitData,
  getHash
} from './utility/index'

const args = require('args-parser')(process.argv)

if (!args.gitSSH) {
  args.gitSSH = "git@github.com----nhuyk56:nhuyk56/SyncStorage1.git"
}

console.log('args', args)
// inject env
Object.keys(args).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = args[k]
  }
})

const init = async () => {
  if (!args.gfn) throw new Error('MISSING gfn option')
  const groupFN = args.gfn?.split('.')?.shift()
  const groupFNPath = getGroupChapterpath({ groupFN })

  console.log('UPFOLDER2GIT', groupFNPath)
  const brandRaw = await upFolder2Git({
    folderPath: groupFNPath,
    errorPath: getErrorPath(),
    gitSSH: args.gitSSH,
    brand: getHash(groupFNPath),
    // removeFolder: true /** live */
  })

  const chapters = readDir(groupFNPath).map(chapterId => {
    console.log(`${brandRaw}${chapterId}`) /** DEBUG */
    setChapterGitData({ FN: chapterId, data: `${brandRaw}${chapterId}` })
    return `${brandRaw}${chapterId}`
  })
  return chapters
}

init()
// npm run chapter:git:main gfn=path/to/file