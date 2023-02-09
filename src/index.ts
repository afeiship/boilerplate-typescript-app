const SPLIT_RE = /[._\s-]/;

export default (inString): string => {
  const parts = inString.split(SPLIT_RE);
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};
