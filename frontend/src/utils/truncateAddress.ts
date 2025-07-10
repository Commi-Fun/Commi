function truncateAddress(text: string): string {
  return text.slice(0, 5) + "..." + text.slice(-3);
}

export default truncateAddress;
