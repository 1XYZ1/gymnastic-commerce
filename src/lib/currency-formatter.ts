export const currencyFormatter = (value: number) => {
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 2,
  });
};
