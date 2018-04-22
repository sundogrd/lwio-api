const path = require('path')
const fs = require('fs')
const util = require('util')
const EventEmitter = require('events').EventEmitter

/**
 * To walk a directory. It's complicated (but it's async, so it must be fast).
 *
 * @param root {String} the directory to start with
 */
function Walker (root) {
  if (!(this instanceof Walker)) return new Walker(root)
  EventEmitter.call(this)
  this._pending = 0
  this._filterDir = function () { return true }
  this.go(root)
}
util.inherits(Walker, EventEmitter)

/**
 * Setup a function to filter out directory entries.
 *
 * @param fn {Function} a function that will be given a directory name, which
 * if returns true will include the directory and it's children
 */
Walker.prototype.filterDir = function (fn) {
  this._filterDir = fn
  return this
}

/**
 * Process a file or directory.
 */
Walker.prototype.go = function (entry) {
  var that = this
  this._pending++

  fs.lstat(entry, function (er, stat) {
    if (er) {
      that.emit('error', er, entry, stat)
      that.doneOne()
      return
    }

    if (stat.isDirectory()) {
      if (!that._filterDir(entry, stat)) {
        that.doneOne()
      } else {
        fs.readdir(entry, function (er, files) {
          if (er) {
            that.emit('error', er, entry, stat)
            that.doneOne()
            return
          }

          that.emit('entry', entry, stat)
          that.emit('dir', entry, stat)
          files.forEach(function (part) {
            that.go(path.join(entry, part))
          })
          that.doneOne()
        })
      }
    } else if (stat.isSymbolicLink()) {
      that.emit('entry', entry, stat)
      that.emit('symlink', entry, stat)
      that.doneOne()
    } else if (stat.isBlockDevice()) {
      that.emit('entry', entry, stat)
      that.emit('blockDevice', entry, stat)
      that.doneOne()
    } else if (stat.isCharacterDevice()) {
      that.emit('entry', entry, stat)
      that.emit('characterDevice', entry, stat)
      that.doneOne()
    } else if (stat.isFIFO()) {
      that.emit('entry', entry, stat)
      that.emit('fifo', entry, stat)
      that.doneOne()
    } else if (stat.isSocket()) {
      that.emit('entry', entry, stat)
      that.emit('socket', entry, stat)
      that.doneOne()
    } else if (stat.isFile()) {
      that.emit('entry', entry, stat)
      that.emit('file', entry, stat)
      that.doneOne()
    } else {
      that.emit('error', new TypeError('The type of this file could not be determined.'), entry, stat)
      that.doneOne()
    }
  })
  return this
}

Walker.prototype.doneOne = function () {
  if (--this._pending === 0) this.emit('end')
  return this
}

module.exports = Walker
