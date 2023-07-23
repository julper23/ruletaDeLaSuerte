import { useState,useEffect } from 'react'
import './App.css'
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HexColorPicker } from "react-colorful";
import { AiFillSetting } from "react-icons/ai";
function App() {

  const [nuevosParticipantes,setNuevosParticipantes] = useState(1)
  const [deletePart,setDeletePart] = useState(1)
  const [opciones,setOpciones] = useState(false)
  const [array_concursantes, setArray_concursantes] = useState([
    {
      key:1,
      nombre:"1",
      color:"#00AA00",
    },
    {
      key:2,
      nombre:"2",
      color:"#0000AA",
    }
  ]);


  const addParticipante = () => {
    if (!isSpinning) {
      let cambios = [...array_concursantes]

      const nuevosParticipantesArray = Array.from({ length: nuevosParticipantes });


      nuevosParticipantesArray.forEach((_,index) => {
        const newP = {
            key: new Date().getTime()+ index,
            nombre: (array_concursantes.length + index + 1).toString(),
            color: random_color()
        };
        cambios.push(newP);
      });


      setArray_concursantes(cambios)
    }
  }

  const deleteParticipantes = () => {
    if (!isSpinning) {
      let cambios = [...array_concursantes]
      if(array_concursantes.length<= 2) return
      if(array_concursantes.length<=parseInt(deletePart)){
        let toDelete = array_concursantes.length -2
        cambios.splice(-toDelete)
      }else{
        cambios.splice(-deletePart)
      }
      
      setArray_concursantes(cambios)
    }
  }

  const eliminarParticipante = (item:any) => {
    if(array_concursantes.length >= 3 ){
      setArray_concursantes(array_concursantes.filter(i => i.key != item.key))
    }
  }

  const changeColor = (color:any,item:any) => {

    let cambios = [...array_concursantes]
    item.color = color

    setArray_concursantes(cambios.map((i)=>{
      if(item.key===i.key){return item}
      return i
    }))
    
  }

  const changeNombre = (text:any,item:any) => {

    let cambios = [...array_concursantes]
    item.nombre = text

    setArray_concursantes(cambios.map((i)=>{
      if(item.key===i.key){return item}
      return i
    }))
  }

  interface DataType {
    key:number;
    nombre: any;
    color: any;
  }

  const columns : ColumnsType<DataType> = [
    {
      title:"Nombre",
      width: "75px",
      render: (item)=><input style={{marginLeft:"5px",padding:"5px",borderRadius:"10px",width:"80%"}} type="text" name="numeroAañadir" value={item.nombre} onChange={(t)=>{changeNombre(t.target.value,item)}}/>
    },
    {
      title:"Color",
      width: "75px",
      render: (item)=><section className="small"><HexColorPicker color={item.color} onChange={(color)=>{changeColor(color,item)}} /></section>
    },
    {
      title:"Eliminar",
      width: "45px",
      render:(item)=><button style={{cursor:"pointer",borderRadius:"10px",padding:"5px",fontSize:"15px",width:"70px"}} onClick={()=>{eliminarParticipante(item)}} disabled={array_concursantes.length <= 2}>Eliminar</button>
    }
  ]

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  function hexToLuma(hexColor:any) {
    // Obtener los componentes de color en formato decimal
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calcular la luma del color
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

  useEffect(() => {
    let canvas = document.getElementById("idcanvas");
    let context = canvas.getContext("2d");
    let center = canvas.width / 2;

    context.beginPath();
    context.moveTo(center, center);
    context.arc(center, center, center, 0, 2 * Math.PI);
    context.lineTo(center, center);
    context.fillStyle = 'black';
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
      context.fillStyle = array_concursantes[i].color;
      context.fill();
      let backgroundLuma = hexToLuma(array_concursantes[i].color)
      let textColor = backgroundLuma < 128 ? "white" : "black";
      context.save();
      context.translate(center, center);
      context.rotate(3 * 2 * Math.PI / (5 * array_concursantes.length) + i * 2 * Math.PI / array_concursantes.length);
      context.translate(-center, -center);
      function findFontSizeToFitText(text:any, maxWidth:any, fontName:any) {
        let minSize = 1;
        let maxSize = 75; // Valor arbitrario, puedes ajustarlo según tus necesidades

        while (minSize < maxSize) {
          const midSize = Math.ceil((minSize + maxSize) / 2);
          context.font = `${midSize}px ${fontName}`;
          const textWidth = context.measureText(text).width;

          if (textWidth+2 <= maxWidth-30) {
              minSize = midSize;
          } else {
              maxSize = midSize - 1;
          }
        }
        return minSize;
      }

    // Calcular el tamaño del texto dinámicamente para que se ajuste dentro del botón (arco)
    var text = array_concursantes[i].nombre;
    var availableWidth = Math.abs(2 * Math.PI * (center - 20) / array_concursantes.length);

    // Encontrar el tamaño de fuente adecuado utilizando búsqueda binaria
      context.font = findFontSizeToFitText(text, availableWidth, "Comic Sans MS");
      context.textAlign = "right";
      context.fillStyle = textColor;
      context.fillText(array_concursantes[i].nombre, canvas.width - 35, center);
      context.restore();
    }
  }, [array_concursantes]);

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
      let winnerPosition = Math.floor((array_concursantes.length - ((finalAngle+91) % 360) / (360 / array_concursantes.length)) % array_concursantes.length);
      setWinner(array_concursantes[winnerPosition].nombre);
  
      setIsSpinning(false);
    }
  }

  return (
    <main>
      <div className="contenedor">
        <h1 style={{height:"45px",fontSize:"45px"}}>{winner&&winner}</h1>
        <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",alignItems:"flex-start",justifyContent:"space-evenly",alignContent:"center"}}>
        <div className="concursantes">
          <div className="canvas-container">
            <div className='centrado'></div>
            <canvas id="idcanvas" width="600" height="600"></canvas>
          </div>
          <br />
          <div style={{display:'flex',flexDirection:"row",flexWrap:"wrap",justifyContent:"space-evenly",alignItems:"center"}}>
            <button style={{height:"50px",width:"50px",borderStyle:"none",backgroundColor:"transparent "}}>
              <AiFillSetting style={{height:"100%",width:"100%",color:"transparent"}}/>
            </button>
            <button className='botones' onClick={() => { sortear() }} disabled={isSpinning}>
              <span id="idestado" >{"Sortear"}</span>
            </button>
            <button style={{marginRight:"10px",height:"25px",width:"25px",borderStyle:"none",backgroundColor:"transparent ",zIndex:"1000"}}>
              <AiFillSetting onClick={()=>{setOpciones(!opciones)}}style={{height:"100%",width:"100%",cursor:"pointer"}}/>
            </button>
          </div>
        </div>
        {opciones&&<div className='tablaConcursantes' style={{marginTop:"15px",display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
          <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
            <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",alignContent:"center",justifyContent:"center",margin:"5px"}}>
              <button style={{cursor:"pointer",borderRadius:"10px",padding:"5px",fontSize:"large",width:"105px"}} onClick={()=>{addParticipante()}} disabled={isSpinning}>AGREGAR</button>
              <input style={{marginLeft:"5px",padding:"5px",borderRadius:"10px",width:"200px"}} type="number" name="numeroAañadir" min={1} max={200} value={nuevosParticipantes} onChange={(t)=>{setNuevosParticipantes(t.target.value)}}/>
            </div>
            <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",alignContent:"center",justifyContent:"center",margin:"5px"}}>  
            <button style={{cursor:"pointer",borderRadius:"10px",padding:"5px",fontSize:"large",width:"105px"}} onClick={()=>{deleteParticipantes()}} disabled={array_concursantes.length<= 2||isSpinning}>Eliminar</button>
            <input style={{marginLeft:"5px",padding:"5px",borderRadius:"10px",width:"200px"}} type="number" name="numeroAañadir" min={1} max={array_concursantes.length-2} value={deletePart} onChange={(t)=>{setDeletePart(t.target.value)}} disabled={array_concursantes.length<= 2}/>
            </div>
          </div>
          <div style={{width:"80%",marginBottom:"20px",minWidth:"404px"}}>
            <Table style={{marginTop:"15px"}} columns={columns} dataSource={array_concursantes} pagination={false} scroll={{ x:225,y: 500 }} />
          </div>
        </div>}
        </div>
      </div>
    </main>
  );
}

export default App
