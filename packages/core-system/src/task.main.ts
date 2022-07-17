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
  let index = 1
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

const init = async () => {
  const scriptKey = String(args.scriptKey || STARTSCRIPTKEY)
  const target = String(args.target || '')
  const taskNum = Number(args.taskNum || MAXTASKNUM)
  console.log({ scriptKey, target, taskNum })

  const scriptKeys = {
    'story:main': storyMain,

    'manifest:main': storyMain,
    'chapter:main': storyMain,
    'chapter:git:main': storyMain,
    'manifest:git:main': storyMain,
    'task:main': storyMain,
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