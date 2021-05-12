const fs = require('fs');
const ExpressError = require('./expressError');

class File{
    constructor(path){
        this.path = path;
        this.option = 'utf8';
        this.items = [];
    }
    readFromFile(){
        fs.readFile(this.path, this.option, (err, data)=>{
            if (err){
                process.exit(1);
            }
            if (!data){
                this.items=[];
            }else{
                try {
                    this.items = JSON.parse(data);
                } catch (e) {
                    throw new ExpressError("Can't parse the JSON", 500);
                }
            }
        })
    }
    writeToFile(){
        fs.writeFile(this.path, JSON.stringify(this.items), this.option, (err)=>{
            if (err){
                process.exit(1);
            }   
        })
    }
}

module.exports = File;