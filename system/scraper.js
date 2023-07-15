const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')
global.creator = `@neoxr.js – Wildan Izzudin`

module.exports = class Scraper {
   /* Chat AI
    * @param {String} bid
    * @param {String} key
    * @param {String} text
    */
   chatAI = (bid, key, text) => {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.get('http://api.brainshop.ai/get?bid=' + bid + '&key=' + key + '&uid=neoxr&msg=' + encodeURI(text))).data
            if (typeof json.cnt == 'undefined') return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.cnt
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* Simsimi Chat
    * @param {String} text
    */
   simsimi = (text, lang = 'id') => {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.post('https://simsimi.vn/web/simtalk', `text=${encodeURI(text)}&lc=${lang}`, {
               headers: {
                  'Accept': '*/*',
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Referer': 'https://simsimi.net/',
                  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36'
               }
            })).data
            if (json.success.match(new RegExp('Aku tidak mengerti', 'g'))) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.success
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* Simsimi Chat V2
    * @param {String} text
    */
   simsimiV2 = (text) => {
      return new Promise(async (resolve) => {
         try { // https://simsimi.net/ & https://simsimi.info
            let json = await (await axios.get('https://api.simsimi.net/v2/?text=' + encodeURI(text) + '&lc=id')).data
            if (json.success.match(new RegExp('Aku tidak mengerti', 'g'))) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.success
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* URL Shortener
    * @param {String} url
    */
   shorten = (url) => {
      return new Promise(async (resolve) => {
         try {
            let params = new URLSearchParams()
            params.append('url', url)
            let json = await (await fetch('https://s.nxr.my.id/api', {
               method: 'POST',
               body: params
            })).json()
            if (json.error) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: 'https://s.nxr.my.id/r/' + json.data.code
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* Image Uploader (freeimage.host) [Permanent]
    * @param {Buffer} buffer
    */
   uploadImage = async input => {
      return new Promise(async resolve => {
         try {
            const image = Buffer.isBuffer(input) ? input : input.startsWith('http') ? await (await axios.get(input, {
               responseType: 'arraybuffer'
            })).data : input
            let form = new FormData
            form.append('source', Buffer.from(image), 'image.jpg')
            form.append('type', 'file')
            form.append('action', 'upload')
            form.append('timestamp', (new Date() * 1))
            form.append('auth_token', '3b0ead89f86c3bd199478b2e14afd7123d97507f')
            form.append('nsfw', 0)
            const json = await (await axios.post('https://freeimage.host/json', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://freeimage.host",
                  "Referer": "https://freeimage.host/",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest",
                  ...form.getHeaders()
               }
            })).data
            if (json.status_code != 200) return resolve({
               creator: global.creator,
               status: false,
               msg: `Failed to Upload!`
            })
            resolve({
               creator: global.creator,
               status: true,
               original: json,
               data: {
                  url: json.image.url
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* Image Uploader V2 (707a8191-3fe9-4568-a03e-763edd45f0bb.id.repl.co) [Temp]
    * @param {Buffer} buffer
    */
   uploadImageV2 = (buffer) => {
      return new Promise(async (resolve, reject) => {
         try {
            const server = await (await axios.get('https://neoxr.my.id/srv')).data
            const {
               ext
            } = await fromBuffer(buffer)
            let form = new FormData
            form.append('someFiles', buffer, 'tmp.' + ext)
            let json = await (await fetch(server.api_path, {
               method: 'POST',
               body: form
            })).json()
            resolve(json)
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* Image Uploader (telegra.ph)
    * @param {Buffer} buffer
    */
   uploadImageV3 = async (str) => {
      return new Promise(async resolve => {
         try {
            const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
               responseType: 'arraybuffer'
            })).data : str
            const {
               ext
            } = await fromBuffer(image)
            let form = new FormData
            form.append('file', Buffer.from(image), 'image.' + ext)
            const json = await (await axios.post('https://telegra.ph/upload', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://telegra.ph",
                  "Referer": "https://telegra.ph",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest",
                  ...form.getHeaders()
               }
            })).data
            if (!json || json.length < 1) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Failed to upload!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: 'https://telegra.ph' + json[0].src
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* File Uploader (707a8191-3fe9-4568-a03e-763edd45f0bb.id.repl.co) [Permanent]
    * @param {Buffer} buffer
    */
   uploadFile = (buffer) => {
      return new Promise(async (resolve, reject) => {
         try {
            const server = await (await axios.get('https://neoxr.my.id/srv')).data
            const {
               ext
            } = await fromBuffer(buffer)
            let form = new FormData
            form.append('someFiles', buffer, 'file.' + ext)
            let json = await (await fetch(server.api_path, {
               method: 'POST',
               body: form
            })).json()
            resolve(json)
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* Temp File Upload (file.io)
    * @param {Buffer} buffer
    * @param {String} name
    */
   uploadFileV2 = (buffer, name) => {
      return new Promise(async (resolve) => {
         try {
            if (!Buffer.isBuffer(buffer)) return resolve({
               status: false
            })
            let {
               ext
            } = await fromBuffer(buffer) || {}
            let extention = (typeof ext == 'undefined') ? 'txt' : ext
            let form = new FormData
            form.append('file', buffer, name + '.' + extention)
            const json = await (await fetch('https://file.io/', {
               method: 'POST',
               headers: {
                  Accept: '*/*',
                  'Accept-Language': 'en-US,enq=0.9',
                  'User-Agent': 'GoogleBot'
               },
               body: form
            })).json()
            if (!json.success) return resolve({
               creator: global.creator,
               status: false
            })
            delete json.success
            delete json.status
            resolve({
               creator: global.creator,
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* To Video (EzGif)
    * @param {String|Buffer} str
    */
   toVideo = async (str) => {
      return new Promise(async resolve => {
         try {
            const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
               responseType: 'arraybuffer'
            })).data : str
            let form = new FormData
            form.append('new-image', Buffer.from(image), 'image.webp')
            form.append('new-image-url', '')
            const html = await (await axios.post('https://s7.ezgif.com/webp-to-mp4', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://ezgif.com",
                  "Referer": "https://ezgif.com/webp-to-mp4",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest",
                  ...form.getHeaders()
               }
            })).data
            const $ = cheerio.load(html)
            let File = $('#main > form').find('input[type=hidden]:nth-child(1)').attr('value')
            let token = $('#main > form').find('input[type=hidden]:nth-child(2)').attr('value')
            let Submit = $('#tool-submit-button').find('input').attr('value')
            const Format = {
               file: File,
               token: token,
               convert: Submit
            }
            const proc = await (await axios({
               url: "https://ezgif.com/webp-to-mp4/" + File,
               method: "POST",
               data: new URLSearchParams(Object.entries(Format)),
               headers: {
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://ezgif.com",
                  "Referer": "https://ezgif.com/webp-to-mp4",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                  "accept-language": "en-US,en;q=0.9,id;q=0.8",
                  "content-type": "application/x-www-form-urlencoded",
                  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\""
               }
            })).data
            const link = cheerio.load(proc)('#output > p.outfile').find('video > source').attr('src')
            if (!link) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Failed to convert!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: 'https:' + link
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }
   
   /* To JPEG / JPG
    * @param {String|Buffer} str
    */
   toJpg = async (str) => {
      return new Promise(async resolve => {
         try {
            const parse = await (await axios.get('https://tiny-img.com/webp/'))
            const cookie = parse.headers['set-cookie'].join('; ')
            const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
               responseType: 'arraybuffer'
            })).data : str
            let form = new FormData
            form.append('file', Buffer.from(image), (Math.random() + 1).toString(36).substring(7) + '.webp')
            const json = await (await axios.post('https://tiny-img.com/app/webp-files/', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://tiny-img.com/",
                  "Referer": "https://tiny-img.com",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  cookie,
                  ...form.getHeaders(),
                  "x-requested-with": "XMLHttpRequest"
               }
            })).data
            if (!json.success) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Failed to convert!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: json.optimized_image_url
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }
}