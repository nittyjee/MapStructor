function handleDrawCreate(e) {
  const featureType = e.features[0].geometry.type;
  const featureId = e.features[0].id;
  console.log("Feature type == ", featureType, "selectedType === ", selectedType)
  if (featureType === selectedType) {
    if(!document.getElementById(`${currentLayerId}-checkbox`).checked){
      drawControls.delete(featureId);
      Swal.fire({
        title: "Current layer isn't visible",
        text: "Turn on current layer to add a new "+ (featureType === "Point"?"point":(featureType === "Polygon"? "polygon" : "line")+".")
      })
    }else
    layers.find(({ id }) => id === currentLayerId).features.push(e.features[0]);
  } else if (selectedType === "unset") {
    console.log("inside unset")
    if (!layers.some((layer) => layer.type === featureType)) {
      console.log("Inside if (!layers.some((layer) => layer.type === featureType)) {")
      selectedType = featureType;
      currentLayerId = generateRandomString(10);
      const layerName = `Untitled ${
        featureType === "Point"
          ? "points"
          : featureType === "LineString"
          ? "lines"
          : "polygons"
      } layer`;
      layers.push({
        name: layerName,
        type: featureType,
        features: [e.features[0]],
        id: currentLayerId,
      });
      addLayer({
        type: selectedType,
        name: layerName,
        id: currentLayerId,
      });
      setCurrentLayer(currentLayerId, featureType)
    }
  } else {
    if (!layers.some((layer) => layer.type === featureType)) {
      selectedType = featureType;
      currentLayerId = generateRandomString(10);
      const layerName = `Untitled ${
        featureType === "Point"
          ? "points"
          : featureType === "LineString"
          ? "lines"
          : "polygons"
      } layer`;
      layers.push({
        name: layerName,
        type: featureType,
        features: [e.features[0]],
        id: currentLayerId,
      });
      addLayer({
        type: selectedType,
        name: layerName,
        id: currentLayerId,
      });
      setCurrentLayer(currentLayerId, featureType)
    } else {
      drawControls.delete(featureId);
      const currentLayerName = layers.find(({ id }) => id === currentLayerId).name
      Swal.fire({
        title: "Wrong Layer!",
        text: `"${currentLayerName}" is the current selected layer, switch to a ${featureType === "Point"? "point's": (featureType === "Polygon")? "polygon's": "line's"} layer to add a ${featureType === "Point"? "point": (featureType === "Polygon")? "polygon": "line"}`,
        icon: "Error"
      });
    }
  }
  saveProjectToFirebase();
}

function addLayer({ type, name, id }) {
  const layersContainer = document.getElementById("layers-container");
  // const layerId = name.split(" ").join("-");
  layerIds.push(id)

  layersContainer.innerHTML += `
    <div class="flex mb-2 ${
      id === currentLayerId ? "selected" : ""
    }" id="${id}">
            <input type="checkbox" id="${id}-checkbox" checked/>
            <div class="flex ml-2 border items-center rounded-lg">
              <input
                type="text"
                value="${name}"
                class="pl-2 py-1 rounded-tl-lg rounded-bl-lg"
              />
              <div
                class="grid items-center p-2 rounded-tr-lg rounded-br-lg type-btn"
                style="background-color: #12abac"
                id="change-type-btn-${id}"
              >
              ${
                type === "Polygon"
                  ? '<i class="fa-solid fa-vector-square"></i>'
                  : type === "Point"
                  ? '<i class="fa-solid fa-location-pin"></i>'
                  : '<i class="fa-solid fa-bezier-curve"></i>'
              }
              </div>
            </div>
    </div>
    `;

  setTimeout(() => {
    document
      .getElementById(`${id}-checkbox`)
      .addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        if(!isChecked){
          layers.forEach(layer => {
            if(id === layer.id) {
              layer.features.forEach(feature => {
                drawControls.delete(feature.id)
              })
            }
          })
        } else {
          layers.forEach(layer => {
            if(id === layer.id) {
              layer.features.forEach(feature => {
                drawControls.add(feature)
              })
            }
          })
        }
      });
    const changeBtn = document.getElementById(`change-type-btn-${id}`);
    changeBtn.addEventListener("click", (e) => {
      setCurrentLayer(id, type)
    });
  }, 1_000);
}

function setCurrentLayer(value, type){
  selectedType = type;
  currentLayerId = value;
  layers.forEach(({id}) => {
    if(id !== value){
      document.getElementById(id).classList.remove("selected")
    } else {
      document.getElementById(id).classList.add("selected")
    }
  })
}