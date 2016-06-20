angular.module("ushirt")
  .factory("layersFactory", () => {
    let list = [];
    let selectedLayer = null;

    function Layer(shape, ctx) {
      this.shape = shape;
      this.envelope = new Art.Envelope(shape);
      this.ctx = ctx;
    }

    const addLayer = shapeData => {
      const shape = Art.parseSvg(shapeData);
      list.unshift(new Layer(shape, null));  //NOTE(adam): no ctx until directive
      selectLayer(list[list.length - 1]);
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
      drawList();
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

    //NOTE(adam): reverse on copy to presever list but draw correct order
    const drawList = () => list.slice().reverse().forEach(l => {
      Art.clear();
      Art.drawThumb(l.shape, l.ctx);
      Art.drawShape(l.shape);
      if(selectedLayer) { Art.Envelope.drawEnvelope(selectedLayer.envelope); }
    });

    return {
      list,
      addLayer,
      selectLayer,
      moveSelectedLayer,
      deleteSelectedLayer
    };
  });
