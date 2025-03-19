import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const PORT = 3000

const __filename = path.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const counterFile = path.join(__dirname, 'counter.txt');

async function getCounter() {
    try {
        const data = fs.readFile(counterFile, 'utf8');
        const number = parseInt(data, 10);
        return isNaN(number) ? 0 : number;
    } catch(err){
        if (err.code === 'ENOENT'){
            return 0;
        }
        throw err
    }
}

async function setCounter(value) {
    await fs.writeFile(counterFile, value.toString(), 'utf8')
}

async function modifyCounter(modifier) {
    const currentValue = await getCounter();
    const newValue = modifier(currentValue);
    await setCounter(newValue);
    return newValue;    
}

const server = http.createServer(async (req, res) => {
    try {
      if (req.url === '/increase') {
        const newValue = await modifyCounter(value => value + 1);
        res.end(`Counter zvýšen na ${newValue}`);
      } else if (req.url === '/decrease') {
        const newValue = await modifyCounter(value => value - 1);
        res.end(`Counter snížen na ${newValue}`);
      } else if (req.url === '/read') {
        const value = await getCounter();
        res.end(`Aktuální hodnota counteru: ${value}`);
      } else {
        res.statusCode = 404;
        res.end('Stránka nebyla nalezena');
      }
    } catch (err) {
      res.statusCode = 500;
      res.end('Chyba při zpracování požadavku');
    }
  });
  
  server.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
  });

/**
 * Vytvořte server, který budou reagovat na tři různé požadavky z prohlížeče. /increase, /decrease a /read (celý URL v prohlížeči bude tedy například 
 * http://localhost:3000/increase). Při zavolání přes cestu /increase a /decrease bude server zvyšovat/snižovat o jedničku číslo, které bude mít uložené v
 *  souboru counter.txt (pokud soubor neexistuje, tak ho server založí s úvodním číslem 0). U těchto dvou cest může server vrátit libovolnou odpověď (
 * například text OK). Při zavolání serveru přes cestu /read vrátí server prohlížeči číslo uložené v souboru counter.txt.
 
 */