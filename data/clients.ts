export interface Client {
  id: string;
  name: string;
  /** Basename in /public/images/clients/ (e.g. Client-1) — extension resolved at runtime */
  imageFile: string;
}

export const CLIENT_LOGO_PLACEHOLDER = "/images/clients/client-placeholder.svg";

export const CLIENT_IMAGE_EXTENSIONS = [".png", ".jpg", ".webp"] as const;

export const clients: Client[] = [
  { id: "1", name: "L&T Construction", imageFile: "Client-1" },
  { id: "2", name: "Tata Projects", imageFile: "Client-2" },
  { id: "3", name: "HCC Ltd", imageFile: "Client-3" },
  { id: "4", name: "Gammon India", imageFile: "Client-4" },
  { id: "5", name: "NCC Limited", imageFile: "Client-5" },
  { id: "6", name: "Simplex Infrastructures", imageFile: "Client-6" },
  { id: "7", name: "AFCONS", imageFile: "Client-7" },
  { id: "8", name: "Shapoorji Pallonji", imageFile: "Client-8" },
  { id: "9", name: "GMR Group", imageFile: "Client-9" },
  { id: "10", name: "Reliance Infrastructure", imageFile: "Client-10" },
  { id: "11", name: "JSW Infrastructure", imageFile: "Client-11" },
  { id: "12", name: "Adani Ports", imageFile: "Client-12" },
];
