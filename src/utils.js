const bagTemplate = {
  brand: '',
  label: '',
  process: '',
  origin: {
    producer: '',
    country: '',
    region: '',
    farm: '',
    elevation: '',
  },
  varietals: [],
  flavorNotes: [],
  roastLevel: '',
  notes: '',
};

const brewTemplate = {
  coffeeBag: bagTemplate,
  roastDate: null,
  method: '',
  grinder: '',
  grindSetting: '',
  temperature: '',
  time: {
    total: '',
    bloom: '',
    drain: '',
  },
  notes: '',
  rating: 5,
  attachments: [],
};

export {
  bagTemplate,
  brewTemplate,
};
