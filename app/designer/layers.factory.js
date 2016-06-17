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

    list.push(new Layer(null));
    list.push(new Layer(null));
    list.push(new Layer(null));
    list.push(new Layer(null));

    selectLayer(list[1]);

    return {
      list,
      selectLayer
    };
  });
