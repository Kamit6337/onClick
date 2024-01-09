const uptoTwoDecimal = (number, decimalTill = 2) => {
  const roundedNumber = parseFloat(number.toFixed(decimalTill));

  return roundedNumber;
};

const bytesToKbMb = (bytes) => {
  if (isNaN(bytes)) return bytes;

  const toKb = +bytes / 1024;
  const toMb = toKb / 1024;

  if (toMb < 1) {
    const KB = uptoTwoDecimal(toKb);
    return `${KB} kb`;
  }

  const MB = uptoTwoDecimal(toMb);

  return `${MB} mb`;
};

export default bytesToKbMb;
