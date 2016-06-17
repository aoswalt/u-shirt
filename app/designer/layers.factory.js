angular.module("ushirt")
  .factory("layersFactory", () => {
    let list = [];
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

    const moveSelectedLayer = dir => {
      if(!selectedLayer) { return; }

      const index = list.indexOf(selectedLayer);
      const newIndex = index + dir;
      if(newIndex === -1 || newIndex === list.length) { return list; }

      const layer = list[index];
      list = [...list.slice(0, index),
              ...list.slice(index + 1, list.length)];
      list = [...list.slice(0, newIndex),
              layer,
              ...list.slice(newIndex, list.length)];
      drawList();
      return list;
    };

    const drawList = () => list.forEach(l => Art.drawShape(l.shape));

    return {
      list,
      addLayer,
      selectLayer,
      moveSelectedLayer
    };
  });
