import { expand, type DotenvExpandOptions } from "dotenv-expand";
// expand is a function
// we need to extend the paramter type of expand which is a object
// we need to allow ignoreProcessEnv: boolean in the object
declare module "dotenv-expand" {
  export type Test = string;
  export function expand(
    options?: DotenvExpandOptions & { ignoreProcessEnv: boolean },
  ): DotenvExpandOutput;
}
