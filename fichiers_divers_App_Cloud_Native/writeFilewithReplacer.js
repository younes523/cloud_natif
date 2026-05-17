const fs = require('fs/promises');

const books = [
    {id:2,title:"POO C#",author:"Harper Lee"},
    {id:3,title:"POO python",author:"chakiri hassan"},
    {id:4,title:"POO python-PHP",author:"chakiri hassan"},
    {title:"POO kotlin",author:"slimani haitam",id:4}
];
const dataFilePath = './books3.json';

const writeBooks = async (books) => {
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(books, 
        (key,value) => { //replacer => exclude 'author' froml being written down to the file 
            if(key == 'author'){
                return undefined;
            }
            else{
                return value;
            }
        }
        , 2)); //2 :  0 means no indentation, resulting in a compact JSON string, 'null' : replacer => see the file 'writeFilewithReplacer.js'
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

writeBooks(books);