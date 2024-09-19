export const calculatePrice = (price: number, discount: number): number => {
  return price - (price * discount) / 100;
};
