let modulo=require("modulo.js");
modulo();
let ris1=modulo.somma(3,7);
let ris2=modulo.moliplicazione(3,7);
console.log(ris1)
console.log(ris2);

console.log(modulo.json.nome);
modulo.json.setNome("plut");
console.log(modulo.json.nome);

console.log(modulo.myClass.nome);