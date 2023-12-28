py-ts-interfaces ../server/utils.py -o api-types.ts
rm dist/index.html
rm dist/main.js
webpack --mode=development
echo '<!DOCTYPE html>' > dist/index.html
echo '<html lang="en">' >> dist/index.html
echo '<head>' >> dist/index.html
echo '<meta charset="UTF-8">' >> dist/index.html
echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">' >> dist/index.html
echo '<title>Request Analyzer</title>' >> dist/index.html
echo '</head>' >> dist/index.html    
echo '<body>' >> dist/index.html    
echo '<div id="root"></div>' >> dist/index.html    
echo '<script>' >> dist/index.html    
cat dist/main.js >> dist/index.html
echo '</script>' >> dist/index.html
echo '</body>' >> dist/index.html
echo '</html>' >> dist/index.html
rm dist/main.js
rm dist/main.js.LICENSE.txt