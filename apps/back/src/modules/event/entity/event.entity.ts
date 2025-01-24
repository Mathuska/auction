import { AggregatorType } from 'src/core/enums/AggregatorType';
import { EventType } from 'src/core/enums/EventType';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EventType })
  event_type: EventType;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'uuid' })
  aggregator_id: string;

  @Column({ type: 'enum', enum: AggregatorType })
  aggregation_type: AggregatorType;

  @Column({ type: 'jsonb' })
  data: any;
}
