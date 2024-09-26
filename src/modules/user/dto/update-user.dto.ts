import { PartialType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

/**
 * An UpdateUserDTO object.
 */
export class UpdateUserDTO extends PartialType(UserDTO) {
}
