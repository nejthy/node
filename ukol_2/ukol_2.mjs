import { readFile, writeFile } from 'fs/promises';

const writeAndReadFile = async () => {

    try {
        const instrukce = await readFile('instrukce2.txt', 'utf-8')
        const n = parseInt(instrukce.trim())

        if (isNaN(n)) {
            throw new Error('Instrukce neobsahují číslo')
        }

        const promises = [];
        for (let i=0; i <= n; i++) {
            const fileName = `${i}.txt`
            const content = `Soubor ${i}`
            promises.push(writeFile(fileName, content));
        }

        await Promise.all(promises);

        if (n <= 4 ) {
            console.log(`Úspěšně vytvořeny ${n + 1} soubory`) 
        }else {
            console.log(`Úspěšně vytvořeno ${n + 1} souborů`) 
        }

    } catch(error) {
        console.error('Chyba:', error);
    }
};


writeAndReadFile();