//import * as fs from 'node:fs';
import fs from "fs/promises";
import { z } from "zod";

const movieDB = {
  professionals: [],
  movies: [],
  genres: [],
};

//write you code after this line
type Professional = { id: number; name: string; roles: string[] };

type Movie = {
  title: string;
  year: number;
  runtime?: number;
  genres: string[];
  "release-date": string;
  writers: string[] | number[];
  actors: string[] | number[];
  storyline?: string;
  directors: string[] | number[];
};

type MovieDB = {
  professionals: Professional[];
  movies: Movie[];
  genres: string[];
};

const movieSchema = z.object({
  movies: z
    .object({
      title: z.string(),
      year: z.number(),
      runtime: z.number().optional(),
      genres: z.array(z.string()),
      "release-date": z.string(),
      writers: z.array(z.string()),
      actors: z.array(z.string()),
      storyline: z.string().optional(),
      directors: z.array(z.string()),
    })
    .array(),
});

type MainData = z.infer<typeof movieSchema>;

//task 1

const singularize = (str: string) => str.slice(0, -1);

const addProfessionals = (
  data: MainData,
  professionalsArray: Professional[],
  type: "writers" | "actors" | "directors"
) => {
  const myData = data.movies;
  for (let i = 0; i < myData.length; i++) {
    const movie = myData[i];
    for (let j = 0; j < movie[type].length; j++) {
      const name = movie[type][j].trim();
      const singularType = singularize(type);
      let isDuplicate = false;

      for (let k = 0; k < professionalsArray.length; k++) {
        const element = professionalsArray[k];
        if (element.name === name) {
          isDuplicate = true;
          if (!element.roles.includes(singularType)) {
            element.roles.push(singularType);
          }
          break;
        }
      }

      if (!isDuplicate) {
        professionalsArray.push({
          id: professionalsArray.length + 1,
          name: name,
          roles: [singularType],
        });
      }
    }
  }
};

//task 2

const idReplacement = (
  moviesArray: Movie[],
  professionalsArray: Professional[],
  type: "actors" | "writers" | "directors"
) => {
  for (let i = 0; i < moviesArray.length; i++) {
    const movie = moviesArray[i];
    for (let j = 0; j < movie[type].length; j++) {
      const name: string | number = movie[type][j].trim();

      for (let k = 0; k < professionalsArray.length; k++) {
        if (professionalsArray[k].name === name) {
          movie[type][j] = professionalsArray[k].id;
          break;
        }
      }
    }
  }
};

const readData = async () => {
  try {
    const input = await fs.readFile(`${__dirname}/../data.json`, "utf-8");
    const jsonData = JSON.parse(input);

    const result = movieSchema.safeParse(jsonData);

    if (!result.success) return console.log(result.error.issues);

    const validatedData = result.data;
    addProfessionals(validatedData, movieDB.professionals, "writers");
    addProfessionals(validatedData, movieDB.professionals, "actors");
    addProfessionals(validatedData, movieDB.professionals, "directors");

    movieDB.movies = [...validatedData.movies];
    return movieDB;
  } catch (error) {
    console.log(error);
  }
};

const main = async () => {
  const result = await readData();

  if (result) {
    idReplacement(result.movies, result.professionals, "writers");
    idReplacement(result.movies, result.professionals, "actors");
    idReplacement(result.movies, result.professionals, "directors");

    console.log(result.movies);
  }
};
main();

//write your code before this line

export { movieDB };
