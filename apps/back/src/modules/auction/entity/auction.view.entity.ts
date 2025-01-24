import { ViewEntity, ViewColumn } from 'typeorm';
import { AuctionStatus } from 'src/core/enums/AuctionStatus';

@ViewEntity({
  name: 'auction_view',
  expression: `
    SELECT DISTINCT ON (data->>'id') 
        data->>'id' AS id,
        data->>'seller_id' AS seller_id,
        data->>'product_id' AS product_id,
        data->>'start_time' AS start_time,
        data->>'end_time' AS end_time,
        (data->>'starting_price')::numeric AS starting_price,
        (data->>'ending_price')::numeric AS ending_price,
        data->>'status' AS status,
        data->>'updated_at' AS updated_at
    FROM events
    WHERE aggregation_type = 'auction'
    ORDER BY data->>'id', data->>'updated_at' DESC;
  `,
})
export class AuctionView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  seller_id: string;

  @ViewColumn()
  product_id: string;

  @ViewColumn()
  start_time: Date;

  @ViewColumn()
  end_time: Date;

  @ViewColumn()
  starting_price: number;

  @ViewColumn()
  ending_price: number;

  @ViewColumn()
  status: AuctionStatus;

  @ViewColumn()
  updated_at: Date;
}
