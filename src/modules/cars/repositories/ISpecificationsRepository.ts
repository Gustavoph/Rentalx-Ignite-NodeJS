import { Specification } from '../entities/Specification';

// DTO => Data trnsfer object
interface ICreateSpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ICreateSpecificationDTO): void;
  findByName(name: string): Specification;
}

export { ISpecificationsRepository, ICreateSpecificationDTO };
