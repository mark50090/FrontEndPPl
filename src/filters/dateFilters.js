import Vue from "vue";

(function () {
  //for dd/mm/yyyy date format
  //for date object format
  Vue.filter('fulldate', function (value) {
    if(!value)
      return "";
    var dateObj = value
    
    if (typeof value == "string") {
      if (!/^(?:[\+-]?\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[\.,]\d+(?!:))?)?(?:\2[0-5]\d(?:[\.,]\d+)?)?(?:[zZ]|(?:[\+-])(?:[01]\d|2[0-3]):?(?:[0-5]\d)?)?)?)?$/.test(value)) {
        return "";
      }
      dateObj = new Date(value);
    }
    if (!dateObj || dateObj.constructor.name != "Date" ) {
      return "";
    }
    if(sessionStorage.page_lang == 'th'){
      const dateMonthYear  = new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok'}).format(dateObj) //era for พ.ศ.
      const hourMinute = new Intl.DateTimeFormat('th-TH', {hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Bangkok' }).format(dateObj)
      return `${dateMonthYear} เวลา ${hourMinute} น.`
    }
    else if(sessionStorage.page_lang == 'en'){
      const dateMonthYear  = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok'}).format(dateObj) //era for พ.ศ.
      const hourMinute = new Intl.DateTimeFormat('en', {hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Bangkok' }).format(dateObj)
      return `${dateMonthYear} ${hourMinute}`
    }
  })
})()