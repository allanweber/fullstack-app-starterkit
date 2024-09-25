export interface Transaction {
  id: number;
  accountId: number;
  date: string;
  amount: number;
  categoryId: number;
  type: string;
  description: string;
  account: Account;
  category: Category;
  tags: Tags[];
}

export interface Account {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  type: string;
}

export interface Tags {
  tag: Tag;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}
