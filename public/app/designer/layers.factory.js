angular.module("ushirt")
  .factory("layersFactory", (settingsFactory, $timeout) => {
    let list = [];
    let selectedLayer = null;

    function Layer(shape, opts, ctx) {
      this.shape = shape;
      this.opts = opts;
      this.envelope = new Art.Envelope(shape);
      this.ctx = ctx;
    }

    const addLayer = shapeData => {
      const shape = Art.parseSvg(shapeData);
      list.unshift(new Layer(shape,
                             settingsFactory.getAsOpts(),
                             null));  //NOTE(adam): no ctx until directive
      selectLayer(list[0]);
      drawList();
    };

    const getSelectedLayer = () => selectedLayer;

    const selectLayer = layer => {
      if(layer && layer.selected) {
        layer.selected = false;
        selectedLayer = null;
      } else {
        list.forEach(l => l.selected = false);
        selectedLayer = layer;
        if(selectedLayer) {
          selectedLayer.selected = true;
          settingsFactory.setFromOpts(selectedLayer.opts);
        }
      }
      drawList();
    };

    const selectLayerAtPoint = (pos) => {
      let containingLayer = null;
      list.slice().reverse().forEach(l => {
        if(Art.Shape.shapeContainsPoint(l.shape, l.envelope.tmat, pos)) {
          containingLayer = l;
          return;
        }
      });
      selectLayer(containingLayer);
      return selectedLayer;
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

    const updateSelectedOpts = (settings) => {
      if(selectedLayer) {
        if(settings.fill) { selectedLayer.opts.fill = settings.fill.rgb; }
        if(settings.stroke) { selectedLayer.opts.stroke = settings.stroke.rgb; }
        if(settings.weight) { selectedLayer.opts.weight = settings.weight; }
        drawList();
      }
    };

    const rotateSelectedLayerEnvelope = (deg) => {
      if(selectedLayer) {
        Art.Envelope.rotate(selectedLayer.envelope, deg);
        drawList();
      }
    };

    const resetSelectedLayer = () => {
      if(selectedLayer) {
        Art.Envelope.reset(selectedLayer.envelope);
        drawList();
      }
    };

    //NOTE(adam): reverse on copy to presever list but draw correct order
    const drawList = () => {
      Art.clear();
      list.slice().reverse().forEach(l => {
        Art.Shape.drawThumb(l.shape, l.opts, l.envelope, l.ctx);
        Art.Shape.drawShape(l.shape, l.opts, l.envelope.tmat);
        if(selectedLayer) { Art.Envelope.drawEnvelope(selectedLayer.envelope); }
      });
      $timeout();
    };

    return {
      list,
      addLayer,
      selectLayer,
      selectLayerAtPoint,
      getSelectedLayer,
      moveSelectedLayer,
      deleteSelectedLayer,
      updateSelectedOpts,
      rotateSelectedLayerEnvelope,
      resetSelectedLayer,
      drawList
    };
  });
