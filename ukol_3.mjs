import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const counterFile = path.join(__dirname, 'counter.txt');

async function getCounter() {
  try {
    const data = await fs.readFile(counterFile, 'utf8');
    const number = parseInt(data, 10);
    return isNaN(number) ? 0 : number;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return 0;
    }
    throw err;
  }
}

async function setCounter(value) {
  await fs.writeFile(counterFile, value.toString(), 'utf8');
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
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(`Counter increased to ${newValue}`);
    } else if (req.url === '/decrease') {
      const newValue = await modifyCounter(value => value - 1);
      res.end(`Counter decreased to ${newValue}`);
    } else if (req.url === '/read') {
      const value = await getCounter();
      res.end(`Current value: ${value}`);
    } else {
      res.statusCode = 404;
      res.end('Page was not found');
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('Error');
  }
});

server.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
