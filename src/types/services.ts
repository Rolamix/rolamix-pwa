export interface Post {
  userId: string | number;
  id: number;
  title: string;
  body: string;
}

interface UserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: Company;
  address: UserAddress;
}

// we can also pass in things like male/female, counts, and interpolation rules
export interface TranslationMethodOptions {
  replace?: { [key: string]: any };
}
