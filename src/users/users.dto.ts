export interface UserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
