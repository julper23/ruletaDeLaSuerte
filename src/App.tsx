import './styles.css'

import { useState,useEffect } from 'react'

import { HexColorPicker } from "react-colorful";
import { AiFillSetting, AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Table, Switch } from 'antd';

import useRuleta from './hooks/useRuleta';

import createRuleta from './utiles/createRuleta';
function Ruleta() {

  const [nuevosParticipantes,setNuevosParticipantes] = useState(1)
  const [deleteCon,setDeleteCon] = useState(1)
  const [opciones,setOpciones] = useState(false)

  const {concursantes,concursantesAll,isSpinning,winner,ocultar,setOcultar,setAllNoVisibles,setAllVisibles,addConcursantes,deleteConcursantes,deleteConcursante,changeColor,changeNombre,chageVision,sortear} = useRuleta()

  const columns = [
    {
      title:"Nombre",
      width: "75px",
      render: (item:any)=><input className='ruleta_ajustesTablaInput' type="text" name="numeroAañadir" value={item.nombre} onChange={(t)=>{changeNombre(t.target.value,item)}}/>
    },
    {
      title:"Color",
      width: "75px",
      render: (item:any)=><section className="small"><HexColorPicker color={item.color} onChange={(color)=>{changeColor(color,item)}} /></section>
    },
    {
      title:"Eliminar",
      width: "45px",
      render:(item:any)=><button className='ruleta_ajustesTablaButton' onClick={()=>{deleteConcursante(item)}} disabled={concursantesAll.length <= 2}>Eliminar</button>
    },
    {
      title:"Visión",
      width: "45px",
      render:(item:any)=><button className='ruleta_ajustesTablaButtonOjo' onClick={()=>{chageVision(item)}} disabled={item.visible&&concursantes.length <= 2}>{item.visible?<AiFillEyeInvisible/>:<AiFillEye/>}</button>
    }
  ]

  useEffect(() => {
    createRuleta(concursantes)
  }, [concursantes]);

  return (
    <main style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
    <div className="ruleta_contenedor">
      <h1  className='ruleta_ganador'>{winner&&winner}</h1>
      <div className='ruleta_ruletaYajustes'>
        <div className="ruleta_concursantes">
          <div className="ruleta_canvasContainer">
            <div className='ruleta_seleccionador'/>
            <canvas className='ruleta_canvas' id="idcanvas" width="600" height="600"></canvas>
          </div>
          <div className='ruleta_botonera'>
            <button className='ruleta_botonTransparente'>
              <AiFillSetting className='ruleta_iconoTransparente'/>
            </button>
            <button className='ruleta_botones' onClick={() => { sortear() }} disabled={isSpinning}>
              <span id="idestado">{"Sortear"}</span>
            </button>
            <button className='ruleta_botonAjustes'>
              <AiFillSetting className='ruleta_iconoAjustes' onClick={()=>{setOpciones(!opciones)}}/>
            </button>
          </div>
        </div>
        {opciones&&<div className='ruleta_ajustes'>
          <div className='ruleta_ajustesBotonera'>
            <div className='ruleta_ajustesForm'>
              <button className='ruleta_ajustesBoton' onClick={()=>{addConcursantes(nuevosParticipantes)}} disabled={isSpinning}>AGREGAR</button>
              <input className='ruleta_ajustesInput' type="number" name="numeroAañadir" min={1} max={200} value={nuevosParticipantes} onChange={(t)=>{setNuevosParticipantes(t.target.value)}}/>
            </div>
            <div className='ruleta_ajustesForm'>  
              <button className='ruleta_ajustesBoton' onClick={()=>{deleteConcursantes(deleteCon)}} disabled={concursantesAll.length<= 2||isSpinning}>Eliminar</button>
              <input className='ruleta_ajustesInput' type="number" name="numeroAañadir" min={1} max={concursantesAll.length-2} value={deleteCon} onChange={(t)=>{setDeleteCon(t.target.value)}} disabled={concursantesAll.length<= 2}/>
            </div>
          </div>
          <div className='ruleta_ajustesBotonera2'>
            <div className='ruleta_ajustesForm'>  
              <p>Ocultar todos menos 2</p>
              <button className='ruleta_ajustesFormButtonOjo' onClick={()=>{setAllNoVisibles()}} disabled={concursantes.length <= 2}>{<AiFillEyeInvisible/>}</button>
            </div>
            <div className='ruleta_ajustesForm'>  
              <p >Visualizar todos</p>
              <button className='ruleta_ajustesFormButtonOjo' onClick={()=>{setAllVisibles()}} >{<AiFillEye/>}</button>
            </div>
            <div className='ruleta_ajustesForm'>  
              <p >Ocultar al ganar</p>
              <Switch style={{marginLeft:"5px"}} checked={ocultar} onChange={setOcultar}/>
            </div>
          </div>
          <div className='ruleta_ajustesTablaContenedor'>
            <Table className='ruleta_ajustesTabla' columns={columns} dataSource={concursantesAll} pagination={false} scroll={{ x:225,y: 500 }} />
          </div>
        </div>}
      </div>
    </div>
    </main>
  );
}

export default Ruleta