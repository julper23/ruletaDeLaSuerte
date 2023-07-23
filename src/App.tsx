import { useState,useEffect } from 'react'
import './App.css'

function App() {
  /*const array_concursantes = [
    'Julen',
    'Alex',
    'Txipi',
    'Iban',
    'Iker',
    'Avellano',
    'Jongar',
    'Sanchito',
    'Marcos',
  ];*/
  const array_concursantes = [
    'Julen',
    'txipi'
  ];

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    let canvas = document.getElementById("idcanvas");
    let context = canvas.getContext("2d");
    let center = canvas.width / 2;

    context.beginPath();
    context.moveTo(center, center);
    context.arc(center, center, center, 0, 2 * Math.PI);
    context.lineTo(center, center);
    context.fillStyle = '#33333333';
    context.fill();

    context.beginPath();
    context.moveTo(center, center);
    context.arc(center, center, center - 10, 0, 2 * Math.PI);
    context.lineTo(center, center);
    context.fillStyle = 'black';
    context.fill();

    for (let i = 0; i < array_concursantes.length; i++) {
      context.beginPath();
      context.moveTo(center, center);
      context.arc(center, center, center - 20, i * 2 * Math.PI / array_concursantes.length, (i + 1) * 2 * Math.PI / array_concursantes.length);
      context.lineTo(center, center);
      context.fillStyle = random_color();
      context.fill();

      context.save();
      context.translate(center, center);
      context.rotate(3 * 2 * Math.PI / (5 * array_concursantes.length) + i * 2 * Math.PI / array_concursantes.length);
      context.translate(-center, -center);
      context.font = "13px Comic Sans MS";
      context.textAlign = "right";
      context.fillStyle = "white";
      context.fillText(array_concursantes[i], canvas.width - 30, center);
      context.restore();
    }
  }, []);

  function random_color() {
    let ar_digit = ['2', '3', '4', '5', '6', '7', '8', '9'];
    let color = '';
    let i = 0;
    while (i < 6) {
      let pos = Math.round(Math.random() * (ar_digit.length - 1));
      color = color + '' + ar_digit[pos];
      i++;
    }
    return '#' + color;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function sortear() {
    if (!isSpinning) {
      setIsSpinning(true);
      let canvas = document.getElementById("idcanvas");
      let randomTime = Math.floor(Math.random() * 3000) + 3000; // Tiempo de giro aleatorio entre 3 y 6 segundos
      let intervalTime = 10;
      let totalRotation = 360 * (randomTime / 1000); // Calcula la rotación total en grados
  
      let rotationAmount = 0;
      let maxRotationAmount = 10; // Ajusta este valor para cambiar la velocidad de rotación
  
      setRotation(0); // Establece el ángulo inicial como 0
  
      while (rotationAmount < totalRotation) {
        rotationAmount += maxRotationAmount;
        let newAngle = rotationAmount % 360;
        canvas.style.transform = "rotate(" + newAngle + "deg)";
        await sleep(intervalTime);
      }
  
      // Calcula el ángulo final de la ruleta
      let finalAngle = rotationAmount % 360; // Asegura que el ángulo final esté en el rango de 0 a 360 grados
  
      // Calcula el índice del ganador en base al ángulo final de la ruleta
      let winnerPosition = Math.floor((array_concursantes.length - ((finalAngle+91) % 360) / (360 / array_concursantes.length)) % array_concursantes.length);
      setWinner(array_concursantes[winnerPosition]);
  
      setIsSpinning(false);
    }
  }

  return (
    <main>
      <div className="contenedor">
        <h1>Concursantes</h1>
        <div className="concursantes">
          <div className="canvas-container">
            <div className='centrado'></div>
            <canvas id="idcanvas" width="600" height="600"></canvas>
          </div>
          <br />
          <button onClick={() => { sortear() }} disabled={isSpinning}>
            <span id="idestado" >{"Sortear"}</span>
          </button>
          <div className="mark-winner">
            
          </div>
        </div>
      </div>
      <div>{winner && <p>¡El ganador es: {winner}!</p>}</div>
    </main>
  );
}

export default App
