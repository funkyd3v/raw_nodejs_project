// dependencies
const fs = require('fs');
const path = require('path');
const { callbackify } = require('util');

// module-scaffolding
const lib = {};

// base path
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = function(dir, file, data, callback){
    fs.open(lib.basedir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing the new file!');
                        }
                    });
                }else{
                    callback('Error to writing!');
                }
            });
        } else {
            callback('Could not create new file!');
        }
    })
}

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    })
}

// update data to the file
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            // write to the file
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback('Error closing file')
                                }
                            })
                        } else {
                           callback('Error writing to file') 
                        }
                    })
                } else {
                    console.log('Error truncating file');
                }
            });
        } else {
            console.log('Could not update the file, the file may not exist!')
        }
    });
}

// delete file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            console.log(`Error deleting file`);
        }
    })
}

module.exports = lib;