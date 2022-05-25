export async function suppressErrorOutput(fn) {
  const original = console.error;
  console.error = () => {};
  const ret = await fn();
  console.error = original;
  return ret;
}
