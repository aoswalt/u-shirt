angular.module("ushirt")
  .factory("layersFactory", (settingsFactory, shapeDataFactory, $timeout) => {
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
      list[0].shapeId = shapeData.id;
      selectLayer(list[0]);
      drawList();
    };

    const duplicateSelectedLayer = () => {
      if(!selectedLayer) { return; }

      list.unshift(new Layer(Object.assign({}, selectedLayer.shape),
                             Object.assign({}, selectedLayer.opts),
                             null));
      list[0].shapeId = selectedLayer.shapeId;
      Art.Envelope.setNodes(list[0].envelope, selectedLayer.envelope.nodes);
      Art.Envelope.calcTmat(list[0].envelope);
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

    const serializeDesign = () => ({
      shirtColor: settingsFactory.getShirtColor().rgb,
      layers: list.map(l => ({
        shapeId: l.shapeId,
        nodePositions: l.envelope.nodes,
        options: l.opts
      }))
    });

    const deserializeDesign = (serial) => {
      const shirtColor = settingsFactory.shirtColorList.find(c => c.rgb === serial.shirtColor);
      settingsFactory.setShirtColor(shirtColor);

      selectedLayer = null;
      list.length = 0;
      serial.layers.forEach(e => {
        const shapeData = shapeDataFactory.getShapeData(e.shapeId);
        const shape = Art.parseSvg(shapeData);
        const layer = new Layer(shape, e.options, null);
        layer.shapeId = e.shapeId;
        list.unshift(layer);
        Art.Envelope.setNodes(layer.envelope, e.nodePositions);
        Art.Envelope.calcTmat(layer.envelope);
      });
      drawList();
    };

    return {
      list,
      addLayer,
      duplicateSelectedLayer,
      selectLayer,
      selectLayerAtPoint,
      getSelectedLayer,
      moveSelectedLayer,
      deleteSelectedLayer,
      updateSelectedOpts,
      rotateSelectedLayerEnvelope,
      resetSelectedLayer,
      drawList,
      serializeDesign,
      deserializeDesign
    };
  });
