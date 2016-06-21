angular.module("ushirt")
  .factory("settingsFactory", (colorFactory) => {
    const shirtColorList = colorFactory.getShirtColorList();
    const fillColorList = colorFactory.getPrintColorList();
    const strokeColorList = colorFactory.getPrintColorList();

    let shirtColor = shirtColorList[0];
    const style = {
      fill: null,
      stroke: null,
      weight: 0
    };

    const setFillColor = (color) => {
      style.fill = color;
      fillColorList.forEach(c => c.selected = false);
      color.selected = true;
    };

    const setStrokeColor = (color) => {
      style.stroke = color;
      strokeColorList.forEach(c => c.selected = false);
      color.selected = true;
    };

    setFillColor(fillColorList[0]);
    setStrokeColor(strokeColorList[1]);

    return {
      getStyle: () => style,
      shirtColorList,
      fillColorList,
      strokeColorList,
      getShirtColor: () => shirtColor,
      getPrintStyle: () => style,
      setShirtColor: (color) => shirtColor = color,
      setFillColor,
      setStrokeColor,
      getAsOpts: () => ({
        fill: style.fill.rgb,
        stroke: style.stroke.rgb,
        weight: style.weight
      }),
      setFromOpts: (opts) => {
        setFillColor(fillColorList.filter(c => c.rgb === opts.fill)[0]);
        setStrokeColor(strokeColorList.filter(c => c.rgb === opts.stroke)[0]);
        style.weight = opts.weight;
      }
    };
  });
