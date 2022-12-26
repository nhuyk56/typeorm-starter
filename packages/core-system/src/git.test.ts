/**
 * mục đích: hoàn thiện follow function git for push items
 * các dùng: node tên file.js
 * after done: rename to .ts
 */
import Axios from 'axios'
import fs from 'fs'
import shell from 'shelljs'
import { load as cheerioLoad } from 'cheerio'
import md5 from 'crypto-js/md5';
import getSlug from 'slug'
import { SocksProxyAgent } from 'socks-proxy-agent';
import path from 'path';

const pushGitV2 = async ({
  folderTarget = '', // folder cần push
  gitSshTarget = '', // git sẽ chứa folder này
  gBrandTarget = '', // brand sẽ chứa folder này
  logFolder = '', // folder trên local chứa log này
  hasRmFolder = true, // remove folder này khi done
  hasExportFile = false // remove folder này khi done
}) => {
  /**
   * [input]
  //  * folderTarget: C:\Users\YNN\AppData\Local\Temp\folderName
  //  * logFolder: C:\Users\YNN\logFolder
  //  * gitSshTarget: git@github.com:userABC/gitABC.git
  //  * brand: (string/null), null then >>> hashMD5(new date time() + ramdom)
  //  * hasExportFile
  //  * hasRmFolder
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
   * [outputFile]
    array: [https://raw.githubusercontent.com/${userABC}/${gitABC}/${brand}/${fileName}]
   *-----------------------------------------------------------------------
   * [outputFunction]
    array: [https://raw.githubusercontent.com/${userABC}/${gitABC}/${brand}/${fileName}]
   *-----------------------------------------------------------------------
   * [use]
   * {prefix}/{fileName}
  */

  if (!folderTarget) throw new Error('Missing folderPath')
  else if (!fs.existsSync(folderTarget)) throw new Error(`folderPath ${folderTarget} not exist!`)
  if (!gitSshTarget) throw new Error('Missing gitSSH')
  if (!gBrandTarget) gBrandTarget = new Date().getTime().toString()
  else gBrandTarget = getSlug(gBrandTarget)

  let times = 0
  const before = Date.now();
  const warnCLI = (mgs = '') => {
    const after = Date.now();
    console.warn(`________________________`)
    console.warn(`[${++times}/6]: ${folderTarget}`, `(${(after - before) / 1000}s)`)
    console.warn(`[LOADING]:  ${mgs}`)
    return mgs
  }
  // @todo: os: win?, ubuntu?
  const getShellOption = (cwd) => ({ cwd: cwd, shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: true })

  /** prepair output */
  const [gUserName, gName] = gitSshTarget.replace(/^(.*):|\.git/gm, '').split('/')
  const gPrefix = `https://raw.githubusercontent.com/${gUserName}/${gName}/${gBrandTarget}/`
  const filesName = fs.readdirSync(folderTarget)
  const gFilesName = filesName.map(fileName => `${gPrefix}${fileName}`)

  /** git start */
  shell.exec(warnCLI(`git init`), getShellOption(folderTarget))
  shell.exec(warnCLI(`git remote add origin ${gitSshTarget}`), getShellOption(folderTarget))
  shell.exec(warnCLI(`git checkout -b ${gBrandTarget}`), getShellOption(folderTarget))
  shell.exec(warnCLI(`git add .`), getShellOption(folderTarget))
  shell.exec(warnCLI(`git commit -m "${gBrandTarget}"`), getShellOption(folderTarget))
  const pushMessage = shell.exec(warnCLI(`git push -f --set-upstream origin ${gBrandTarget}`), getShellOption(folderTarget))
  if (pushMessage.code === 0) {
    // case push success
    if (hasRmFolder) {
      shell.exec(warnCLI(`rm -rf "${folderTarget}"`), getShellOption(process.env.Temp))
    } else {
      shell.exec(warnCLI(`rm -rf "${path.join(folderTarget, '.git')}"`), getShellOption(folderTarget))
    }
    // export file
    if (hasExportFile) {
      fs.writeFileSync(`${folderTarget}.outGit`, JSON.stringify(gFilesName), {encoding: "utf8"})
    }
    const logFileSuccess = path.join(logFolder, `${gBrandTarget}.success.txt`)
    fs.writeFileSync(logFileSuccess, JSON.stringify({ pushMessage, folderTarget, gitSshTarget, gBrandTarget, logFolder, hasRmFolder, hasExportFile }), {encoding: "utf8"})
    
    return gFilesName
  } else {
    // case push failed
    const logFileFailed = path.join(logFolder, `${gBrandTarget}.failed.txt`)
    console.log(pushMessage, 'saved at', logFileFailed)
    shell.exec(warnCLI(`rm -rf "${path.join(folderTarget, '.git')}"`), getShellOption(folderTarget))
    fs.writeFileSync(logFileFailed, JSON.stringify({ pushMessage, folderTarget, gitSshTarget, gBrandTarget, logFolder, hasRmFolder, hasExportFile }), {encoding: "utf8"})
  }
  return false
}

pushGitV2({
  folderTarget: 'C:/Users/ynguy/AppData/Local/Temp/git-test/folderTarget',
  gitSshTarget: 'git@github.com----nhuyk56:nhuyk56/SyncStorage1.git',
  gBrandTarget: 'test-26-12-2022',
  logFolder: 'C:/Users/ynguy/AppData/Local/Temp/git-test/logFolder',
  hasRmFolder: true,
  hasExportFile: true
})