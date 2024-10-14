import {Form, useActionData} from '@remix-run/react';
import {useState, useEffect} from 'react';

import {Heading, Section, Text} from '~/components/Text';
import {Button} from '~/components/ui/button';
import {useTranslation} from '~/lib/utils';

import {star, filledStar} from './StarRating';

interface ReviewFormProps {
  productId: string;
}

interface ActionData {
  success?: boolean;
  error?: string;
}

interface StarInputProps {
  rating: number;
  setRating: (rating: number) => void;
}

function StarInput({rating, setRating}: StarInputProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const {translation} = useTranslation();
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
      className="mb-4 text-center"
      role="radiogroup"
      aria-labelledby="rating-label"
    >
      <label id="rating-label" htmlFor="rating" className="block text-lg mb-2">
        {translation.your_rating}
      </label>
      <ul id="rating" className="inline-flex gap-1 p-0 list-none">
        {[1, 2, 3, 4, 5].map((index) => (
          <li key={index} className="inline-block">
            <button
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
              className="focus:outline-blue-600"
            >
              {hoverRating >= index || rating >= index ? filledStar : star}
            </button>
          </li>
        ))}
      </ul>
      <input type="hidden" name="rating" value={rating} />
    </div>
  );
}

export function ReviewForm({productId}: ReviewFormProps) {
  const actionData = useActionData<ActionData>();
  const {translation} = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [body, setBody] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setName('');
      setEmail('');
      setRating(0);
      setBody('');
      setFormVisible(false);
    }
  }, [actionData]);

  const handleButtonClick = () => {
    setFormVisible(true);
  };

  return (
    <Section
      heading="Review Form"
      headingClassName="sr-only"
      padding="y"
      className="pb-6"
      id="review-form"
    >
      {!formVisible ? (
        <Button
          onClick={handleButtonClick}
          variant="secondary"
          className="mx-auto block bg-gray-200 text-indigo-700/80 rounded hover:bg-gray-400"
        >
          {translation.leave_a_review}
        </Button>
      ) : (
        <>
          <Heading as="h2" className="mb-4 text-center max-w-full">
            {translation.submit_a_review}
          </Heading>
          <Form
            method="post"
            className="p-4 border rounded-lg shadow-md bg-main w-full max-w-lg mx-auto"
          >
            <input type="hidden" name="productId" value={productId} />
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg mb-2">
                {translation.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-required="true"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg mb-2">
                {translation.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <StarInput rating={rating} setRating={setRating} />
            <div className="mb-4">
              <label htmlFor="body" className="block text-lg mb-2">
                {translation.review_body}
              </label>
              <textarea
                id="body"
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                aria-required="true"
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <Button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {translation.submit_review}
            </Button>
          </Form>
          {actionData?.error && (
            <Text as="p" className="text-red-500 text-center mt-4" role="alert">
              {actionData.error}
            </Text>
          )}
          {actionData?.success && (
            <Text
              as="p"
              className="text-green-500 text-center mt-4"
              role="status"
            >
              {translation.thank_you_for_review}
            </Text>
          )}
        </>
      )}
    </Section>
  );
}
