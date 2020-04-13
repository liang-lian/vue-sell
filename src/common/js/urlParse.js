/**
 * 获取url参数
 * 比如： ?id=123&a=b
 * 返回  Object   {id: 123, a: b}
 */

export function urlParse () {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['id=123', 'a=b']
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substr(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
