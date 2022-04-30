"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const child_process_1 = require("child_process");
class cat_greep {
    constructor(fname, word) {
        this.fname = fname;
        this.word = word;
    }
    run() {
        if (this.f_exist()) {
            const cat = (0, child_process_1.spawn)('cat', [this.fname]);
            const grep = (0, child_process_1.spawn)('grep', [this.word]);
            cat.stdout.pipe(grep.stdin);
            grep.stdout.on('data', (info) => {
                const data = info.toString('utf8');
                const aux = data.split(/[' '\n]/ig);
                let output = 0;
                aux.forEach(element => { if (element == this.word) {
                    output++;
                } });
                if (output != 0) {
                    console.log(output);
                }
                else {
                    console.log('No matchs');
                }
            });
        }
    }
    f_exist() {
        if ((0, fs_1.existsSync)(this.fname)) {
            return true;
        }
        else {
            console.log("File doesn't exist");
            return false;
        }
    }
}
if (process.argv.length !== 4) {
    console.log('Please, specify a file and word');
}
else {
    const cg = new cat_greep(process.argv[2], process.argv[3]);
    cg.run();
}
