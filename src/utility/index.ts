import axios from 'axios'
import { load as cheerioLoad } from 'cheerio'
import md5 from 'crypto-js/md5';
import getSlug from 'slug'

const trimValue = s => (s || '').trim()
const getHash = s => s && md5(trimValue(s)).toString()

export {
  axios,
  cheerioLoad,
  trimValue,
  getHash,
  getSlug
}