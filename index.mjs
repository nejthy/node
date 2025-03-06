import { rejects } from 'assert';
import { error } from 'console';
import fs from 'fs';
import { resolve } from 'path';


const readFile = (name) => {
    return new Promise((resolve, reject) =>{
        fs.readFile(name, (error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data.toString())
            }
        })
    }) 
}
const writeFile = (name, data) => (name, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, data, (error) => {
           if (error) {
            reject(error)
           } else {
            resolve()
           }
        })
    })
}
readFile('instrukce.txt').then((instrukce) => {
    const [vstup, vystup] = instrukce.split(' ')

    return readFile(vstup).then((obsahVstupu) => {
        return writeFile(vystup, obsahVstupu)
    })
})

