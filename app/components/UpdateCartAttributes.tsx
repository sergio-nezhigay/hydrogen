import {CartForm} from '@shopify/hydrogen';

export function UpdateCartAttributes({totalIncome}: {totalIncome: number}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.AttributesUpdateInput}
      inputs={{
        attributes: [
          {
            key: 'TotalIncome', // Custom attribute key
            value: totalIncome.toString(), // Convert to string since cart attributes must be strings
          },
        ],
      }}
    >
      <button type="submit" className="size-4">
        A
      </button>
    </CartForm>
  );
}
