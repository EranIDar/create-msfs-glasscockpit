class glasscockpitID extends BaseInstrument {
  constructor() {
    super();
  }

  get templateID() {
    return "glasscockpitID";
  }

  Init() {
    super.Init();
  }

  connectedCallback() {
    super.connectedCallback();

    const electricityElement = document.getElementById("Electricity");

    const newElement = document.createElement("div");
    newElement.innerHTML = "Hello world!";

    electricityElement.appendChild(newElement);

    const imgElement = document.createElement("img");
    imgElement.src =
      "coui://html_ui/Pages/VCockpit/Instruments/glasscockpitID/assets/placeholder.png";

    electricityElement.appendChild(imgElement);
  }

  Update() {
    super.Update();
  }
}

registerInstrument("glasscockpit-id", glasscockpitID);
