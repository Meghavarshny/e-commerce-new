const formatPrice = (price) => {
  return Number(price).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
};

module.exports = formatPrice;
