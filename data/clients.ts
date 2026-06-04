export interface Client {
  id: string;
  name: string;
  logo: string;
}

export const CLIENT_CLEARBIT: Record<string, string> = {
  "1": "larsentoubro.com",
  "2": "tataprojects.com",
  "3": "hccindia.com",
  "4": "gammonindia.com",
  "5": "nccindia.com",
  "6": "simplexinfra.com",
  "7": "afcons.com",
  "8": "sppcl.com",
  "9": "gmrgroup.in",
  "10": "rinfra.com",
  "11": "jsw.in",
  "12": "adaniports.com",
};

export const clients: Client[] = [
  { id: "1", name: "L&T Construction", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["1"]}?size=128` },
  { id: "2", name: "Tata Projects", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["2"]}?size=128` },
  { id: "3", name: "HCC Ltd", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["3"]}?size=128` },
  { id: "4", name: "Gammon India", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["4"]}?size=128` },
  { id: "5", name: "NCC Limited", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["5"]}?size=128` },
  { id: "6", name: "Simplex Infrastructures", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["6"]}?size=128` },
  { id: "7", name: "AFCONS", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["7"]}?size=128` },
  { id: "8", name: "Shapoorji Pallonji", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["8"]}?size=128` },
  { id: "9", name: "GMR Group", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["9"]}?size=128` },
  { id: "10", name: "Reliance Infrastructure", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["10"]}?size=128` },
  { id: "11", name: "JSW Infrastructure", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["11"]}?size=128` },
  { id: "12", name: "Adani Ports", logo: `https://logo.clearbit.com/${CLIENT_CLEARBIT["12"]}?size=128` },
];
