import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entity/event.entity';
import { EventType } from 'src/core/enums/EventType';
import { AggregatorType } from 'src/core/enums/AggregatorType';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async createEvent(
    event_type: EventType,
    aggregation_type: AggregatorType,
    data: any,
  ) {
    const newEvent = new EventEntity();
    Object.assign(newEvent, {
      event_type,
      aggregation_type,
      aggregator_id: data.id,
      data,
    });

    return await this.eventRepository.save(newEvent);
  }
}
