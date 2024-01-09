//import * as fs from 'node:fs';
import fs from "fs/promises";
import { z } from "zod";

const movieDB = {
  professionals: [],
  movies: [],
  genres: [],
};

//write you code after this line

const movieSchema = z.object({
  movies: z
    .object({
      title: z.string(),
      year: z.number(),
      runtime: z.number().optional(),
      genres: z.array(z.string()),
      "release-date": z.string(),
      writers: z.array(z.string()),
      storyline: z.string().optional(),
      directors: z.array(z.string()),
    })
    .array(),
});

type MainData = z.infer<typeof movieSchema>;

const myFunction = (data: MainData) => {
  const myData = data.movies;
  for (let i = 0; i < myData.length; i++) {
    const element = myData[i];
    console.log(element);
  }
};

const readData = async () => {
  try {
    const input = await fs.readFile(`${__dirname}/../data.json`, "utf-8");
    const jsonData = JSON.parse(input);

    const result = movieSchema.safeParse(jsonData);

    if (!result.success) return console.log(result.error.issues);

    const validatedData = result.data;
    myFunction(validatedData);
  } catch (error) {
    console.log(error);
  }
};

readData();
//write your code brefore this line

export { movieDB };
