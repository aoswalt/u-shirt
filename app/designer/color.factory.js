angular.module("ushirt")
  .factory("colorFactory", () => {
    const shirtColorList = [
      {rgb:"#fff", name:"White"},
      {rgb:"#999", name:"Grey"},
      {rgb:"#000", name:"Black"},
      {rgb:"#faa", name:"Pink"},
      {rgb:"#f00", name:"Red"},
      {rgb:"#ff0", name:"Yellow"},
      {rgb:"#080", name:"Green"},
      {rgb:"#00c", name:"Royal"},
      {rgb:"#309", name:"Navy"}
    ];
    const printColorList = [
      {pms:10,   rgb:"#000",    name:"Black"},
      {pms:430,  rgb:"#919693", name:"Dark Gray"},
      {pms:428,  rgb:"#d1cec6", name:"Light Gray"},
      {pms:20,   rgb:"#fff",    name:"White"},
      {pms:107,  rgb:"#f9e526", name:"Primrose Yellow"},
      {pms:109,  rgb:"#f9d616", name:"Lemon Yellow"},
      {pms:137,  rgb:"#fca311", name:"Golden Yellow"},
      {pms:165,  rgb:"#f96302", name:"Dolphin Orange"},
      {pms:172,  rgb:"#f74902", name:"Bright Orange"},
      {pms:233,  rgb:"#ce007c", name:"Fuchsia"},
      {pms:7503, rgb:"#9d9272", name:"Vegas Gold"},
      {pms:238,  rgb:"#ed4faf", name:"Rhodamine"},
      {pms:485,  rgb:"#d81e05", name:"Fire Red"},
      {pms:1795, rgb:"#d62828", name:"Scarlet Red"},
      {pms:188,  rgb:"#7c2128", name:"Cardinal Red"},
      {pms:209,  rgb:"#75263d", name:"Burgundy"},
      {pms:266,  rgb:"#6d28aa", name:"Violet"},
      {pms:306,  rgb:"#00bce2", name:"Light Blue"},
      {pms:2736, rgb:"#4930ad", name:"Light Royal"},
      {pms:286,  rgb:"#0038a8", name:"Royal Blue"},
      {pms:72,   rgb:"#007175", name:"Ultramarine Blue"},
      {pms:281,  rgb:"#002868", name:"Navy"},
      {pms:269,  rgb:"#442359", name:"Purple"},
      {pms:469,  rgb:"#603311", name:"Sienna Brown"},
      {pms:326,  rgb:"#00b2aa", name:"Aqua"},
      {pms:322,  rgb:"#007272", name:"Turquoise"},
      {pms:3375, rgb:"#8ee2bc", name:"Lime Green"},
      {pms:348,  rgb:"#008751", name:"Dallas Green"},
      {pms:341,  rgb:"#007a5e", name:"Kelly Green"},
      {pms:343,  rgb:"#00563f", name:"Chrome Green"},
      {pms:466,  rgb:"#d1bf91", name:"Khaki"},
      {pms:4975, rgb:"#441e1c", name:"Dark Brown"}
    ];

    return {
      getShirtColorList: () => shirtColorList.map(c => Object.assign({}, c)),
      getPrintColorList: () => printColorList.map(c => Object.assign({}, c))
    };
  });
