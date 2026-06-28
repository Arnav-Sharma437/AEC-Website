export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  year: string;
  fileUrl: string;
  fileType: "pdf" | "image";
  variant: "iso" | "ce" | "isi" | "msme";
}

export const certifications: Certification[] = [
  {
    id: "1",
    name: "ISO 9001:2015",
    issuingBody: "Bureau Veritas",
    year: "2023",
    fileUrl: "/certificates/iso-9001.pdf",
    fileType: "pdf",
    variant: "iso",
  },
  {
    id: "2",
    name: "CE Mark Conformity",
    issuingBody: "European Conformity Assessment",
    year: "2023",
    fileUrl: "/certificates/safety-compliance.pdf",
    fileType: "pdf",
    variant: "ce",
  },
  {
    id: "3",
    name: "ISI Certification",
    issuingBody: "Bureau of Indian Standards",
    year: "2023",
    fileUrl: "/certificates/isi-certification.pdf",
    fileType: "pdf",
    variant: "isi",
  },
  {
    id: "4",
    name: "MSME Registration",
    issuingBody: "Ministry of MSME, Govt. of India",
    year: "2023",
    fileUrl: "/certificates/msme-registration.pdf",
    fileType: "pdf",
    variant: "msme",
  },
];
