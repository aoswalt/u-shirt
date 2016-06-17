angular.module("ushirt")
  .factory("layersFactory", () => {
    const list = [];
    let selectedLayer = null;

    function Envelope(shape) {
      this.shape = shape;
    }

    function Layer(shape) {
      this.shape = shape;
      this.envelope = new Envelope(shape);
    }

    const addLayer = shapeData => {
      const shape = Art.parseSvg(shapeData);
      list.push(new Layer(shape));
      drawList();
    };

    const selectLayer = layer => {
      if(layer.selected) {
        layer.selected = false;
        selectedLayer = null;
      } else {
        list.forEach(l => l.selected = false);
        selectedLayer = layer;
        selectedLayer.selected = true;
      }
    };

    const drawList = () => list.forEach(l => Art.drawShape(l.shape));

    return {
      list,
      addLayer,
      selectLayer
    };
  });
