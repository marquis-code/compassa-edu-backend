import { User } from './user.interface';
import { Message } from './message.interface';
import { BaseGroup } from './base-group.interface';

export interface PopulatedGroup extends Omit<BaseGroup, 'members'> {
  members: User[];
  messages: Message[];
}