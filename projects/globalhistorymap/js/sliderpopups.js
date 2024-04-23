//Default slider position
$(
  "#infoLayerGrantLots, #infoLayerCurrLots, #infoLayerDutchGrants, #demoLayerInfo, #infoLayerCastello, #infoLayerNativeGroups"
).slideUp();

const extractTextFromHTML = (htmlString) => $("<div>").html(htmlString).text();

const addFieldToPopup = (
  fieldContent,
  displayMode = "",
  addExtraBreak = "",
  defaultValue = ""
) => {
  let content = fieldContent
    ? displayMode === "unlinked"
      ? extractTextFromHTML(fieldContent)
      : fieldContent
    : defaultValue;
  return content
    ? (addExtraBreak === "break" ? "<br>" : "") + content + "<br>"
    : "";
};

const buildPopUpInfo = (props, sliderPopupName, type) => {
    console.log(props);
	
    let popup_html = "";
	
        popup_html = `<h3>Germany</h3><hr><br><b>${props.label}</b> <br><br><b>Start:</b> <i>${props.start2}</i><br><b>End:</b> <i>${props.end2}</i><br><br>`;

    $(sliderPopupName).html(popup_html);
	
	//$("#infoLayerDutchGrants").html(popup_html);
  
};
