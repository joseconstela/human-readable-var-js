;(function (global) {
  'use strict';

  /**
   * Contains the lib cache
   * @type {Object}
   *
   * {
   *  collectionName: {name:typesName}
   * }
   */
  var cache = {}

  /**
   * Convert function for each datatype
   *
   * @type {Object}
   */
  var types = {
    'Object': {
      simple: (data) => {
        return '<pre>'+JSON.stringify(data, null, 2)+'</pre>'
      }
    },
    'boolean': { // typeof === 'boolean'
      simple: (data) => {
        return (data ? '✅ ' : '❌ ') +  data
      }
    },
    'address': { // object containing lat & lon properties
      simple: (data) => {
        return link(
          'https://www.openstreetmap.org/#map=5/',
          `${data.lat}/${data.lng}`,
          `📍 ${data.lat.toFixed(2)}/${data.lng.toFixed(2)}`
        )
      }
    }
  }

  /**
   * Returns an html a markup
   *
   * @param  {String} url    href attribute prefix
   * @param  {String} suffix href attribute suffix
   * @param  {String} text   a's text
   * @param  {Object} attrs  a's attributed
   * @return {String}        The a's html markup
   */
  var link = (url, sufix, text, attrs) => {
    if (!attrs) attrs = {target:'_blank'}
    if (!attrs.target) attrs.target = '_blank'

    return `<a href="${url}${sufix}" target="${attrs.target}">${text}</a>`
  }

  /**
  * @summary Constructor
  */
  function humanReadable () {
    if (!(this instanceof humanReadable)) {
      return new humanReadable();
    }

    return this;
  };

  /**
   * Stores a value in the cache
   *
   * @param  {String} value   The value to store
   * @param  {String} name    The property value belongs to
   * @param  {String} context The collection name belongs to
   * @return {String}         To stored value
   */
  var storeCache = (value, name, context) => {
    if (!value) return false

    if (!cache[context]) cache[context] = {}
    cache[context][name] = value

    return value
  }

  /**
   * Given the variable to process, returns its type name and stores the result in
   * the cache
   *
   * @param  {} data          The variable to process
   * @param  {String} name    The property value belongs to
   * @param  {String} context The collection name belongs to
   * @return {String}         The variable's type
   */
  var process = (data, name, context) => {
    var r = null

    var tof = typeof data

    if (tof === 'object') {
      r = 'Object'

      if (!!data.lat && !!data.lng) r = 'address'
    } else if (tof === 'boolean') {
      r = tof
    }

    return name ? storeCache(r, name, context) : r
  }

  /**
   * Checks if the variable to convert exists in cache and returns it,
   * or process it if not.
   *
   * @param  {} data          The variable to process
   * @param  {String} name    The property value belongs to
   * @param  {String} context The collection name belongs to
   * @return {Sting}          Returns the value type's name
   */
  var getType = (value, name, context) => {
    var r = checkCache(value, name, context)
    return r ? r : process(value, name, context)
  }

  /**
   * Checks if a name exists in cache.
   *
   * @param  {String} name    The property value belongs to
   * @param  {String} context The collection name belongs to
   * @return {[type]}         [description]
   */
  var checkCache = (name, context) => {
    return !!cache[context] && !!cache[context][name] ? cache[context][name] : false
  }

  /**
   * Makes the variable conversion with the 'simple' conversion.
   *
   * @param  {} data          The variable to process
   * @param  {String} name    The property value belongs to
   * @param  {String} context The collection name belongs to
   * @return {String}         The conversion's result
   */
  humanReadable.prototype.simple = (value, name, context) => {
    var t = getType(value, name, context)

    if (!!types[t] && !!types[t].simple) {
      return types[t].simple(value)
    } else {
      return value
    }
  }

  if (typeof define === 'function' && define.amd) {
    // AMD
    define(function () {
      return humanReadable();
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    // Node and other CommonJS-like environments that support module.exports.
    module.exports = humanReadable();
  } else {
    //Browser.
    global.humanReadable = humanReadable();
  }

})(this);
