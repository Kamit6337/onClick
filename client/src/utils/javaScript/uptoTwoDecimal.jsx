const uptoTwoDecimal = (number, decimalTill = 2) => {
  const roundedNumber = parseFloat(number.toFixed(decimalTill));

  return roundedNumber;
};

export default uptoTwoDecimal;
