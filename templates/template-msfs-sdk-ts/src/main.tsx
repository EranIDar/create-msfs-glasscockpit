import { FSComponent } from "@microsoft/msfs-sdk";

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
    FSComponent.render(<div>Hello world!</div>, electricityElement);

    FSComponent.render(
      <img
        src="coui://html_ui/Pages/VCockpit/Instruments/glasscockpitID/assets/placeholder.png"
      />,
      electricityElement
    );
  }

  public Update(): void {
    super.Update();
  }
}

registerInstrument("glasscockpit-id", glasscockpitID);
