import { useEffect, useState } from "react";

import random_color from "../utiles/randomColors";

import sleep from "../utiles/sleep";

export default function useRuleta() {
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const [concursantes, setConcursantes] = useState([
    {key:1,nombre:"1",color:"#00AA00"},
    {key:2,nombre:"2",color:"#0000AA"}
  ]);

  const addConcursantes = (nConcursantes) => {
    if (!isSpinning) {
      let cambios = [...concursantes]

      const newConcursantes = Array.from({ length: nConcursantes });

      newConcursantes.forEach((_,index) => {
        const newP = {key: new Date().getTime()+ index,nombre: (concursantes.length + index + 1).toString(),color: random_color()};
        cambios.push(newP);
      });

      setConcursantes(cambios)
    }
  }

  const deleteConcursantes = (nConcursantes) => {
    if (!isSpinning) {
      let cambios = [...concursantes]
      if(concursantes.length<= 2) return
      if(concursantes.length<=parseInt(nConcursantes)){
        let toDelete = concursantes.length -2
        cambios.splice(-toDelete)
      }else{
        cambios.splice(-nConcursantes)
      }
      setConcursantes(cambios)
    }
  }

  const deleteConcursante = (item) => {
    if(concursantes.length >= 3 ){
      setConcursantes(concursantes.filter(i => i.key != item.key))
    }
  }

  const changeColor = (color,item) => {

    let cambios = [...concursantes]
    item.color = color

    setConcursantes(cambios.map((i)=>{
      if(item.key===i.key){return item}
      return i
    }))
    
  }

  const changeNombre = (text,item) => {

    let cambios = [...concursantes]
    item.nombre = text

    setConcursantes(cambios.map((i)=>{
      if(item.key===i.key){return item}
      return i
    }))
  }

  async function sortear() {
    if (!isSpinning) {
      setWinner(null)
      setIsSpinning(true);
      let canvas = document.getElementById("idcanvas");
      let randomTime = Math.floor(Math.random() * 3000) + 3000; // Tiempo de giro aleatorio entre 3 y 6 segundos
      let intervalTime = 10;
      let totalRotation = 360 * (randomTime / 1000); // Calcula la rotación total en grados
  
      let rotationAmount = 0;
      let maxRotationAmount = 10; // Ajusta este valor para cambiar la velocidad de rotación
  
      while (rotationAmount < totalRotation) {
        rotationAmount += maxRotationAmount;
        let newAngle = rotationAmount % 360;
        canvas.style.transform = "rotate(" + newAngle + "deg)";
        await sleep(intervalTime);
      }
  
      // Calcula el ángulo final de la ruleta
      let finalAngle = rotationAmount % 360; // Asegura que el ángulo final esté en el rango de 0 a 360 grados
  
      // Calcula el índice del ganador en base al ángulo final de la ruleta
      let winnerPosition = Math.floor((concursantes.length - ((finalAngle+91) % 360) / (360 / concursantes.length)) % concursantes.length);
      setWinner(concursantes[winnerPosition].nombre);
  
      setIsSpinning(false);
    }
  }

  return {concursantes,isSpinning,winner,setConcursantes,addConcursantes,deleteConcursantes,deleteConcursante,changeColor,changeNombre,sortear}
}