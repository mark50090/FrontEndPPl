import Vue from "vue";

(function () {
  //for dd/mm/yyyy date format
  //for date object format
  /**
   * @returns {string} 20 พฤศจิกายน 2564 เวลา 17:01 น.
   */
  // var dateObj = ''
  function isDate(value) {
    if (!value)
      return false;
    var dateObj = value

    if (typeof value == "string") {
      if (!/^(?:[\+-]?\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[\.,]\d+(?!:))?)?(?:\2[0-5]\d(?:[\.,]\d+)?)?(?:[zZ]|(?:[\+-])(?:[01]\d|2[0-3]):?(?:[0-5]\d)?)?)?)?$/.test(value)) {
        return false;
      }
      dateObj = new Date(value);
    }
    if (!dateObj || dateObj.constructor.name != "Date") {
      return false;
    }
    return true
  }

  Vue.filter('fulldate', function (value) {
    if (!isDate(value))
      return ""
    var dateObj = new Date(value);
    
    if(sessionStorage.page_lang == 'th'){
      const dateMonthYear  = new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok'}).format(dateObj) //era for พ.ศ.
      const hourMinute = new Intl.DateTimeFormat('th-TH', {hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Bangkok' }).format(dateObj)
      return `${dateMonthYear} เวลา ${hourMinute} น.`
    }
    else if(sessionStorage.page_lang == 'en'){
      const dateMonthYear  = new Intl.DateTimeFormat('en-uk', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok'}).format(dateObj) //era for พ.ศ.
      const hourMinute = new Intl.DateTimeFormat('en-uk', {hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Bangkok' }).format(dateObj)
      return `${dateMonthYear} ${hourMinute}`
    }
  })


  /**
   * @returns {string} 20/11/2021
   */
  Vue.filter('shortdate', function (value) {
    if (!isDate(value))
      return ""
    var dateObj = new Date(value);
    if(sessionStorage.page_lang == 'en') var currentLang = 'en-uk'
    else if(sessionStorage.page_lang == 'th') var currentLang = 'th'
    const dateMonthYear = new Intl.DateTimeFormat(currentLang, { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Bangkok' }).format(dateObj) //era for พ.ศ.
    return `${dateMonthYear}`
  })
})()