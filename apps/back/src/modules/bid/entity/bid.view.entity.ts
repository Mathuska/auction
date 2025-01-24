import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'bid_view',
  expression: `
    SELECT DISTINCT ON (data->>'id') 
        data->>'id' AS id,
        data->>'bidder_id' AS bidder_id,
        data->>'auction_id' AS auction_id,
        (data->>'amount')::numeric AS amount,
        data->>'bid_time' AS bid_time
    FROM events
    WHERE aggregation_type = 'bid'
    ORDER BY data->>'id', data->>'bid_time' DESC;
  `,
})
export class BidView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  bidder_id: string;

  @ViewColumn()
  auction_id: string;

  @ViewColumn()
  amount: number;

  @ViewColumn()
  bid_time: Date;
}
