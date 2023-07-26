import hexToLuma from "./hexToLuma";

function createRuleta(concursantes) {
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

    for (let i = 0; i < concursantes.length; i++) {
      context.beginPath();
      context.moveTo(center, center);
      context.arc(center, center, center - 20, i * 2 * Math.PI / concursantes.length, (i + 1) * 2 * Math.PI / concursantes.length);
      context.lineTo(center, center);
      context.fillStyle = concursantes[i].color;
      context.fill();
      let backgroundLuma = hexToLuma(concursantes[i].color)
      let textColor = backgroundLuma < 128 ? "white" : "black";
      context.save();
      context.translate(center, center);
      context.rotate(3 * 2 * Math.PI / (5 * concursantes.length) + i * 2 * Math.PI / concursantes.length);
      context.translate(-center, -center);
      function findFontSizeToFitText(text, maxWidth, fontName) {
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
    var text = concursantes[i].nombre;
    var availableWidth = Math.abs(2 * Math.PI * (center - 20) / concursantes.length);

    // Encontrar el tamaño de fuente adecuado utilizando búsqueda binaria
      context.font = findFontSizeToFitText(text, availableWidth, "Comic Sans MS");
      context.textAlign = "right";
      context.fillStyle = textColor;
      context.fillText(concursantes[i].nombre, canvas.width - 35, center);
      context.restore();
    }
}

export default createRuleta