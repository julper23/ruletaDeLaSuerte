function hexToLuma(hexColor) {
    // Obtener los componentes de color en formato decimal
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calcular la luma del color
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default hexToLuma