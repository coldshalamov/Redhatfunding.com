export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);
  if (part3) {
    return `(${part1}) ${part2}-${part3}`;
  }
  if (part2) {
    return `(${part1}) ${part2}`;
  }
  if (part1) {
    return `(${part1}`;
  }
  return '';
};

export const normalizePhone = (value: string) => value.replace(/\D/g, '');
