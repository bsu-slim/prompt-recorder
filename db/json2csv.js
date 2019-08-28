module.exports = (objArray) => {
  let a = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  for(let index in a[0]) {
    if(str !== '') str += ',';
    str += index;
  }

  str += '\r\n';
  
  for(let i = 0; i < a.length; i++) {
    let l = '';
    for(let index in a[i]) {
      if(l !== '') l += ',';
      l += a[i][index]
    }
    str += l + '\r\n';
  }
  return str;
}