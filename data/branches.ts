export interface BranchContact {
  name: string;
  number: string;
  display: string;
}

export interface Branch {
  city: string;
  label: string;
  entity: string;
  contacts: BranchContact[];
}

export const branches: Branch[] = [
  {
    city: "Kolkata",
    label: "Head Office",
    entity: "Alamdaar Engineering Concern",
    contacts: [
      {
        name: "Huzaifa Yusuf Ali",
        number: "919831046296",
        display: "+91 9831046296",
      },
      {
        name: "Mufaddal",
        number: "916289897402",
        display: "+91 6289897402",
      },
    ],
  },
  {
    city: "Hyderabad",
    label: "Hyderabad Branch",
    entity: "Husaini Enterprises",
    contacts: [
      {
        name: "Mufaddal",
        number: "917093741001",
        display: "+91 70937 41001",
      },
      {
        name: "Taha Yusuf Ali",
        number: "919849133652",
        display: "+91 98491 33652",
      },
    ],
  },
  {
    city: "Chennai",
    label: "Chennai Branch",
    entity: "Eastern Trading Corporation",
    contacts: [
      {
        name: "Murtaza Yusuf Ali",
        number: "919841120123",
        display: "+91 98411 20123",
      },
      {
        name: "Branch",
        number: "918013638296",
        display: "+91 80136 38296",
      },
    ],
  },
];

export const ctaLinks = {
  whatsapp: branches.map((b) => ({
    label: b.city === "Kolkata" ? "Kolkata HO" : b.city,
    name: b.entity,
    number: b.contacts[0].number,
  })),
  facebook: "https://www.facebook.com/share/18Za6Eiaks/",
  instagram: [
    {
      label: "AEC Kolkata",
      handle: "@aec._.kol",
      url: "https://www.instagram.com/aec._.kol?igsh=MXJld2dleTQxOTc2dw==",
    },
    {
      label: "AEC",
      handle: "@aec._.sec",
      url: "https://www.instagram.com/aec._.sec?igsh=ZWdreTVpcHAxZmxp",
    },
  ],
  email: "mailto:alamdaar.ropeclamps@gmail.com",
};
