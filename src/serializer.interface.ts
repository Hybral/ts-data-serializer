export interface Serializable<T> {
  [key: string]: any;
  deserialize(input: any, field?: any): T;
}

export interface IMapper {
  parent: string;
  value?: string | IMapper;
}
