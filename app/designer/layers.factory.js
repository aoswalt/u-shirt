angular.module("ushirt")
  .factory("layersFactory", () => {
    let list = [];
    let selectedLayer = null;

    function Layer(shape, ctx) {
      this.shape = shape;
      this.envelope = new Envelope(shape);
      this.ctx = ctx;
    }

    function Envelope(shape) {
      this.shape = shape;
    }

    const addLayer = shapeData => {
      const shape = Art.parseSvg(shapeData);
      list.push(new Layer(shape, null));  //NOTE(adam): no ctx until directive
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

      const layer = list.splice(index, 1)[0];
      list = [...list.slice(0, newIndex),
              layer,
              ...list.slice(newIndex, list.length)];
      drawList();
      return list;
    };

    const deleteSelectedLayer = () => {
      if(!selectedLayer) { return; }

      const index = list.indexOf(selectedLayer);
      list.splice(index, 1);
      selectedLayer = null;
      drawList();
    };

    const drawList = () => list.forEach(l => {
      Art.drawThumb(l.shape, l.ctx);
      Art.drawShape(l.shape);
    });

    return {
      list,
      addLayer,
      selectLayer,
      moveSelectedLayer,
      deleteSelectedLayer
    };
  });
