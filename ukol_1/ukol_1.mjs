import { promises as fs } from 'fs';
 
 async function copyFileFromInstructions() {
     try{
         const instruction = await fs.readFile('instrukce1.txt','utf8');
 
         const[sourceFile, targetFile] = instruction.trim().split(/\s+/);
 
         try{
             await fs.access(sourceFile);
         } catch (err) {
             console.error('Zdrojový soubor neexistuje');
             return;
         }
 
         const content = await fs.readFile(sourceFile, 'utf8')
 
         
         if (!sourceFile || !targetFile) {
            console.error('Instrukce nejsou správné. Očekává se: "zdrojový_soubor cílový_soubor".');
            return;
          }
          
         await fs.writeFile(targetFile, content, 'utf8') 
         console.log('Data byla úspěšné zkopírovaná.')
 
     }   catch (error) {
         console.log('Nastala chyba', error);
     }
 
 }
 
 copyFileFromInstructions()