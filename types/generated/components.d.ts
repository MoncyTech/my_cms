import type { Schema, Struct } from '@strapi/strapi';

export interface BookingTableSelection extends Struct.ComponentSchema {
  collectionName: 'components_booking_table_selections';
  info: {
    displayName: 'Table Selection';
  };
  attributes: {
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
    table_id: Schema.Attribute.Relation<
      'oneToOne',
      'api::table-type.table-type'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'booking.table-selection': BookingTableSelection;
    }
  }
}
