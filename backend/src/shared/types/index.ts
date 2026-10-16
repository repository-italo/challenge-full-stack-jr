export type RemoveUndefined<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
};
