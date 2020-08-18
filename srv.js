/* jshint esversion: 9 */
var http = require('http');
var fs = require('fs');

var filePathA = "./abc.json";
var filePathX = "./xyz.json";
var fA = fs.readFileSync(filePathA);
console.log(`** ABC file contains: ${fA} **`);
var fX = fs.readFileSync(filePathX);
console.log(`** XYZ file contains: ${fX} **`);

console.log(`This is after initial reading...`);

fs.watchFile(filePathA, function (curr, prev) {
  console.log(`** ABC file has changed **`);
  fA = fs.readFileSync(filePathA);
  console.log(`** ABC file contains: ${fA} **`);
});
fs.watchFile(filePathX, function (curr, prev) {
  console.log(`** ABC file has changed **`);
  fX = fs.readFileSync(filePathX);
  console.log(`** XYZ file contains: ${fX} **`);
});

function page(h,j,k) {
  var output = '';
  output += `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JSON Demo</title>
</head>
<body>
  <h1 id="head"></h1>
  <div id="list"></div>
  <script>
    var list = ${j};
    function enumList() {
      var out = '<ul>';
      list.forEach(element => {
        out += '<li>' + element.${k[0]} + '</li>';
      });
      out += '</ul>';
      return out;
    }
    document.getElementById('head').innerText = '${h}';
    document.getElementById('list').innerHTML = enumList();
  </script>
</body>
</html>
`;
  return output;

}

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  console.log(`Incoming request: ${req.url}`);
  switch(req.url) {
    case '/abc':
      res.write(page('Animals', fA, Object.keys(JSON.parse(fA)[0])));
      break;
    case '/xyz':
      res.write(page('Professions', fX, Object.keys(JSON.parse(fX)[0])));
      break;
    default:
      // code block
  }
  res.end();
}).listen(8080);