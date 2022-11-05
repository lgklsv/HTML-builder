const fs = require('fs');
const fsP = fs.promises;
const path = require('path');
const k = 1000;

async function indexFiles() {
    try {
        const files = await fsP.readdir(path.join(__dirname, './secret-folder'));
        for (const file of files) {
            fs.stat(path.join(__dirname, './secret-folder', `./${file}`), (error, stats) => {
                if (error) {
                  console.log(error);
                }
                else {
                  if (!stats.isDirectory()) {
                    const bytes = stats.size;
                    const i = bytes / k;
                    const fileSize = `${i.toFixed(3)}kb`; 
                    const extention = path.extname(file).slice(1);
                    const fileName = path.parse(file).name;
                    console.log(`${fileName} - ${extention} - ${fileSize}`);
                  }
                }
            });
        }
    } catch (err){
        console.error(err);
    }
}
indexFiles();