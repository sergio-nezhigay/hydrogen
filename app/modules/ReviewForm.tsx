import {Form, useActionData} from '@remix-run/react';
import {useState, useEffect} from 'react';

import {translations} from '~/data/translations';
import {Star} from '~/components/Icon'; // Adjust the import path as necessary

interface ReviewFormProps {
  productId: string;
  locale: keyof typeof translations;
}

interface ActionData {
  success?: boolean;
  error?: string;
}

interface StarInputProps {
  rating: number;
  setRating: (rating: number) => void;
  locale: keyof typeof translations;
}

function StarInput({rating, setRating, locale}: StarInputProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const translation = translations[locale];
  const handleStarClick = (index: number) => {
    setRating(index);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStarClick(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div
      className="star-input"
      role="radiogroup"
      aria-labelledby="rating-label"
    >
      <label id="rating-label" htmlFor="rating">
        {translation.your_rating}
      </label>
      <div id="rating" className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              handleStarClick(index);
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onKeyDown={(e) => handleKeyDown(index, e)}
            tabIndex={0}
            role="radio"
            aria-checked={rating >= index}
            aria-label={`${index} Star${index > 1 ? 's' : ''}`}
          >
            <Star
              fill={hoverRating >= index || rating >= index ? 'full' : 'empty'}
            />
          </button>
        ))}
      </div>
      <input type="hidden" name="rating" value={rating} />
    </div>
  );
}

export function ReviewForm({productId, locale}: ReviewFormProps) {
  const actionData = useActionData<ActionData>();
  const translation = translations[locale];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (actionData?.success) {
      setName('');
      setEmail('');
      setRating(0);
      setTitle('');
      setBody('');
    }
  }, [actionData]);

  return (
    <div>
      <h2>{translation.submit_a_review}</h2>
      <Form method="post">
        <input type="hidden" name="productId" value={productId} />
        <div>
          <label htmlFor="name">{translation.name}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="email">{translation.email}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <StarInput rating={rating} setRating={setRating} locale={locale} />
        <div>
          <label htmlFor="title">{translation.review_title}</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="body">{translation.review_body}</label>
          <textarea
            id="body"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            aria-required="true"
          ></textarea>
        </div>
        <button type="submit">{translation.submit_review}</button>
      </Form>
      {actionData?.error && (
        <p style={{color: 'red'}} role="alert">
          {actionData.error}
        </p>
      )}
      {actionData?.success && (
        <p role="status">{translation.thank_you_for_review}</p>
      )}
    </div>
  );
}
