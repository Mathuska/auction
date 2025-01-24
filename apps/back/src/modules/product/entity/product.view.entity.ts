import { ViewEntity, ViewColumn } from 'typeorm';
import { ProductStatus } from 'src/core/enums/ProductStatus';

@ViewEntity({
  name: 'product_view',
  expression: `
    SELECT DISTINCT ON (data->>'id') 
        data->>'id' AS id,
        data->>'description' AS description,
        data->>'product_type' AS product_type,
        data->>'seller_id' AS seller_id,
        data->>'buyer_id' AS buyer_id,
        data->>'auction_id' AS auction_id,
        (data->>'start_price')::numeric AS start_price,
        data->>'status' AS status,
        data->>'updated_at' AS updated_at
    FROM events
    WHERE aggregation_type = 'product'
    ORDER BY data->>'id', data->>'updated_at' DESC;
  `,
})
export class ProductView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  description: string;

  @ViewColumn()
  product_type: string;

  @ViewColumn()
  seller_id: string;

  @ViewColumn()
  buyer_id: string;

  @ViewColumn()
  auction_id: string;

  @ViewColumn()
  start_price: number;

  @ViewColumn()
  status: ProductStatus;

  @ViewColumn()
  updated_at: Date;
}
