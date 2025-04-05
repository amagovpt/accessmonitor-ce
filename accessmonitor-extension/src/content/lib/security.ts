import SparkMD5 from "spark-md5";

export function generateMd5Hash(content: string): string {
  return new SparkMD5().append(content).end();
}
