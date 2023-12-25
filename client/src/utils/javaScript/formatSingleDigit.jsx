const formatSingleDigit = (number) => {
  // Ensure the input is a valid number
  const parsedNumber = parseInt(number);
  if (isNaN(parsedNumber)) {
    throw new Error("Input must be a number.");
  }

  // Check if the number is a single digit
  if (parsedNumber >= 0 && parsedNumber <= 9) {
    // Use template literals to add leading zero
    return `0${parsedNumber}`;
  } else {
    // Return the original number if not a single digit
    return `${parsedNumber}`;
  }
};

export default formatSingleDigit;
