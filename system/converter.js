const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

module.exports = class Converter {
   ffmpeg = (buffer, args = [], ext = '', ext2 = '') => {
      return new Promise(async (resolve, reject) => {
         try {
            let tmp = 'temp/' + new Date + '.' + ext
            let out = tmp + '.' + ext2
            await fs.promises.writeFile(tmp, buffer)
            spawn('ffmpeg', [
                  '-y',
                  '-i', tmp,
                  ...args,
                  out
               ])
               .on('error', reject)
               .on('close', async (code) => {
                  try {
                     await fs.promises.unlink(tmp)
                     if (code !== 0) return reject(code)
                     resolve(await fs.promises.readFile(out))
                     await fs.promises.unlink(out)
                  } catch (e) {
                     reject(e)
                  }
               })
         } catch (e) {
            reject(e)
         }
      })
   }

   /**
    * Convert Audio to Playable WhatsApp Audio
    * @param {Buffer} buffer Audio Buffer
    * @param {String} ext File Extension 
    */
   toAudio = (buffer, ext) => {
      return this.ffmpeg(buffer, [
         '-vn',
         '-ac', '2',
         '-b:a', '128k',
         '-ar', '44100',
         '-f', 'mp3'
      ], ext, 'mp3')
   }

   /**
    * Convert Audio to Playable WhatsApp PTT
    * @param {Buffer} buffer Audio Buffer
    * @param {String} ext File Extension 
    */
   toPTT = (buffer, ext) => {
      return this.ffmpeg(buffer, [
         '-vn',
         '-c:a', 'libopus',
         '-b:a', '128k',
         '-vbr', 'on',
         '-compression_level', '10'
      ], ext, 'opus')
   }

   /**
    * Convert Audio to Playable WhatsApp Video
    * @param {Buffer} buffer Video Buffer
    * @param {String} ext File Extension 
    */
   toVideo = (buffer, ext) => {
      return this.ffmpeg(buffer, [
         '-c:v', 'libx264',
         '-c:a', 'aac',
         '-ab', '128k',
         '-ar', '44100',
         '-crf', '32',
         '-preset', 'slow'
      ], ext, 'mp4')
   }
}