import * as dayjs from 'dayjs';

export interface IPersonne {
  id?: number;
  tests?: number;
  importes?: number;
  positifs?: number;
  deces?: number;
  gueris?: number;
  date?: dayjs.Dayjs;
}

export class Personne implements IPersonne {
  constructor(
    public id?: number,
    public tests?: number,
    public importes?: number,
    public positifs?: number,
    public deces?: number,
    public gueris?: number,
    public date?: dayjs.Dayjs
  ) {}
}

export function getPersonneIdentifier(personne: IPersonne): number | undefined {
  return personne.id;
}
