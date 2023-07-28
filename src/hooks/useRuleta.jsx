import { useEffect, useState } from "react";

import random_color from "../utiles/randomColors";

import sleep from "../utiles/sleep";

export default function useRuleta() {
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const [ocultar,setOcultar] = useState(false);

  const [concursantes, setConcursantes] = useState([
    {key:1,nombre:"1",color:"#00AA00",visible:true},
    {key:2,nombre:"2",color:"#0000AA",visible:true}
  ]);

  const [concursantesAll, setConcursantesAll] = useState([
    {key:1,nombre:"1",color:"#00AA00",visible:true},
    {key:2,nombre:"2",color:"#0000AA",visible:true}
  ]);

  const actualizarConcursantes = (conALL) => {setConcursantes(conALL.filter(con => con.visible))}

  const addConcursantes = (nConcursantes) => {
    if (!isSpinning) {
      let cambios = [...concursantesAll]

      const newConcursantes = Array.from({ length: nConcursantes });

      newConcursantes.forEach((_,index) => {
        const newP = {key: new Date().getTime()+ index,nombre: (concursantesAll.length + index + 1).toString(),color: random_color(),visible:true};
        cambios.push(newP);
      });

      setConcursantesAll(cambios)
      actualizarConcursantes(cambios)
    }
  }

  const deleteConcursantes = (nConcursantes) => {
    if (!isSpinning) {
      let cambios = [...concursantesAll]

      if(concursantesAll.length<= 2) return
      if(concursantesAll.length<=parseInt(nConcursantes)||concursantesAll.length-parseInt(nConcursantes)<=2){
        let toDelete = concursantesAll.length -2
        cambios.splice(-toDelete)
      }else{
        cambios.splice(-nConcursantes)
      }

      setConcursantesAll(cambios)
      actualizarConcursantes(cambios)
    }
  }

  const deleteConcursante = (item) => {
    if(concursantesAll.length >= 3 ){
      let newCons = concursantesAll.filter(i => i.key != item.key)
      setConcursantesAll(newCons)
      actualizarConcursantes(newCons)
    }
  }

  const changeConcursantesAll = (item) => {
    let arrayCon = [...concursantesAll]
    let newCons = arrayCon.map((i)=>{
      if(item.key===i.key){return item}
      return i
    })
    setConcursantesAll(newCons)
    actualizarConcursantes(newCons)
  }

  const changeColor = (color,item) => {
    item.color = color
    changeConcursantesAll(item)
  }

  const changeNombre = (text,item) => {
    item.nombre = text
    changeConcursantesAll(item)
  }

  const chageVision = (item) => {
    item.visible = !item.visible
    changeConcursantesAll(item)
  }
  
  const setAllNoVisibles = () => {
    let cambios = [...concursantesAll]
    let newCons = cambios.map((i,index)=>{
      if(index<2){return i}
      i.visible=false
      return i
    })
    setConcursantesAll(newCons)
    actualizarConcursantes(newCons)
  }

  const setAllVisibles = () => {
    let cambios = [...concursantesAll]
    let newCons = cambios.map((i)=>{
      i.visible=true
      return i
    })
    setConcursantesAll(newCons)
    actualizarConcursantes(newCons)
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
      if(ocultar&&concursantes.length>2){
        setTimeout(function () {
          chageVision(concursantes[winnerPosition])
          setIsSpinning(false)
        }, 1000);
      }else{
        setIsSpinning(false);
      }
    }
  }

  return {concursantes,concursantesAll,isSpinning,winner,ocultar,setConcursantes,setConcursantesAll,setOcultar,setAllNoVisibles,setAllVisibles,addConcursantes,deleteConcursantes,deleteConcursante,changeColor,changeNombre,chageVision,sortear}
}