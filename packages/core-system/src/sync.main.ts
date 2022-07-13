import { AppDataSource } from "./data-source"
import { Story } from "./entity/Story";
import { In } from "typeorm";
import * as UTIL from './source-story'

const args = require('args-parser')(process.argv)
// inject env
Object.keys(args).forEach(k => {
  if (!process.env[k]) {
    process.env[k] = args[k]
  }
})

const init = async () => {
}

const main = async () => {
  /**
    * * follow:
    * * DK STORY
    * * DK CHAPTER
    * * DK ...
    * * >> QUERY
   * 
  */
}

AppDataSource.initialize().then(main).catch(error => {
  console.log(error)
})

// npm run sync:main