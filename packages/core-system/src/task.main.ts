import { AppDataSource } from "./data-source"
import { Story } from "./entity/Story";
import { In } from "typeorm";
import * as UTIL from './source-story'
const { execSync } = require('child_process')
import {
  readDataFN,
  getGroupChapterpath,
  upFolder2Git,
  getErrorPath,
  readDir,
  getChapterGitPath,
  setChapterGitData,
  getHash,
  isDeleteFN,
  getTaskFolderPath,
  getTaskPath,
  setTaskData,
  getGroupFolderPath
} from './utility/index'

// defined
const MAXTASKNUM = 30
const STARTSCRIPTKEY = 'story:main'
const TARGETKEYS = Object.keys(UTIL)

const args = require('args-parser')(process.argv)
// inject env
Object.keys(args).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = args[k]
  }
})

const storyMain = () => {
  const CHECK_TASK = TARGETKEYS.map(t => `if (Test-Path -Path ${getTaskPath({ FN: t + '.ps1' })} -PathType Leaf) { exit }`).join('\n')
  for (const target of TARGETKEYS) {
    setTaskData({
      FN: target + '.ps1',
      data: 
      `Set-Location -Path ${process.cwd()}\n`+
      `npm run story:main target=${target}\n`+
      `Set-Location -Path ${getTaskFolderPath()}\n`+
      `del ${target}.ps1\n`+
      `timeout 5\n`+
      `${CHECK_TASK}\n`+
      `Set-Location -Path ${process.cwd()}\n`+
      `npm run task:main scriptKey=manifest:main\n`+
      `exit`
    })
    execSync(`start ${target}.ps1`, { stdio: 'pipe', cwd: getTaskFolderPath(), shell: 'cmd.exe' })
  }
}

const manifestMain = () => {
  const CHECK_TASK = TARGETKEYS.map(t => `if (Test-Path -Path ${getTaskPath({ FN: t + '.ps1' })} -PathType Leaf) { exit }`).join('\n')
  for (const target of TARGETKEYS) {
    setTaskData({
      FN: target + '.ps1',
      data: 
      `Set-Location -Path ${process.cwd()}\n`+
      `npm run manifest:main target=${target}\n`+
      `Set-Location -Path ${getTaskFolderPath()}\n`+
      `del ${target}.ps1\n`+
      `timeout 5\n`+
      `${CHECK_TASK}\n`+
      `Set-Location -Path ${process.cwd()}\n`+
      `npm run task:main scriptKey=chapter:main\n`+
      `exit`
    })
    execSync(`start ${target}.ps1`, { stdio: 'pipe', cwd: getTaskFolderPath(), shell: 'cmd.exe' })
  }
}

const chapterMain = () => {
  const getgroupFolderPath = getGroupFolderPath()
  const CHECK_TASK = TARGETKEYS.map(t => `if (Test-Path -Path ${getTaskPath({ FN: t + '.ps1' })} -PathType Leaf) { exit }`).join('\n')
  for (const target of TARGETKEYS) {
    const chapterGroupCmd = readDir(getgroupFolderPath)
                        .filter(groupName => groupName.includes(`.${target}.json`))
                        .map(groupName => `npm run chapter:main target=${target} gfn=${groupName}`)
                        .join('\n')

    setTaskData({
      FN: target + '.ps1',
      data: 
      `Set-Location -Path ${process.cwd()}\n`+
      `${chapterGroupCmd}\n`+
      `Set-Location -Path ${getTaskFolderPath()}\n`+
      `del ${target}.ps1\n`+
      `timeout 5\n`+
      `${CHECK_TASK}\n`+
      `Set-Location -Path ${process.cwd()}\n`+
      `npm run task:main scriptKey=chapter:git:main\n`+
      `exit`
    })
    execSync(`start ${target}.ps1`, { stdio: 'pipe', cwd: getTaskFolderPath(), shell: 'cmd.exe' })
  }
}

const chapterGitMain = () => {
  const getgroupFolderPath = getGroupFolderPath()
  let tasks = [], gIndex = 0
  const chapterGroups = readDir(getgroupFolderPath).filter(groupName => !groupName.includes('.json'))
  const MAXTASK = chapterGroups.length > 15  ? Math.round(chapterGroups.length/15) : 1
  const CHECK_TASK = `if (Test-Path -Path G_Chapter_Git_Main_* -PathType Leaf) { exit }\n`
  chapterGroups.forEach(groupName => {
    console.log('task:', groupName)
    const FN = groupName + '.ps1'
    setTaskData({
      FN,
      data: 
      `Set-Location -Path ${process.cwd()}\n`+
      `npm run chapter:git:main gfn=${groupName}.json gitSSH=git@github.com----nhuyk56:nhuyk56/SyncStorage1.git\n`+
      `Set-Location -Path ${getTaskFolderPath()}\n`+
      `del ${groupName}.ps1\n`
    })
    
    /** group task */
    tasks.push(FN)
    const isLast = chapterGroups[chapterGroups.length-1] === groupName
    if (tasks.length >= MAXTASK || isLast) {
      const gTask = JSON.parse(JSON.stringify({
        FN: `G_Chapter_Git_Main_${gIndex}.ps1`,
        data: 
        `${tasks.map(t => `./${t}`).join('\n')}\n`+
        `del G_Chapter_Git_Main_${gIndex}.ps1\n`+
        `timeout 5\n`+
        `${CHECK_TASK}\n`+
        `Set-Location -Path ${process.cwd()}\n`+
        // `npm run task:main scriptKey=manifest:git:main\n`+ /** DONT NEED THIS */
        `npm run manifest:git:main gitSSH=git@github.com----nhuyk56:nhuyk56/SyncStorage1.git\n`+
        `exit`
      }))
      setTaskData(gTask)
      tasks = []
      ++gIndex
      
      execSync(`start ${gTask.FN}`, { stdio: 'pipe', cwd: getTaskFolderPath(), shell: 'cmd.exe' })
    }
  })
}

const init = async () => {
  const scriptKey = String(args.scriptKey || STARTSCRIPTKEY)
  const target = String(args.target || '')
  const taskNum = Number(args.taskNum || MAXTASKNUM)
  console.log({ scriptKey, target, taskNum })

  const scriptKeys = {
    'story:main': storyMain,
    'manifest:main': manifestMain,
    'chapter:main': chapterMain,
    'chapter:git:main': chapterGitMain
  }

  if (scriptKeys[scriptKey]) {
    console.log(`Running scriptKey: ${scriptKey} START`)
    scriptKeys[scriptKey]({ scriptKey, target, taskNum })
    console.log(`Running scriptKey: ${scriptKey} SUCCESS`)
  } else {
    console.log(`scriptKey: ${scriptKey} NOT FOUND IN ${Object.keys(scriptKeys)}`)
  }
}
init()
// npm run task:main