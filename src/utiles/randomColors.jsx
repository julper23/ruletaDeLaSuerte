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

export default random_color