// ## 📝 Ejercicio: "Par o Impar con Retraso"
// Crea una función llamada `esParConRetraso` que:
// 1. Acepte un número como argumento
// 2. Devuelva una Promesa
// 3. La promesa debe resolverse después de 1 segundo con:
//    - ✅ `true` si el número es par
//    - ❌ `false` si el número es impar
// 4. Si el input no es un número, la promesa debe rechazarse con un error

const { isNumberObject } = require("util/types")

function esParConRetraso(num){
    return new Promise((resolve,reject)=>{
        if (Number(num)) { setTimeout(resolve(num),10000) }else{

        } setTimeout(reject(num),4000)
            
    })
}


esParConRetraso(12)
    .then(num => {
        console.log(`true` + "si el número es par")
    })

    .catch(num => {
        console.log(`false` + "si el número es par")
    })


