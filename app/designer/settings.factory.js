angular.module("ushirt")
  .factory("settingsFactory", (colorFactory) => {
    const shirtColorList = colorFactory.getShirtColorList();
    const fillColorList = colorFactory.getPrintColorList();
    const strokeColorList = colorFactory.getPrintColorList();

    let shirtColor = shirtColorList[0];
    const style = {
      fill: Object.assign({}, fillColorList[0]),
      stroke: Object.assign({}, strokeColorList[1]),
      weight: 0
    };

    return {
      shirtColorList,
      fillColorList,
      strokeColorList,
      getShirtColor: () => shirtColor,
      getPrintStyle: () => style,
      setShirtColor: color => shirtColor = color,
      setFillColor: color => style.fill = Object.assign(style.fill, color),
      setStrokeColor: color => style.stroke = Object.assign(style.stroke, color),
      setStrokeWeight: weight => style.weight = weight
    };
  });
