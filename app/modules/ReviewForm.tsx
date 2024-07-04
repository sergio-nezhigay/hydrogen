// app/components/ReviewForm.tsx
import {Form, useActionData} from '@remix-run/react';

interface ReviewFormProps {
  productId: string;
}

interface ActionData {
  success?: boolean;
  error?: string;
}

export function ReviewForm({productId}: ReviewFormProps) {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h2>Submit a Review</h2>
      <Form method="post">
        <input type="hidden" name="productId" value={productId} />
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label htmlFor="title">Review Title</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="body">Review Body</label>
          <textarea id="body" name="body" required></textarea>
        </div>
        <button type="submit">Submit Review</button>
      </Form>
      {actionData?.error && <p style={{color: 'red'}}>{actionData.error}</p>}
      {actionData?.success && <p>Thank you for your review!</p>}
    </div>
  );
}
