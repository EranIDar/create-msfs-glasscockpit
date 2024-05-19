class glasscockpitID extends BaseInstrument {
  constructor() {
    super();
  }

  get templateID(): string {
    return "glasscockpitID";
  }

  public Init(): void {
    super.Init();
  }

  public connectedCallback(): void {
    super.connectedCallback();

    const electricityElement = document.getElementById("Electricity")!;

    const newElement = document.createElement("div");
    newElement.innerHTML = "Hello world!";

    electricityElement.appendChild(newElement);

    const imgElement = document.createElement("img");
    imgElement.src =
      "coui://html_ui/Pages/VCockpit/Instruments/glasscockpitID/assets/placeholder.png";

    electricityElement.appendChild(imgElement);
  }

  public Update(): void {
    super.Update();
  }
}

registerInstrument("glasscockpit-id", glasscockpitID);
