module.exports = class Queue {
   constructor(delay) {
      this.items = []
      this.delay = delay
   }
   enqueue = item => this.items.push(item)
   dequeue = () => {
      if (this.count() > 0) this.items.shift()
   }
   peek = async (access = false) => {
      if (!access) {
         await new Promise(resolve => setTimeout(resolve, this.delay * 1000))
         if (this.count() > 0) return this.items[0]
         return !1
      } else {
         await new Promise(resolve => setTimeout(resolve, 1500))
         if (this.count() > 0) return this.items[0]
         return !1
      }
   }
   count = () => this.items.length
}