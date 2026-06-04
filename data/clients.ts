export interface Client {
  id: string;
  name: string;
  logo: string;
}

/** Local placeholder only — replace with /public/images/clients/*.png when available */
export const CLIENT_LOGO_PLACEHOLDER = "/images/clients/client-placeholder.svg";

export const clients: Client[] = [
  { id: "1", name: "L&T Construction", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "2", name: "Tata Projects", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "3", name: "HCC Ltd", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "4", name: "Gammon India", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "5", name: "NCC Limited", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "6", name: "Simplex Infrastructures", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "7", name: "AFCONS", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "8", name: "Shapoorji Pallonji", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "9", name: "GMR Group", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "10", name: "Reliance Infrastructure", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "11", name: "JSW Infrastructure", logo: CLIENT_LOGO_PLACEHOLDER },
  { id: "12", name: "Adani Ports", logo: CLIENT_LOGO_PLACEHOLDER },
];
