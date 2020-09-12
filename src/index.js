'use strict';

const fs = require("fs");
const path = require("path");

const SRC_DIR = process.argv[2] ? path.join(process.cwd(), path.relative(process.cwd(), process.argv[2])) : process.cwd();
const OUTPUT_DIR = process.argv[3] ? path.join(process.cwd(), path.relative(process.cwd(), process.argv[3])) : SRC_DIR;

const register = function (dirPath) {
  const dirs = [];
  const files = [];

  const paths = fs.readdirSync(dirPath);

  for (let nextPath of paths) {

    const isDirectory = fs.statSync(path.normalize(path.join(dirPath, nextPath))).isDirectory();
    if (nextPath[0] === '.' || (!isDirectory
      && !nextPath.includes('.js.md')
      && !nextPath.includes('.css.md')
      && !nextPath.includes('.html.md'))) { continue; }


    if (isDirectory) {

      const subDir = register(path.normalize(path.join(dirPath, nextPath)));
      if (subDir) {
        dirs.push(subDir);
      };

    } else {
      const fileData = {
        path: '/' + nextPath,
      };
      files.push(fileData);
    }
  };

  const noSource = files.length === 0 && dirs.length === 0;
  if (noSource) {
    return null;
  };

  const virDir = {
    path: '/' + dirPath
      .split(path.sep).join('/')
      .split('/').pop(),
  };

  if (dirs.length > 0) { virDir.dirs = dirs; }
  if (files.length > 0) {
    const readme = files
      .find(fileObj => fileObj.path.toLowerCase() === '/readme.html')
    if (readme) {
      virDir.files = files
        .filter(fileObj => fileObj !== readme);
      virDir.files.unshift(readme)
    } else {
      virDir.files = files;
    }
  };

  return virDir;
};


console.log('\n--- registering .js/css/html.md files in ' + SRC_DIR + ' ---\n');

const registered = register(SRC_DIR);



console.log('\n--- writing buildd source ---\n');



const build = (virDir, joinedPath, indent) => {
  indent = indent || '';
  joinedPath = joinedPath || '';

  virDir.dirs && virDir.dirs
    .forEach(subDir => {
      build(subDir, joinedPath + subDir.path, indent + '  ');
    })

  virDir.files && virDir.files
    .forEach(file => {
      const srcPath = path.join(SRC_DIR, joinedPath, file.path);
      fs.readFile(srcPath, 'utf-8', (err, content) => {

        if (err) {
          console.error(err);
          return;
        }
        let build = '';
        let blocks = 1;
        const keepCode = (commentTemplate) => (_, code) => {
          build += commentTemplate(blocks) +
            code +
            '\n';
          blocks++;
        };
        if (srcPath.includes('.js')) {
          content.replace(/```js([\s\S]*?)```/gim, keepCode((num) => `// fence ${num}`));
        }
        else if (srcPath.includes('.html')) {
          content.replace(/```html([\s\S]*?)```/gim, keepCode((num) => `<!-- fence ${num} -->`));
        }
        else if (srcPath.includes('.css')) {
          content.replace(/```css([\s\S]*?)```/gim, keepCode((num) => `/* fence ${num} */`));
        }

        const outputPath = path.join(OUTPUT_DIR, joinedPath, file.path.split('.md').join(''));
        fs.writeFile(outputPath, build, () => console.log(`built: ${file.path} --> ${file.path.split('.md').join('')}`))
      });
    })

}

build(registered);







