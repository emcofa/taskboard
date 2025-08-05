// utils/toCamelCase.ts
type CamelCase<T extends string> = T extends `${infer P}_${infer R}`
  ? `${P}${Capitalize<CamelCase<R>>}`
  : T;

type ToCamelCase<T> = T extends Array<infer U>
  ? Array<ToCamelCase<U>>
  : T extends object
  ? {
      [K in keyof T as CamelCase<K & string>]: ToCamelCase<T[K]>;
    }
  : T;

export function toCamelCase<T>(row: T): ToCamelCase<T> {
  if (Array.isArray(row)) {
    return row.map(toCamelCase) as ToCamelCase<T>;
  }

  if (row && typeof row === 'object') {
    if (row instanceof Date) {
      return row as ToCamelCase<T>;
    }
    
    const newObj: any = {};
    for (const key in row) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      newObj[camelKey] = toCamelCase(row[key]);
    }
    return newObj as ToCamelCase<T>;
  }

  return row as ToCamelCase<T>;
} 