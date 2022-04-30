"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
if (process.argv.length !== 3) {
    console.log('Please, specify a file');
}
else {
    const filename = process.argv[2];
    (0, fs_1.access)(filename, fs_1.constants.F_OK, (err) => {
        if (err) {
            console.log(`File ${filename} does not exist`);
        }
        else {
            console.log(`Starting to watch file ${filename}`);
            const watcher = (0, fs_1.watch)(process.argv[2]);
            console.log(console.trace());
            watcher.on('change', () => {
                console.log(console.trace());
                console.log(`File ${filename} has been modified somehow`);
            });
            console.log(console.trace());
            console.log(`File ${filename} is no longer watched`);
        }
    });
}
