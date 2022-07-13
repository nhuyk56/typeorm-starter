import Axios from 'axios'
import fs from 'fs'
import shell from 'shelljs'
import { load as cheerioLoad } from 'cheerio'
import md5 from 'crypto-js/md5';
import getSlug from 'slug'
import { SocksProxyAgent } from 'socks-proxy-agent';
import path from 'path';

const proxyOptions = `socks5://45.77.250.86:9050`;
const agent = new SocksProxyAgent(proxyOptions);

const trimValue = s => String(s || '').trim()
const getHash = s => s && md5(trimValue(s)).toString()
const axiosProxy = Axios.create({ httpAgent: agent, httpsAgent: agent, timeout: 60000 });
const axiosNomal = Axios

const forceFunction = async callback => {
  let times = 100
  while (times > 0) {
    try {
      return await callback()
    } catch (error) {
      console.log('try times', --times)
    }
  }
  throw new Error(callback)
}

// upFolder2Git({
//   folderPath: 'C:/Users/YNN/AppData/Local/Temp/folderTest',
//   errorPath: 'C:/Users/YNN/AppData/Local/Temp/errorFolder',
//   gitSSH: 'git@github.com----nhuyk56:nhuyk56/SyncStorage1.git',
//   // brand: 'brandtest1', archived
//   removeFolder: true
// })
const upFolder2Git = async (option) => {
  /**
   * [input]
   * folderPath: C:\Users\YNN\AppData\Local\Temp\folderName
   * errorPath: C:\Users\YNN\err
   * gitSSH: git@github.com:userABC/gitABC.git
   * brand: (string/null), null then >>> hashMD5(new date time() + ramdom)
   * removeFolder
   *-----------------------------------------------------------------------
   * [process]
   * track time start | git init              | track time end
   * track time start | git remote add origin | track time end
   * track time start | git checkout -b       | track time end
   * track time start | git add               | track time end
   * track time start | git commit -m         | track time end
   * track time start | git push              | track time end
   * track time start | success >> rm git folder  | track time end
   *-----------------------------------------------------------------------
   * [output]
   * prefix: https://raw.githubusercontent.com/${userABC}/${gitABC}/${brand}/
   *-----------------------------------------------------------------------
   * [use]
   * {prefix}/{fileName}
  */

  if (!option.folderPath) throw new Error('Missing folderPath')
  else if (!fs.existsSync(option.folderPath)) throw new Error(`folderPath ${option.folderPath} not exist!`)
  if (!option.gitSSH) throw new Error('Missing gitSSH')
  if (!option.brand) option.brand = new Date().getTime().toString()
  else option.brand = getSlug(option.brand)

  let times = 0
  const before = Date.now();
  const warnCLI = (mgs = '') => {
    const after = Date.now();
    console.warn(`________________________`)
    console.warn(`[${++times}/6]: ${option.folderPath}`, `(${(after - before) / 1000}s)`)
    console.warn(`[LOADING]:  ${mgs}`)
    return mgs
  }
  // @todo: os: win?, ubuntu?
  const getShellOption = (cwd) => ({ cwd: cwd, shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: true })

  shell.exec(warnCLI(`git init`), getShellOption(option.folderPath))
  shell.exec(warnCLI(`git remote add origin ${option.gitSSH}`), getShellOption(option.folderPath))
  shell.exec(warnCLI(`git checkout -b ${option.brand}`), getShellOption(option.folderPath))
  shell.exec(warnCLI(`git add .`), getShellOption(option.folderPath))
  shell.exec(warnCLI(`git commit -m "${option.brand}"`), getShellOption(option.folderPath))
  const pushMessage = shell.exec(warnCLI(`git push -f --set-upstream origin ${option.brand}`), getShellOption(option.folderPath))
  if (pushMessage.code === 0) {
    if (option.removeFolder) {
      shell.exec(warnCLI(`rm -rf ${option.folderPath}`), getShellOption(option.folderPath))
    } else {
      shell.exec(warnCLI(`rm -rf ${path.join(option.folderPath, '.git')}`), getShellOption(option.folderPath))
    }
    const [userName, gitName] = option.gitSSH.replace(/^(.*):|\.git/gm, '').split('/')
    const brandRaw = `https://raw.githubusercontent.com/${userName}/${gitName}/${option.brand}/`
    console.log(brandRaw)
    return brandRaw
  } else {
    console.log(pushMessage)
    shell.exec(warnCLI(`rm -rf ${path.join(option.folderPath, '.git')}`), getShellOption(option.folderPath))
    fs.writeFileSync(option.errorPath, JSON.stringify(pushMessage), {encoding: "utf8"})
  }
  return false
}

const genLocalFolder = folderName => {
  const temp = process.env.mytemp || process.env.TEMP
  const general = path.join(temp, '__general__')
  const pathLocalFolderChapter = path.join(general, folderName)
  if (!fs.existsSync(pathLocalFolderChapter)){
    fs.mkdirSync(pathLocalFolderChapter, { recursive: true });
  }
  return pathLocalFolderChapter
}

const getManifestStoryPath = storyItem => {
  return path.join(genLocalFolder(`manifest/${storyItem.id}`), 'index.json')
}

const setManifestStoryData = storyItem => {
  try {
    fs.writeFileSync(getManifestStoryPath(storyItem), JSON.stringify(storyItem), 'utf-8')
  } catch (error) {
    console.log('setManifestStoryData', error)
    return false 
  }
   return true 
}

const getGroupChapterpath = option => {
  return path.join(genLocalFolder(`group`), option.groupFN)
}

const setGroupChapterData = option => {
  try {
    fs.writeFileSync(getGroupChapterpath(option), JSON.stringify(option.group), 'utf-8')
  } catch (error) {
    console.log('setGroupChapterData', error)
    return false 
  }
  return true
}

export {
  axiosProxy,
  axiosNomal,
  cheerioLoad,
  trimValue,
  getHash,
  getSlug,
  forceFunction,
  upFolder2Git,
  genLocalFolder,
  getManifestStoryPath,
  setManifestStoryData,
  setGroupChapterData
}