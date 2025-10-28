import { render, fireEvent } from '@testing-library/react-native';
import { StarRating } from '@/components/StarRating';

describe('StarRating', () => {
  it('renders correct number of stars', () => {
    const { getAllByTestId } = render(
      <StarRating rating={3} testID="star-rating" />
    );
    const stars = getAllByTestId(/star-rating-star-/);
    expect(stars).toHaveLength(5);
  });

  it('displays correct rating visually', () => {
    const { getByTestId } = render(
      <StarRating rating={3} testID="star-rating" />
    );

    // Check that stars 1-3 are filled
    for (let i = 1; i <= 3; i++) {
      const star = getByTestId(`star-rating-star-${i}`);
      expect(star.props.accessibilityState.selected).toBe(true);
    }

    // Check that stars 4-5 are not filled
    for (let i = 4; i <= 5; i++) {
      const star = getByTestId(`star-rating-star-${i}`);
      expect(star.props.accessibilityState.selected).toBe(false);
    }
  });

  it('calls onRatingChange when star is pressed', () => {
    const mockOnRatingChange = jest.fn();
    const { getByTestId } = render(
      <StarRating
        rating={0}
        onRatingChange={mockOnRatingChange}
        testID="star-rating"
      />
    );

    const star3 = getByTestId('star-rating-star-3');
    fireEvent.press(star3);

    expect(mockOnRatingChange).toHaveBeenCalledWith(3);
  });

  it('does not call onRatingChange when readonly', () => {
    const mockOnRatingChange = jest.fn();
    const { getByTestId } = render(
      <StarRating
        rating={3}
        onRatingChange={mockOnRatingChange}
        readonly
        testID="star-rating"
      />
    );

    const star5 = getByTestId('star-rating-star-5');
    fireEvent.press(star5);

    expect(mockOnRatingChange).not.toHaveBeenCalled();
  });

  it('has correct accessibility labels', () => {
    const { getByTestId } = render(
      <StarRating rating={3} testID="star-rating" />
    );

    const star1 = getByTestId('star-rating-star-1');
    expect(star1.props.accessibilityLabel).toBe('1 star');

    const star3 = getByTestId('star-rating-star-3');
    expect(star3.props.accessibilityLabel).toBe('3 stars');
  });
});
