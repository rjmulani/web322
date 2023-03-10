const fs = require('fs');


const fetchFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('imagelist.txt', (err, data) => {
            if (err) {
                reject(err);
            }
            const fileNames = data.toString().split('\n');
            const namesWithExtension = fileNames.filter(name => name.length > 0);
            const namesWithoutExtension = namesWithExtension.map(name => name.split('.')[0]);
            resolve({ namesWithExtension, namesWithoutExtension });
        });
    });
};

module.exports = { fetchFile };