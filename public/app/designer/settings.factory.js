angular.module("ushirt")
  .factory("settingsFactory", (colorFactory) => {
    const shirtColorList = colorFactory.getShirtColorList();
    const fillColorList = colorFactory.getPrintColorList();
    const strokeColorList = colorFactory.getPrintColorList();

    let shirtColor = shirtColorList[0];
    const style = {
      fill: fillColorList[0],
      stroke: strokeColorList[1],
      weight: 0
    };

    return {
      shirtColorList,
      fillColorList,
      strokeColorList,
      getShirtColor: () => shirtColor,
      getPrintStyle: () => style,
      setShirtColor: color => shirtColor = color,
      setFillColor: color => style.fill = color,
      setStrokeColor: color => style.stroke = color,
      setStrokeWeight: weight => style.weight = weight
    };
  });
