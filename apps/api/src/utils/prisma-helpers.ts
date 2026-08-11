/**
 * Prisma + `exactOptionalPropertyTypes` helpers.
 *
 * Because the TypeScript config enables `exactOptionalPropertyTypes: true`,
 * passing a Zod-validated input (where optional fields are typed as
 * `string | undefined`) straight into Prisma's `create`/`update` fails the
 * type checker: a present-but-`undefined` key is not assignable to a Prisma
 * input that expects `string | null` (or an absent optional key).
 *
 * `cleanData` returns a shallow copy with every `undefined` property
 * removed at runtime while producing a type that drops the `| undefined`
 * from optional values (but preserves `null`, which Prisma treats as an
 * explicit "set to null").
 */

type WithoutUndefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: Exclude<T[K], undefined>;
};

export function cleanData<T extends Record<string, unknown>>(
  obj: T
): WithoutUndefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as WithoutUndefined<T>;
}
